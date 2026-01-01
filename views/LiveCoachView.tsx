
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { analyzeResume } from '../services/geminiService';

interface LiveCoachViewProps {
  onBack: () => void;
  userName: string;
  userSkills: string[];
}

type CoachStep = 'RESUME' | 'PERMISSIONS' | 'DIFFICULTY' | 'SESSION';
type Difficulty = 'Beginner' | 'Intermediate' | 'Expert';

const LiveCoachView: React.FC<LiveCoachViewProps> = ({ onBack, userName, userSkills }) => {
  const [step, setStep] = useState<CoachStep>('RESUME');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [resumeSummary, setResumeSummary] = useState<string>('');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [lastCoachRemark, setLastCoachRemark] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Direct cleanup without calling onBack to avoid loop
      if (sessionRef.current) sessionRef.current.close();
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  const stopAllMedia = async () => {
    setLoading(true);
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {
        console.warn("Error closing session:", e);
      }
      sessionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        try {
          await audioContextRef.current.close();
        } catch (e) {
          console.warn("Error closing audio context:", e);
        }
      }
      audioContextRef.current = null;
    }
    
    sourcesRef.current.forEach(source => {
      try {
        source.stop();
      } catch (e) {}
    });
    sourcesRef.current.clear();
    
    setIsActive(false);
    setLoading(false);
    onBack(); // Return to home
  };

  const requestPermissions = async () => {
    setLoading(true);
    setPermissionError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }, 
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        } 
      });
      streamRef.current = stream;
      setLoading(false);
      setStep('DIFFICULTY');
    } catch (err) {
      console.error("Permission denied or device not found:", err);
      setPermissionError(true);
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const summary = await analyzeResume(base64);
      setResumeSummary(summary || '');
      setLoading(false);
      setStep('PERMISSIONS');
    };
    reader.readAsDataURL(file);
  };

  const handleSkipResume = () => {
    setResumeSummary("Candidate has provided skills but no specific resume summary.");
    setStep('PERMISSIONS');
  };

  // Manual encoding/decoding implementations as per guidelines
  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  const playAudio = async (base64Data: string) => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    const bytes = decode(base64Data);
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = audioContextRef.current.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    
    // Gapless playback scheduling
    const startAt = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
    source.start(startAt);
    nextStartTimeRef.current = startAt + buffer.duration;
    
    sourcesRef.current.add(source);
    source.onended = () => {
      sourcesRef.current.delete(source);
    };
  };

  const startSession = async (level: Difficulty) => {
    setDifficulty(level);
    setLoading(true);
    
    // Fixed: Initialize right before making the call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    
    try {
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        await videoRef.current.play().catch(e => console.warn("Video play failed:", e));
      }

      const difficultyPrompts = {
        'Beginner': 'Focus on basic technical concepts and soft skills. Be highly encouraging and provide detailed positive reinforcement.',
        'Intermediate': 'Focus on standard coding questions and behavioral STAR method. Be professional and give constructive critiques on delivery.',
        'Expert': 'Hard DSA questions and deep system design. Be rigorous, interrupt if they are drifting, and provide high-stakes feedback.'
      };

      const systemPrompt = `
        You are the CampusClear AI Interview Coach.
        CANDIDATE: ${userName}
        SKILLS: ${userSkills.join(', ')}
        RESUME: ${resumeSummary}
        LEVEL: ${level}. ${difficultyPrompts[level]}
        
        YOUR ROLE:
        1. Conduct a professional mock interview.
        2. ALWAYS give a short "Coach Review" after the user finishes an answer. 
        3. Critique their tone, confidence, and technical accuracy.
        4. Be direct but helpful. Use phrases like "Coach's Tip: ..." or "Review: ...".
        5. Start now by introducing yourself and asking the first question.
      `;

      // Helper function for manual encoding
      function encode(bytes: Uint8Array) {
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      }

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setLoading(false);
            setStep('SESSION');
            
            if (streamRef.current) {
              const source = inputContext.createMediaStreamSource(streamRef.current);
              const scriptProcessor = inputContext.createScriptProcessor(4096, 1, 1);
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const int16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const base64 = encode(new Uint8Array(int16.buffer));
                
                // CRITICAL: Initiating sendRealtimeInput after connect call resolves.
                sessionPromise.then(s => {
                  try {
                    s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
                  } catch (err) {
                    console.warn("Failed to send audio input:", err);
                  }
                });
              };
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputContext.destination);
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioPart = message.serverContent?.modelTurn?.parts?.find(p => p.inlineData);
            const audioData = audioPart?.inlineData?.data;
            if (audioData) playAudio(audioData);

            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              if (text.toLowerCase().includes('coach') || text.toLowerCase().includes('tip')) {
                setLastCoachRemark(text);
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try {
                  s.stop();
                } catch (e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setIsActive(false);
            if (inputContext.state !== 'closed') inputContext.close().catch(() => {});
          },
          onerror: (e) => {
            console.error("Session error:", e);
            setLoading(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: systemPrompt,
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Initialization Failed:", err);
      setLoading(false);
      setPermissionError(true);
    }
  };

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col p-6 overflow-hidden">
      {/* Resume Step */}
      {step === 'RESUME' && (
        <div className="flex-1 flex flex-col pt-12 animate-in fade-in duration-500 max-w-sm mx-auto w-full">
          <button onClick={onBack} className="w-fit text-slate-500 mb-8 flex items-center gap-2 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            Cancel
          </button>
          
          <div className="mb-10">
            <h1 className="text-4xl font-black mb-3 text-emerald-500">Coach Setup</h1>
            <p className="text-slate-400 text-sm font-medium">Upload your resume for a hyper-personalized session.</p>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-6">
            <label className="relative border-2 border-dashed border-slate-800 rounded-[40px] p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-900 hover:border-emerald-500/50 transition-all group overflow-hidden">
              <input type="file" accept="image/*" className="hidden" onChange={handleResumeUpload} disabled={loading} />
              <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              <div className="text-center">
                <p className="font-black text-lg">{loading ? 'Analyzing...' : 'Upload Resume'}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-black">PNG or JPG</p>
              </div>
            </label>
            <button onClick={handleSkipResume} className="w-full py-5 rounded-3xl font-black text-slate-500 border border-slate-800 hover:text-white transition-all uppercase text-[10px] tracking-[0.2em]">
              Skip and Use Profile Skills
            </button>
          </div>
        </div>
      )}

      {/* Permissions Step */}
      {step === 'PERMISSIONS' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
           <div className={`w-24 h-24 ${permissionError ? 'bg-rose-500/20 text-rose-500' : 'bg-blue-500/20 text-blue-500'} rounded-full flex items-center justify-center mb-8 border-2 ${permissionError ? 'border-rose-500/50' : 'border-blue-500/50'}`}>
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
           </div>
           <h2 className="text-3xl font-black mb-4">{permissionError ? 'Access Error' : 'Camera & Mic Access'}</h2>
           <p className="text-slate-400 text-sm max-w-xs mb-10 leading-relaxed">
             {permissionError 
               ? "CampusClear needs camera and microphone access to conduct the mock interview. Please check your browser or system settings and click 'Try Again'."
               : "To begin your immersive mock interview, the AI coach needs to see and hear you."}
           </p>
           <button 
             onClick={requestPermissions}
             disabled={loading}
             className="w-full max-w-xs emerald-gradient text-white py-5 rounded-3xl font-black text-lg shadow-2xl active:scale-95 transition-all"
           >
             {loading ? 'Initializing...' : permissionError ? 'Try Again' : 'Grant Access'}
           </button>
           {permissionError && (
             <button onClick={onBack} className="mt-4 text-slate-500 font-bold hover:text-white transition-colors">Go Back Home</button>
           )}
        </div>
      )}

      {/* Difficulty Step */}
      {step === 'DIFFICULTY' && (
        <div className="flex-1 flex flex-col pt-12 animate-in slide-in-from-right-8 duration-500 max-w-sm mx-auto w-full">
           <div className="flex items-center justify-between mb-10">
              <h2 className="text-4xl font-black text-white">Interview Level</h2>
              <button onClick={onBack} className="p-2 text-slate-500 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>
           <div className="space-y-4">
            {(['Beginner', 'Intermediate', 'Expert'] as Difficulty[]).map((level) => (
              <button
                key={level}
                onClick={() => startSession(level)}
                className="w-full bg-slate-900 border border-slate-800 p-6 rounded-[32px] flex items-center justify-between text-left group hover:border-emerald-500/50 hover:bg-slate-900/40 transition-all active:scale-[0.98]"
              >
                <div>
                  <h3 className={`text-2xl font-black ${level === 'Beginner' ? 'text-emerald-400' : level === 'Intermediate' ? 'text-blue-400' : 'text-rose-400'}`}>
                    {level}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 font-black uppercase tracking-widest italic">
                    {level === 'Beginner' && 'Foundations & Soft Skills'}
                    {level === 'Intermediate' && 'Standard SDE Roleplay'}
                    {level === 'Expert' && 'FAANG Pressure Test'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-slate-700 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7" /></svg>
                </div>
              </button>
            ))}
           </div>
           <button onClick={onBack} className="mt-8 text-slate-500 font-bold text-center w-full uppercase text-xs tracking-widest">
              Return to Home
           </button>
        </div>
      )}

      {/* Interview Session */}
      {step === 'SESSION' && (
        <div className="flex-1 flex flex-col animate-in zoom-in-95 duration-700">
          <div className="flex justify-between items-center mb-6 pt-4">
            <button onClick={stopAllMedia} className="bg-rose-500/10 text-rose-500 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-rose-500 hover:text-white transition-all">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
              Leave Room
            </button>
            <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Gemini Live Active</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            {/* Viewport */}
            <div className="relative flex-1 bg-slate-900 rounded-[48px] overflow-hidden shadow-2xl border border-white/10 group">
               <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover grayscale opacity-20 brightness-50" />
               
               <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center relative mb-6">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping duration-[3000ms]"></div>
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 border-4 border-slate-900">
                       <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-black text-emerald-400 uppercase tracking-[0.3em] mb-8">Coach Zephyr</h2>

                  {/* Coach Live Review Remark */}
                  {lastCoachRemark && (
                    <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-2xl p-6 rounded-[32px] border border-white/10 shadow-2xl animate-in slide-in-from-bottom-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Coach Feedback</span>
                      </div>
                      <p className="text-sm font-bold text-slate-100 leading-relaxed">
                        {lastCoachRemark}
                      </p>
                    </div>
                  )}
               </div>

               {/* Standard Close Icon as fallback exit */}
               <button onClick={stopAllMedia} className="absolute top-8 right-8 w-12 h-12 bg-black/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white/50 hover:text-white hover:bg-rose-500 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>

               {/* User PiP */}
               <div className="absolute bottom-8 right-8 w-28 aspect-[3/4] bg-black rounded-3xl border-2 border-white/20 overflow-hidden shadow-2xl z-20">
                 <video 
                   autoPlay muted playsInline 
                   ref={(el) => { if(el && streamRef.current) el.srcObject = streamRef.current }} 
                   className="w-full h-full object-cover" 
                 />
                 <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest">Live Cam</div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-900/50 p-5 rounded-[32px] border border-white/5">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Session Mode</p>
                  <p className="font-bold text-xs text-white">Full-stack Review</p>
               </div>
               <div className="bg-slate-900/50 p-5 rounded-[32px] border border-white/5">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">AI Pulse</p>
                  <p className="font-bold text-xs text-emerald-400">Stable</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center">
           <div className="flex flex-col items-center gap-8">
              <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">Syncing Streams</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LiveCoachView;

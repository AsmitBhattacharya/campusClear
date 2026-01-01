
import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/geminiService';

interface FlashPrepViewProps {
  onBack: () => void;
  skills: string[];
}

const FlashPrepView: React.FC<FlashPrepViewProps> = ({ onBack, skills }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [skills]);

  const loadQuiz = async () => {
    setLoading(true);
    setQuizComplete(false);
    setCurrentIdx(0);
    setScore(0);
    setSelected(null);
    try {
      const q = await generateQuiz(skills);
      setQuestions(q);
    } catch (err) {
      console.error("Quiz generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === questions[currentIdx].answer) setScore(score + 1);
  };

  const next = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
    } else {
      setQuizComplete(true);
    }
  };

  const getBadge = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return { label: 'Tech Titan', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (percentage >= 70) return { label: 'Elite Engineer', color: 'text-blue-500', bg: 'bg-blue-500/10' };
    if (percentage >= 50) return { label: 'Rising Star', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { label: 'Beginner', color: 'text-slate-500', bg: 'bg-slate-500/10' };
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-black text-white mb-2 uppercase tracking-widest">Generating 10 MCQs</h2>
        <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Gemini is crafting high-impact questions tailored to your skills: {skills.join(', ')}</p>
      </div>
    );
  }

  if (quizComplete) {
    const badge = getBadge();
    return (
      <div className="h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
        <div className={`w-24 h-24 ${badge.bg} rounded-[32px] flex items-center justify-center mb-6 border border-white/10`}>
           <svg className={`w-12 h-12 ${badge.color}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168l4.74 3.504a.5.5 0 010 .828l-4.74 3.504a.5.5 0 01-.795-.414V7.582a.5.5 0 01.795-.414z" clipRule="evenodd" /></svg>
        </div>
        <h2 className="text-5xl font-black text-white mb-2">{score}<span className="text-2xl text-slate-600">/{questions.length}</span></h2>
        <div className={`px-4 py-1.5 rounded-full ${badge.bg} ${badge.color} text-[10px] font-black uppercase tracking-widest mb-8`}>
          {badge.label}
        </div>
        
        <p className="text-slate-400 text-sm mb-12 text-center max-w-xs">
          {score === questions.length ? "Incredible! You're ready for the big leagues." : "Consistent practice is the key to mastering these concepts."}
        </p>

        <div className="w-full space-y-4">
          <button 
            onClick={loadQuiz} 
            className="w-full emerald-gradient py-5 rounded-3xl font-black text-lg shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all"
          >
            Retake Quiz
          </button>
          <button 
            onClick={onBack} 
            className="w-full bg-slate-800 text-slate-400 py-5 rounded-3xl font-black text-lg active:scale-95 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="h-screen bg-slate-50 flex flex-col animate-in fade-in duration-300">
      {/* Quiz Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 shadow-sm relative z-10">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="text-center">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Flash Prep</h2>
            <p className="text-[10px] font-bold text-slate-400">Question {currentIdx + 1} of {questions.length}</p>
          </div>
          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs">
            {score}
          </div>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mb-6">
          <h3 className="text-lg font-bold text-slate-900 leading-relaxed">
            {q.question}
          </h3>
        </div>
        
        <div className="space-y-3">
          {q.options.map((opt: string) => (
            <button 
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`w-full text-left p-5 rounded-2xl font-bold text-sm transition-all border-2 
                ${selected === opt 
                  ? (opt === q.answer ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-rose-50 border-rose-500 text-rose-700') 
                  : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                }
                ${selected && opt === q.answer ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-500/10' : ''}
                ${selected && opt !== q.answer && selected === opt ? 'shadow-lg shadow-rose-500/10' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {selected && opt === q.answer && (
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                )}
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
            <div className="bg-slate-900 text-white p-6 rounded-[32px] shadow-xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">Expert Insight</h4>
              <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                {q.explanation}
              </p>
              <button 
                onClick={next} 
                className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {currentIdx === questions.length - 1 ? 'See Results' : 'Next Question'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashPrepView;

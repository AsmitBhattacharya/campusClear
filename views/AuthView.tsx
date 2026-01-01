
import React, { useState } from 'react';

interface AuthViewProps {
  onLogin: () => void;
}

type AuthSubMode = 'CHOICE' | 'PHONE' | 'OTP';

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthSubMode>('CHOICE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setMode('OTP');
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    // Simulate verification
    onLogin();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 transition-all duration-300">
      <div className="mb-12 text-center">
        <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20 rotate-12 transition-transform hover:rotate-0">
           <svg className="w-12 h-12 text-white -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3.1 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">CampusClear</h1>
        <p className="text-slate-400 text-lg">Your bridge to placements</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {mode === 'CHOICE' && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={onLogin}
              className="w-full bg-white text-slate-900 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-slate-50"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Sign in with College ID
            </button>
            
            <button 
              onClick={() => setMode('PHONE')}
              className="w-full bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl border border-slate-700 hover:bg-slate-700"
            >
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Sign in with Mobile
            </button>
          </div>
        )}

        {mode === 'PHONE' && (
          <form onSubmit={handleSendOtp} className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">+91</span>
              <input 
                type="tel" 
                autoFocus
                placeholder="Mobile Number" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-14 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <button 
              type="submit"
              disabled={phoneNumber.length < 10 || isSending}
              className={`w-full emerald-gradient text-white font-bold py-4 px-6 rounded-2xl active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSending ? 'Sending OTP...' : 'Send OTP'}
            </button>
            <button 
              type="button"
              onClick={() => setMode('CHOICE')}
              className="w-full text-slate-400 font-medium py-2 text-sm hover:text-white transition-colors"
            >
              Go Back
            </button>
          </form>
        )}

        {mode === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="text-center mb-2">
              <p className="text-slate-400 text-sm">Enter the 4-digit code sent to</p>
              <p className="text-white font-bold">+91 {phoneNumber}</p>
            </div>
            <input 
              type="text" 
              autoFocus
              placeholder="0 0 0 0" 
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-4 text-white text-center text-2xl tracking-[1em] placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono"
            />
            <button 
              type="submit"
              disabled={otp.length < 4}
              className="w-full emerald-gradient text-white font-bold py-4 px-6 rounded-2xl active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              Verify & Login
            </button>
            <button 
              type="button"
              onClick={() => setMode('PHONE')}
              className="w-full text-slate-400 font-medium py-2 text-sm hover:text-white transition-colors"
            >
              Change Number
            </button>
          </form>
        )}

        <p className="text-center text-slate-500 text-sm px-8 pt-6">
          By signing in, you agree to our <span className="text-slate-400 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-slate-400 hover:underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default AuthView;

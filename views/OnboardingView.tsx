
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ALL_BRANCHES } from '../constants';

interface OnboardingViewProps {
  onComplete: (profile: UserProfile) => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cgpa: 7.5,
    branch: '',
    graduationYear: new Date().getFullYear() + 1,
    currentSkill: '',
    skills: [] as string[]
  });

  const addSkill = () => {
    if (formData.currentSkill.trim() && !formData.skills.includes(formData.currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.currentSkill.trim()],
        currentSkill: ''
      });
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const handleFinish = () => {
    // Fix: Added missing 'streaks' property to satisfy UserProfile interface
    // Fix: Initialized streak activity with 'pending' (StreakStatus) instead of boolean false
    onComplete({
      name: formData.name,
      email: formData.email,
      cgpa: formData.cgpa,
      branch: formData.branch,
      graduationYear: formData.graduationYear,
      skills: formData.skills,
      savedCompanies: [],
      appliedCompanies: [],
      streaks: {
        leetcode: {
          name: 'LeetCode',
          currentStreak: 0,
          totalSolved: 0,
          activity: ['pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending']
        },
        codeforces: {
          name: 'Codeforces',
          currentStreak: 0,
          totalSolved: 0,
          activity: ['pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending']
        },
        gfg: {
          name: 'GeeksforGeeks',
          currentStreak: 0,
          totalSolved: 0,
          activity: ['pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending']
        }
      }
    });
  };

  const years = Array.from({ length: 8 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <div className="min-h-screen bg-white flex flex-col p-8 animate-in fade-in duration-500">
      {/* Progress Header */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-slate-900">Setup Profile</h2>
          <span className="text-emerald-600 font-bold text-sm">Step {step}/3</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">What's your name?</h3>
              <p className="text-slate-500 text-sm mb-6">Enter your full name as per college records.</p>
              <input 
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-900 placeholder-slate-400"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">College Email</h3>
              <input 
                type="email"
                placeholder="name@college.edu"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-900 placeholder-slate-400"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">Current CGPA</h3>
                <span className="text-2xl font-black text-emerald-600">{formData.cgpa.toFixed(1)}</span>
              </div>
              <input 
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={formData.cgpa}
                onChange={e => setFormData({...formData, cgpa: parseFloat(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>0.0</span>
                <span>5.0</span>
                <span>10.0</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Graduation Year</h3>
              <div className="grid grid-cols-4 gap-2">
                {years.map(y => (
                  <button
                    key={y}
                    onClick={() => setFormData({...formData, graduationYear: y})}
                    className={`py-3 rounded-xl font-bold text-xs transition-all border-2 ${formData.graduationYear === y ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-500'}`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Branch</h3>
              <div className="grid grid-cols-3 gap-2">
                {ALL_BRANCHES.map(b => (
                  <button
                    key={b}
                    onClick={() => setFormData({...formData, branch: b})}
                    className={`py-3 rounded-xl font-bold text-xs transition-all border-2 uppercase ${formData.branch === b ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">What are you good at?</h3>
              <p className="text-slate-500 text-sm mb-6">Add skills like React, Python, UI/UX, or AWS.</p>
              
              <div className="flex gap-2 mb-6">
                <input 
                  type="text"
                  placeholder="e.g. JavaScript"
                  value={formData.currentSkill}
                  onChange={e => setFormData({...formData, currentSkill: e.target.value})}
                  onKeyPress={e => e.key === 'Enter' && addSkill()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-900 placeholder-slate-400"
                />
                <button 
                  onClick={addSkill}
                  className="bg-slate-900 text-white px-6 rounded-2xl font-bold active:scale-95 transition-all"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <div 
                    key={skill} 
                    className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 animate-in zoom-in duration-200"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="text-emerald-400 hover:text-emerald-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 flex gap-4">
        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="flex-1 py-5 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
          >
            Back
          </button>
        )}
        <button 
          onClick={() => {
            if (step < 3) setStep(step + 1);
            else handleFinish();
          }}
          disabled={(step === 1 && !formData.name) || (step === 2 && !formData.branch)}
          className="flex-[2] emerald-gradient text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {step === 3 ? 'Get Started' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingView;

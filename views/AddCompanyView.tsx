
import React, { useState } from 'react';
import { Company, RecruitmentType, ApplicationStatus } from '../types';
import { ALL_BRANCHES } from '../constants';

interface AddCompanyViewProps {
  onBack: () => void;
  onAdd: (company: Company) => void;
}

const AddCompanyView: React.FC<AddCompanyViewProps> = ({ onBack, onAdd }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    type: RecruitmentType.FULL_TIME,
    minCGPA: 7.0,
    eligibleBranches: ['CSE'],
    deadline: '',
    description: '',
    experience: ''
  });

  const handleSubmit = () => {
    const newCompany: Company = {
      id: Date.now().toString(),
      name: formData.name,
      logo: `https://picsum.photos/seed/${formData.name}/100/100`,
      role: formData.role,
      type: formData.type,
      deadline: formData.deadline || new Date(Date.now() + 7*24*60*60*1000).toISOString(),
      status: ApplicationStatus.VISITING_SOON,
      minCGPA: formData.minCGPA,
      eligibleBranches: formData.eligibleBranches,
      description: formData.description,
      interviewStories: formData.experience ? [{
        id: 's-user',
        studentName: 'Recent Contributor',
        branch: 'N/A',
        year: 2024,
        rating: 5,
        content: formData.experience
      }] : []
    };
    onAdd(newCompany);
  };

  const toggleBranch = (branch: string) => {
    setFormData(prev => ({
      ...prev,
      eligibleBranches: prev.eligibleBranches.includes(branch) 
        ? prev.eligibleBranches.filter(b => b !== branch)
        : [...prev.eligibleBranches, branch]
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <header className="bg-slate-900 text-white px-6 pt-12 pb-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold">Add Company</h1>
          <p className="text-slate-400 text-xs">Step {step} of 3</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-800">
        <div 
          className="h-full bg-emerald-500 transition-all duration-300" 
          style={{ width: `${(step/3)*100}%` }}
        ></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="text-xs font-black uppercase text-slate-500 mb-2 block">Company Name</label>
              <input 
                type="text" 
                placeholder="e.g. Amazon"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-500 mb-2 block">Role</label>
              <input 
                type="text" 
                placeholder="e.g. SDE-1"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-500 mb-2 block">Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setFormData({...formData, type: RecruitmentType.FULL_TIME})}
                  className={`py-4 rounded-2xl font-bold border-2 transition-all ${formData.type === RecruitmentType.FULL_TIME ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-500'}`}
                >
                  Full-time
                </button>
                <button 
                  onClick={() => setFormData({...formData, type: RecruitmentType.INTERNSHIP})}
                  className={`py-4 rounded-2xl font-bold border-2 transition-all ${formData.type === RecruitmentType.INTERNSHIP ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-500'}`}
                >
                  Internship
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-black uppercase text-slate-500 block">Min CGPA</label>
                <span className="text-emerald-600 font-black text-xl">{formData.minCGPA}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="0.1"
                value={formData.minCGPA}
                onChange={e => setFormData({...formData, minCGPA: parseFloat(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-500 mb-3 block">Eligible Branches</label>
              <div className="flex flex-wrap gap-2">
                {ALL_BRANCHES.map(branch => (
                  <button 
                    key={branch}
                    onClick={() => toggleBranch(branch)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${formData.eligibleBranches.includes(branch) ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-400'}`}
                  >
                    {branch}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-500 mb-2 block">Deadline (Optional)</label>
              <input 
                type="datetime-local" 
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="text-xs font-black uppercase text-slate-500 mb-2 block">Job Description</label>
              <textarea 
                rows={4}
                placeholder="What is this role about?"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-500 mb-2 block">Share your Interview Experience</label>
              <textarea 
                rows={6}
                placeholder="Help others! What were the rounds like? Any specific questions?"
                value={formData.experience}
                onChange={e => setFormData({...formData, experience: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-200 flex gap-4">
        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="flex-1 py-4 rounded-2xl font-bold border-2 border-slate-200 text-slate-600 active:scale-95 transition-all"
          >
            Back
          </button>
        )}
        <button 
          onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
          className="flex-[2] emerald-gradient text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
        >
          {step === 3 ? 'Publish Data' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default AddCompanyView;

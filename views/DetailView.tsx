
import React, { useState, useEffect } from 'react';
import { Company, UserProfile } from '../types';
import { getGeminiPrepTips, summarizeJD } from '../services/geminiService';

interface DetailViewProps {
  company: Company;
  user: UserProfile;
  onBack: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ company, user, onBack }) => {
  const [prepTips, setPrepTips] = useState<{tip: string, category: string}[]>([]);
  const [loadingTips, setLoadingTips] = useState(false);
  const [activeTab, setActiveTab] = useState<'About' | 'Criteria' | 'Experiences'>('About');
  const [summary, setSummary] = useState<string>('');

  const isEligible = user.cgpa >= company.minCGPA && company.eligibleBranches.includes(user.branch);

  useEffect(() => {
    const fetchSummary = async () => {
        const text = await summarizeJD(company.description);
        setSummary(text);
    };
    fetchSummary();
  }, [company.description]);

  const handleGetAITips = async () => {
    setLoadingTips(true);
    const tips = await getGeminiPrepTips(company.name, company.role, company.description);
    setPrepTips(tips);
    setLoadingTips(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Dynamic Hero Section */}
      <div className="relative h-64 bg-slate-900 flex flex-col items-center justify-end pb-8">
        <button 
          onClick={onBack}
          className="absolute top-10 left-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white active:scale-90 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <img 
          src={company.logo} 
          className="w-20 h-20 rounded-2xl bg-white p-1 shadow-2xl mb-4 border-4 border-slate-800"
          alt={company.name} 
        />
        <h1 className="text-2xl font-bold text-white mb-1">{company.name}</h1>
        <p className="text-slate-400 font-medium">{company.role}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white">
        {(['About', 'Criteria', 'Experiences'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-emerald-500 rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        {activeTab === 'About' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 112 0 1 1 0 01-2 0zm1-7a1 1 0 00-1 1v3a1 1 0 002 0V5a1 1 0 00-1-1z"/></svg>
                Overview
              </h2>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm leading-relaxed text-slate-600 whitespace-pre-line">
                {summary || "Loading summary..."}
              </div>
            </section>

            <section>
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-emerald-900 font-bold">AI Prep Assistant</h3>
                    <p className="text-emerald-700 text-xs">Tailored strategy for {company.name}</p>
                  </div>
                  <button 
                    onClick={handleGetAITips}
                    disabled={loadingTips}
                    className="emerald-gradient text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {loadingTips ? 'Thinking...' : 'Get Tips'}
                  </button>
                </div>
                
                {prepTips.length > 0 && (
                  <div className="space-y-3">
                    {prepTips.map((tip, i) => (
                      <div key={i} className="flex gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-white/50">
                        <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-md h-fit whitespace-nowrap uppercase">
                          {tip.category}
                        </span>
                        <p className="text-slate-700 text-xs font-medium leading-normal">{tip.tip}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'Criteria' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className={`p-5 rounded-2xl border flex items-center gap-4 ${isEligible ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
               <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isEligible ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                 {isEligible ? (
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                 ) : (
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                 )}
               </div>
               <div>
                  <h3 className={`font-bold ${isEligible ? 'text-emerald-900' : 'text-red-900'}`}>{isEligible ? 'You are Eligible!' : 'Not Eligible'}</h3>
                  <p className={`text-xs ${isEligible ? 'text-emerald-700' : 'text-red-700'}`}>
                    {isEligible ? "You meet all the requirements for this role." : "You do not meet one or more criteria."}
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Min CGPA</span>
                <p className="text-2xl font-black text-slate-900">{company.minCGPA}</p>
                <p className="text-xs text-slate-500 mt-1">Your CGPA: <span className="font-bold text-slate-700">{user.cgpa}</span></p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Recruitment</span>
                <p className="text-lg font-black text-slate-900 mt-1">{company.type}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Eligible Branches</h3>
              <div className="flex flex-wrap gap-2">
                {company.eligibleBranches.map(branch => (
                  <span 
                    key={branch}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${branch === user.branch ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {branch}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Experiences' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {company.interviewStories.length > 0 ? (
              company.interviewStories.map(story => (
                <div key={story.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900">{story.studentName}</h4>
                      <p className="text-xs text-slate-500">{story.branch} • Class of {story.year}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg font-bold text-[10px]">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      {story.rating}.0
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
                    "{story.content}"
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                 <p className="text-sm">No student stories yet.</p>
                 <p className="text-[10px] mt-1">Be the first to share yours!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button 
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-xl ${isEligible ? 'emerald-gradient text-white shadow-emerald-500/20 active:scale-[0.98]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          disabled={!isEligible}
        >
          {isEligible ? 'Apply Now' : 'Not Eligible to Apply'}
        </button>
      </div>
    </div>
  );
};

export default DetailView;

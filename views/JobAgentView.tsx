
import React, { useState } from 'react';
import { UserProfile, Company } from '../types';
import { generateCoverLetter } from '../services/geminiService';

interface JobAgentViewProps {
  onBack: () => void;
  user: UserProfile;
  companies: Company[];
}

const JobAgentView: React.FC<JobAgentViewProps> = ({ onBack, user, companies }) => {
  const [selectedMatch, setSelectedMatch] = useState<Company | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  const matchedCompanies = companies.filter(c => user.cgpa >= c.minCGPA && c.eligibleBranches.includes(user.branch));

  const handleGenerate = async (company: Company) => {
    setLoading(true);
    setSelectedMatch(company);
    const letter = await generateCoverLetter(user, company);
    setCoverLetter(letter);
    setLoading(false);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <header className="bg-emerald-600 text-white p-6 pt-12 pb-8 rounded-b-[40px] shadow-lg relative">
        <button onClick={onBack} className="absolute top-10 left-6 text-white/80"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg></button>
        <h1 className="text-3xl font-black mb-1">Job Agent</h1>
        <p className="text-emerald-100 text-sm font-medium">Hunted {matchedCompanies.length} matches for your profile today.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 no-scrollbar space-y-6">
        <section>
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Top Agent Recommendations</h2>
          <div className="space-y-4">
            {matchedCompanies.map(c => (
              <div key={c.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={c.logo} className="w-10 h-10 rounded-xl" alt="" />
                  <div>
                    <h3 className="font-bold text-slate-900">{c.name}</h3>
                    <p className="text-[10px] text-slate-500">{c.role}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleGenerate(c)}
                  className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl hover:bg-emerald-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        {selectedMatch && (
          <section className="animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-slate-900 text-white p-6 rounded-[32px] shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg">AI Tailored Draft</h3>
                 <button className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Copy Text</button>
               </div>
               {loading ? (
                 <div className="space-y-2">
                   <div className="h-4 bg-slate-800 rounded w-full animate-pulse"></div>
                   <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse"></div>
                   <div className="h-4 bg-slate-800 rounded w-4/6 animate-pulse"></div>
                 </div>
               ) : (
                 <p className="text-slate-300 text-sm leading-relaxed italic">
                   {coverLetter}
                 </p>
               )}
               <div className="mt-8 flex gap-3">
                 <button className="flex-1 bg-white text-slate-900 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zM4 8h12v9H4V8zm5-4h2v1H9V4z" /></svg>
                   Add to Calendar
                 </button>
                 <button className="flex-1 bg-emerald-500 text-white py-3 rounded-2xl font-bold text-xs">
                   Auto-Apply
                 </button>
               </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default JobAgentView;

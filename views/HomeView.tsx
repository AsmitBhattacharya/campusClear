
import React, { useState } from 'react';
import { Company, UserProfile, RecruitmentType, PlatformStreak } from '../types';
import CompanyCard from '../components/CompanyCard';

interface HomeViewProps {
  companies: Company[];
  user: UserProfile;
  onSelectCompany: (id: string) => void;
  onOpenProfile: () => void;
  onOpenAdd: () => void;
  onOpenCoach: () => void;
  onOpenAgent: () => void;
  onOpenAnalytics: () => void;
  onOpenFlash: () => void;
  onUpdateStreak: (platform: keyof UserProfile['streaks'], dayIdx: number) => void;
}

type Tab = 'Home' | 'Applied' | 'Streaks';

const HomeView: React.FC<HomeViewProps> = ({ 
  companies, user, onSelectCompany, onOpenProfile, onOpenAdd, 
  onOpenCoach, onOpenAgent, onOpenAnalytics, onOpenFlash,
  onUpdateStreak
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [filter, setFilter] = useState<'All' | 'Placement' | 'Internship'>('All');
  const [eligibilityFilter, setEligibilityFilter] = useState<'All' | 'Eligible'>('All');
  const [search, setSearch] = useState('');

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase());
    const matchesType = filter === 'All' || c.type === (filter === 'Placement' ? RecruitmentType.FULL_TIME : RecruitmentType.INTERNSHIP);
    const isEligible = user.cgpa >= c.minCGPA && c.eligibleBranches.includes(user.branch);
    const matchesEligibility = eligibilityFilter === 'All' || isEligible;
    
    let matchesTab = true;
    if (activeTab === 'Applied') matchesTab = user.appliedCompanies.includes(c.id);
    
    return matchesSearch && matchesType && matchesEligibility && matchesTab;
  });

  const renderStreakCard = (platformKey: keyof UserProfile['streaks'], streak: PlatformStreak) => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return (
      <div key={streak.name} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${
               streak.name === 'LeetCode' ? 'bg-amber-500' : 
               streak.name === 'Codeforces' ? 'bg-blue-600' : 'bg-emerald-600'
             }`}>
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M13 7h-2v5.41l4.29 4.29 1.41-1.41L13 11.59z"/></svg>
             </div>
             <div>
               <h3 className="font-black text-slate-900 leading-none">{streak.name}</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Platform Activity</p>
             </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-slate-900">{streak.currentStreak}</p>
            <p className="text-[10px] text-emerald-500 font-black uppercase">Current Streak</p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {days.map((day, idx) => {
            const status = streak.activity[idx];
            return (
              <button 
                key={idx} 
                onClick={() => onUpdateStreak(platformKey, idx)}
                className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
              >
                <div className={`w-full aspect-square rounded-lg border-2 transition-all duration-300 ${
                  status === 'done' 
                    ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20' 
                    : status === 'missed'
                    ? 'bg-rose-500 border-rose-500 shadow-lg shadow-rose-500/20'
                    : 'bg-slate-50 border-slate-100 hover:border-slate-300'
                }`}></div>
                <span className="text-[9px] font-black text-slate-400">{day}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
           <span className="text-[10px] font-bold text-slate-500">Total Solved: <span className="text-slate-900">{streak.totalSolved}</span></span>
           <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-400 italic">Tap boxes to log</span>
              <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Sync</button>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen pb-20 bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white pt-10 pb-6 px-6 rounded-b-[40px] shadow-2xl relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div onClick={onOpenAnalytics} className="cursor-pointer">
            <h1 className="text-2xl font-black tracking-tight">CampusClear</h1>
            <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Agentic AI Edition</p>
          </div>
          <button 
            onClick={onOpenProfile}
            className="w-12 h-12 rounded-2xl border-2 border-emerald-500 p-0.5 overflow-hidden active:scale-90 transition-all shadow-xl shadow-emerald-500/20"
          >
            <img src={`https://picsum.photos/seed/${user.email || 'user'}/100/100`} className="w-full h-full rounded-2xl object-cover" alt="Profile" />
          </button>
        </div>

        {activeTab !== 'Streaks' && (
          <div className="relative animate-in fade-in duration-300">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search roles or companies..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner"
            />
          </div>
        )}
        
        {activeTab === 'Streaks' && (
          <div className="animate-in slide-in-from-top-4 duration-300">
             <h2 className="text-xl font-bold">Consistency Tracker</h2>
             <p className="text-slate-400 text-xs mt-1">Consistency > Intensity. log daily.</p>
          </div>
        )}
      </header>

      {activeTab === 'Home' && (
        <>
          <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar -mt-4 relative z-20">
            <button onClick={onOpenCoach} className="bg-white px-4 py-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2 active:scale-95 transition-all whitespace-nowrap">
               <span className="w-8 h-8 emerald-gradient rounded-xl flex items-center justify-center text-white">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>
               </span>
               <span className="text-xs font-black text-slate-700">Live Coach</span>
            </button>
            <button onClick={onOpenAgent} className="bg-slate-900 px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 active:scale-95 transition-all whitespace-nowrap">
               <span className="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center text-white">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
               </span>
               <span className="text-xs font-black text-white">Job Agent</span>
            </button>
            <button onClick={onOpenFlash} className="bg-white px-4 py-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2 active:scale-95 transition-all whitespace-nowrap">
               <span className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center text-white">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95l1.135 11.773a1 1 0 01-1.397 1.014l-4.146-2.073-4.146 2.073a1 1 0 01-1.397-1.014l1.135-11.773a1 1 0 01.897-.95L11.3 1.047z" clipRule="evenodd" /></svg>
               </span>
               <span className="text-xs font-black text-slate-700">Flash Prep</span>
            </button>
          </div>

          <div className="px-6 py-2 flex items-center justify-between">
             <div className="flex bg-slate-200 p-1 rounded-xl">
                <button onClick={() => setFilter('All')} className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${filter === 'All' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>ALL</button>
                <button onClick={() => setFilter('Placement')} className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${filter === 'Placement' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>PLACEMENTS</button>
                <button onClick={() => setFilter('Internship')} className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${filter === 'Internship' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>INTERNS</button>
             </div>
             <button onClick={() => setEligibilityFilter(eligibilityFilter === 'All' ? 'Eligible' : 'All')} className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all ${eligibilityFilter === 'Eligible' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 border-slate-200'}`}>
                ELIGIBLE ONLY
             </button>
          </div>
        </>
      )}

      {/* Main List Area */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-24 no-scrollbar space-y-2">
        {activeTab !== 'Streaks' ? (
          <>
            <div className="mb-4">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">{activeTab} Results ({filteredCompanies.length})</h2>
            </div>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map(company => (
                <CompanyCard 
                  key={company.id} 
                  company={company} 
                  isEligible={user.cgpa >= company.minCGPA && company.eligibleBranches.includes(user.branch)}
                  onClick={onSelectCompany}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-300">
                <svg className="w-16 h-16 mb-4 opacity-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M13 7h-2v5.41l4.29 4.29 1.41-1.41L13 11.59z"/></svg>
                <p className="font-black text-sm uppercase tracking-widest">No Matches Found</p>
              </div>
            )}
          </>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">Your Weekly Progress</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-[8px] font-black uppercase text-slate-500">Done</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                  <span className="text-[8px] font-black uppercase text-slate-500">Missed</span>
                </div>
              </div>
            </div>
            {renderStreakCard('leetcode', user.streaks.leetcode)}
            {renderStreakCard('codeforces', user.streaks.codeforces)}
            {renderStreakCard('gfg', user.streaks.gfg)}
          </div>
        )}
      </div>

      {/* FAB */}
      {activeTab === 'Home' && (
        <button 
          onClick={onOpenAdd}
          className="fixed bottom-24 right-6 w-16 h-16 bg-slate-900 rounded-3xl shadow-2xl flex items-center justify-center text-white active:scale-90 transition-all z-20 border-4 border-slate-800"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </button>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 h-20 flex items-center justify-around px-6 z-10 rounded-t-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <button 
          onClick={() => setActiveTab('Home')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'Home' ? 'text-emerald-600' : 'text-slate-300'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
          <span className="text-[10px] font-black uppercase">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('Applied')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'Applied' ? 'text-emerald-600' : 'text-slate-300'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
          <span className="text-[10px] font-black uppercase">Applied</span>
        </button>
        <button 
          onClick={() => setActiveTab('Streaks')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'Streaks' ? 'text-emerald-600' : 'text-slate-300'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.4503-.414l-8.5 6a1 1 0 00-.28 1.414 1 1 0 001.414.28l.414-.28V17a1 1 0 001 1h10a1 1 0 001-1v-6.586a1 1 0 00-1.414-1.414l-2.686 2.686V5.414a1 1 0 00-1.414-1.414L12 6.586z" clipRule="evenodd" /></svg>
          <span className="text-[10px] font-black uppercase">Streaks</span>
        </button>
        <button onClick={onOpenProfile} className="flex flex-col items-center gap-1 text-slate-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] font-black uppercase">Me</span>
        </button>
      </nav>
    </div>
  );
};

export default HomeView;

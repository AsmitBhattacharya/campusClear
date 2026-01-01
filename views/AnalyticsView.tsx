
import React from 'react';
import { Company, UserProfile } from '../types';

interface AnalyticsViewProps {
  onBack: () => void;
  companies: Company[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onBack, companies }) => {
  const avgCgpa = (companies.reduce((acc, c) => acc + c.minCGPA, 0) / companies.length).toFixed(1);
  const totalRoles = companies.length;

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col p-6 overflow-hidden">
      <header className="flex justify-between items-center mb-10 pt-6">
        <div>
          <h1 className="text-2xl font-black">Placement Analytics</h1>
          <p className="text-slate-500 text-xs">Campus-wide Readiness Overview</p>
        </div>
        <button onClick={onBack} className="bg-slate-800 p-3 rounded-2xl text-slate-400">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-800 p-6 rounded-[32px] border border-slate-700">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Avg Req. CGPA</p>
          <h3 className="text-3xl font-black text-emerald-500">{avgCgpa}</h3>
        </div>
        <div className="bg-slate-800 p-6 rounded-[32px] border border-slate-700">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Roles</p>
          <h3 className="text-3xl font-black text-blue-500">{totalRoles}</h3>
        </div>
      </div>

      <section className="bg-slate-800 p-6 rounded-[40px] border border-slate-700 mb-6 flex-1">
        <h3 className="font-bold text-sm mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          Branch Eligibility Distribution
        </h3>
        <div className="space-y-6">
          {['CSE', 'ECE', 'MECH'].map(branch => {
            const count = companies.filter(c => c.eligibleBranches.includes(branch)).length;
            const percentage = (count / companies.length) * 100;
            return (
              <div key={branch}>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>{branch}</span>
                  <span className="text-slate-500">{percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                   <div 
                    className={`h-full transition-all duration-1000 ${branch === 'CSE' ? 'bg-emerald-500' : branch === 'ECE' ? 'bg-blue-500' : 'bg-rose-500'}`} 
                    style={{ width: `${percentage}%` }}
                   ></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <button className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all mb-4">
        Export to Looker Studio
      </button>
    </div>
  );
};

export default AnalyticsView;

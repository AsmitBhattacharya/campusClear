
import React, { useEffect, useState } from 'react';
import { Company, ApplicationStatus } from '../types';

interface CompanyCardProps {
  company: Company;
  onClick: (id: string) => void;
  isEligible: boolean;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onClick, isEligible }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(company.deadline).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        setTimeLeft(`${days}d ${hours}h left`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [company.deadline]);

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.VISITING_SOON: return 'bg-blue-100 text-blue-700';
      case ApplicationStatus.ONGOING: return 'bg-emerald-100 text-emerald-700';
      case ApplicationStatus.COMPLETED: return 'bg-slate-200 text-slate-600';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div 
      onClick={() => onClick(company.id)}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4 active:scale-[0.98] transition-all cursor-pointer hover:shadow-md relative overflow-hidden"
    >
      <div className="flex items-start gap-4">
        <img 
          src={company.logo} 
          alt={company.name} 
          className="w-14 h-14 rounded-lg object-cover bg-slate-100"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-slate-900 text-lg leading-tight">{company.name}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${getStatusColor(company.status)}`}>
              {company.status}
            </span>
          </div>
          <p className="text-sm text-slate-600 font-medium mb-3">{company.role}</p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isEligible ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
              <span className="text-xs text-slate-500 font-medium">
                {isEligible ? 'Eligible' : `Req: ${company.minCGPA} CGPA`}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-semibold text-rose-500">{timeLeft}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;

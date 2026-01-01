
import React, { useState, useEffect } from 'react';
import { View, Company, UserProfile, RecruitmentType, ApplicationStatus, PlatformStreak, StreakStatus } from './types';
import { MOCK_COMPANIES } from './constants';
import AuthView from './views/AuthView';
import OnboardingView from './views/OnboardingView';
import HomeView from './views/HomeView';
import DetailView from './views/DetailView';
import ProfileView from './views/ProfileView';
import AddCompanyView from './views/AddCompanyView';
import LiveCoachView from './views/LiveCoachView';
import JobAgentView from './views/JobAgentView';
import AnalyticsView from './views/AnalyticsView';
import FlashPrepView from './views/FlashPrepView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('AUTH');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [user, setUser] = useState<UserProfile>({
    name: 'Anubhav Gupta',
    email: 'anubhav.g@college.edu',
    cgpa: 8.8,
    branch: 'cse',
    graduationYear: 2025,
    skills: ['React', 'Python', 'Node.js', 'System Design'],
    savedCompanies: ['1', '5', '7'],
    appliedCompanies: ['3', '8'],
    streaks: {
      leetcode: {
        name: 'LeetCode',
        currentStreak: 14,
        totalSolved: 452,
        activity: ['done', 'done', 'done', 'done', 'done', 'pending', 'pending']
      },
      codeforces: {
        name: 'Codeforces',
        currentStreak: 3,
        totalSolved: 120,
        activity: ['missed', 'missed', 'done', 'done', 'done', 'pending', 'pending']
      },
      gfg: {
        name: 'GeeksforGeeks',
        currentStreak: 21,
        totalSolved: 890,
        activity: ['done', 'done', 'done', 'done', 'done', 'done', 'done']
      }
    }
  });

  const handleLogin = () => setCurrentView('ONBOARDING');
  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser({
      ...profile,
      streaks: user.streaks 
    });
    setCurrentView('HOME');
  };
  const handleLogout = () => setCurrentView('AUTH');
  
  const handleSelectCompany = (id: string) => {
    setSelectedCompanyId(id);
    setCurrentView('DETAILS');
  };

  const handleAddCompany = (newCompany: Company) => {
    setCompanies([newCompany, ...companies]);
    setCurrentView('HOME');
  };

  const handleUpdateStreak = (platform: keyof UserProfile['streaks'], dayIdx: number) => {
    const newStreaks = { ...user.streaks };
    const currentStatus = newStreaks[platform].activity[dayIdx];
    
    let nextStatus: StreakStatus = 'pending';
    if (currentStatus === 'pending') nextStatus = 'done';
    else if (currentStatus === 'done') nextStatus = 'missed';
    else if (currentStatus === 'missed') nextStatus = 'pending';

    newStreaks[platform].activity[dayIdx] = nextStatus;
    
    // Recalculate streak simple logic (count consecutive 'done' from end)
    let count = 0;
    for (let i = dayIdx; i >= 0; i--) {
        if (newStreaks[platform].activity[i] === 'done') count++;
        else break;
    }
    // Update local streak for demo
    newStreaks[platform].currentStreak = Math.max(newStreaks[platform].currentStreak, count);

    setUser({ ...user, streaks: newStreaks });
  };

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  const renderView = () => {
    switch (currentView) {
      case 'AUTH': return <AuthView onLogin={handleLogin} />;
      case 'ONBOARDING': return <OnboardingView onComplete={handleOnboardingComplete} />;
      case 'HOME': return (
          <HomeView 
            companies={companies} 
            user={user} 
            onSelectCompany={handleSelectCompany}
            onOpenProfile={() => setCurrentView('PROFILE')}
            onOpenAdd={() => setCurrentView('ADD_COMPANY')}
            onOpenCoach={() => setCurrentView('LIVE_COACH')}
            onOpenAgent={() => setCurrentView('JOB_AGENT')}
            onOpenAnalytics={() => setCurrentView('ANALYTICS')}
            onOpenFlash={() => setCurrentView('FLASH_PREP')}
            onUpdateStreak={handleUpdateStreak}
          />
      );
      case 'DETAILS': return selectedCompany ? <DetailView company={selectedCompany} user={user} onBack={() => setCurrentView('HOME')} /> : null;
      case 'PROFILE': return <ProfileView user={user} onBack={() => setCurrentView('HOME')} onLogout={handleLogout} onUpdateUser={setUser} />;
      case 'ADD_COMPANY': return <AddCompanyView onBack={() => setCurrentView('HOME')} onAdd={handleAddCompany} />;
      case 'LIVE_COACH': return <LiveCoachView onBack={() => setCurrentView('HOME')} userName={user.name} userSkills={user.skills} />;
      case 'JOB_AGENT': return <JobAgentView onBack={() => setCurrentView('HOME')} user={user} companies={companies} />;
      case 'ANALYTICS': return <AnalyticsView onBack={() => setCurrentView('HOME')} companies={companies} />;
      case 'FLASH_PREP': return <FlashPrepView onBack={() => setCurrentView('HOME')} skills={user.skills} />;
      default: return <AuthView onLogin={handleLogin} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl relative overflow-hidden font-sans">
      {renderView()}
    </div>
  );
};

export default App;

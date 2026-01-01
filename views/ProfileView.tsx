
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ALL_BRANCHES } from '../constants';

interface ProfileViewProps {
  user: UserProfile;
  onBack: () => void;
  onLogout: () => void;
  onUpdateUser: (user: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onBack, onLogout, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <header className="bg-white px-6 pt-12 pb-6 flex items-center gap-4 border-b border-slate-200">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img 
              src={`https://picsum.photos/seed/${user.email || 'user'}/200/200`} 
              className="w-24 h-24 rounded-full border-4 border-white shadow-xl" 
              alt="Avatar" 
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">{user.name}</h2>
          <p className="text-slate-500 text-sm">{user.email || 'Email not set'}</p>
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Academic Details</h3>
             <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="text-emerald-600 font-bold text-sm"
            >
              {isEditing ? 'Save Changes' : 'Edit'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">CGPA</label>
                {isEditing ? (
                  <input 
                    type="number" 
                    step="0.1" 
                    value={formData.cgpa}
                    onChange={(e) => setFormData({...formData, cgpa: parseFloat(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                  />
                ) : (
                  <p className="text-lg font-bold text-slate-900">{user.cgpa}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Graduation Year</label>
                {isEditing ? (
                  <select 
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({...formData, graduationYear: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                  >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                ) : (
                  <p className="text-lg font-bold text-slate-900">{user.graduationYear}</p>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Branch</label>
              {isEditing ? (
                <select 
                  value={formData.branch}
                  onChange={(e) => setFormData({...formData, branch: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 uppercase"
                >
                  {ALL_BRANCHES.map(b => <option key={b} value={b}>{b.toUpperCase()}</option>)}
                </select>
              ) : (
                <p className="text-lg font-bold text-slate-900 uppercase">{user.branch}</p>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Professional Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.length > 0 ? user.skills.map(skill => (
              <span key={skill} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                {skill}
              </span>
            )) : (
              <p className="text-xs text-slate-400 italic">No skills added yet.</p>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <span className="font-bold text-slate-700">Push Notifications</span>
            <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </button>
          <div className="h-px bg-slate-100 mx-6"></div>
          <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-rose-600 font-bold" onClick={onLogout}>
            <span>Logout</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProfileView;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function apiBase(): string {
  return '';
}

interface UserProfile {
  id: string;
  email: string;
  role: string;
  tier: string;
  membershipActive: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${apiBase()}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      })
      .then(data => {
        if (data && data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Active Courses', value: '3' },
    { label: 'Modules Finished', value: '12' },
    { label: 'Academy Ranking', value: 'Top 5%' },
  ];

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans text-slate-600 selection:bg-emerald-100">
      <div className="mx-auto max-w-7xl">
        
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <div className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 border border-emerald-200 mb-4">
              {user?.role === 'ADMIN' ? 'System Administrator' : 'Member Portal'}
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Welcome back, {user?.email ? user.email.split('@')[0] : 'Member'}.
            </h1>
            <p className="mt-2 text-lg text-slate-500">Your property investment journey continues here.</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all hover:scale-105 active:scale-95"
            >
              Resume Learning
            </Link>
          </div>
        </header>

        {/* Admin Section */}
        {user?.role === 'ADMIN' && (
          <section className="mb-16 rounded-[3rem] bg-slate-900 p-12 text-white shadow-3xl relative overflow-hidden group border-4 border-emerald-500/20">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <svg className="h-64 w-64 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
            <div className="relative z-10">
              <span className="inline-block rounded-full bg-emerald-500 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white mb-6">Administrator Access Only</span>
              <h2 className="text-4xl font-black tracking-tight mb-4">Academy Governance & Content</h2>
              <p className="max-w-2xl text-xl font-medium text-slate-300 mb-10 leading-relaxed">
                You are currently in Admin Mode. You can manage the student directory, upgrade member tiers, create new modules, and upload lessons.
              </p>
              <Link to="/admin" className="inline-flex items-center gap-4 rounded-2xl bg-emerald-600 px-10 py-5 text-sm font-black uppercase tracking-widest text-white hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/40">
                Go to Admin Console
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7-7 7M3 12h18"/></svg>
              </Link>
            </div>
          </section>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="group rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100 transition-all hover:shadow-2xl hover:shadow-slate-200">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-600 transition-colors">{stat.label}</p>
              <p className="mt-4 text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* Membership Card */}
          <section className="rounded-[3rem] bg-white p-10 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute -top-24 -right-24 h-64 w-64 bg-emerald-50 rounded-full blur-[80px]" />
            
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-8">
               <span className="h-1 w-6 bg-emerald-600 rounded-full" />
               Account Status
            </h2>
            
            <div className="rounded-[2rem] bg-slate-50 p-8 border border-slate-100 relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Membership Tier</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{user?.tier || 'MEMBER'} ACCESS</p>
                </div>
                <div className="h-16 w-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                   <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"/></svg>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {user?.role === 'ADMIN' 
                  ? 'As an Administrator, you have unrestricted access to every course and management feature across the platform.'
                  : `You have unrestricted access to all ${user?.tier || 'PREMIUM'} sourcing modules, legal templates, and our exclusive community forums.`
                }
              </p>
              <div className="mt-10 pt-8 border-t border-slate-200">
                <Link to="/" className="text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 flex items-center gap-2 transition-colors">
                  {user?.role === 'ADMIN' ? 'Review Site Settings' : 'Manage Subscription'}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </Link>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="rounded-[3rem] bg-white p-10 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-8">
               <span className="h-1 w-6 bg-slate-200 rounded-full" />
               Quick Navigation
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Resources', sub: 'Templates & Contracts' },
                { title: 'Expert Help', sub: '24/7 Support Desk' },
                { title: 'Community', sub: 'Member Networking' },
                { title: 'Settings', sub: 'Profile & Security' }
              ].map((item) => (
                <button key={item.title} className="group rounded-2xl bg-slate-50 p-6 text-left border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
                  <p className="font-black uppercase tracking-widest text-slate-900 group-hover:text-emerald-600 transition-colors">{item.title}</p>
                  <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.sub}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

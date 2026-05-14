import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const stats = [
    { label: 'Courses Started', value: '3' },
    { label: 'Completed Lessons', value: '12' },
    { label: 'Membership Tier', value: 'Elite' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
            <p className="text-slate-400">Welcome back! Continue your property journey.</p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500"
          >
            Resume Learning
          </Link>
        </header>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-xl font-bold text-white">Membership Details</h2>
            <div className="mt-6 rounded-xl bg-indigo-600/10 p-6 border border-indigo-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">Current Tier</p>
                  <p className="text-2xl font-bold text-white">Elite Member</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">★</div>
              </div>
              <p className="mt-4 text-sm text-slate-400">Your membership is active until June 2026. You have full access to all Elite courses.</p>
              <Link 
                to="/" 
                className="mt-6 inline-block text-sm font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Change or Upgrade Plan →
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-xl font-bold text-white">Quick Links</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-left hover:bg-slate-800 transition-colors">
                <p className="font-semibold text-slate-200">Resource Library</p>
                <p className="text-xs text-slate-500">Templates & contracts</p>
              </button>
              <button className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-left hover:bg-slate-800 transition-colors">
                <p className="font-semibold text-slate-200">Support Desk</p>
                <p className="text-xs text-slate-500">Get help from experts</p>
              </button>
              <button className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-left hover:bg-slate-800 transition-colors">
                <p className="font-semibold text-slate-200">Community</p>
                <p className="text-xs text-slate-500">Join the discussion</p>
              </button>
              <button className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-left hover:bg-slate-800 transition-colors">
                <p className="font-semibold text-slate-200">Account Settings</p>
                <p className="text-xs text-slate-500">Manage your profile</p>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

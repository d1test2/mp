import React, { useEffect, useState } from 'react';

function apiBase(): string {
  return '';
}

interface User {
  id: string;
  email: string;
  role: string;
  tier: string;
  membershipActive: boolean;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: { title: string };
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<'members' | 'content'>('members');
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Course Form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('GETTING_STARTED');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const endpoint = tab === 'members' ? '/api/admin/users' : '/api/courses/library';
    
    setLoading(true);
    fetch(`${apiBase()}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (tab === 'members') setUsers(data.users || []);
        else setCourses(data.courses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tab]);

  const updateTier = async (userId: string, tier: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${apiBase()}/api/admin/users/${userId}/tier`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tier })
    });
    setUsers(users.map(u => u.id === userId ? { ...u, tier } : u));
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const resp = await fetch(`${apiBase()}/api/admin/courses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, categoryId })
    });
    
    if (resp.ok) {
      setShowForm(false);
      setTitle('');
      setDescription('');
      // Refresh content
      setTab('members'); // Force toggle
      setTimeout(() => setTab('content'), 10);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans text-slate-600">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Console</h1>
          <p className="mt-2 text-slate-500 font-medium">Academy Governance & Content Distribution</p>
        </header>

        <div className="mb-10 flex gap-10 border-b border-slate-200">
          <button 
            onClick={() => setTab('members')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${tab === 'members' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-400 hover:text-slate-900'}`}
          >
            Member Directory
          </button>
          <button 
            onClick={() => setTab('content')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${tab === 'content' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-400 hover:text-slate-900'}`}
          >
            Content Management
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          </div>
        ) : tab === 'members' ? (
          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Account Identity</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Access Level</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Lifecycle</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-900">{user.email}</td>
                    <td className="px-8 py-6">
                      <select 
                        value={user.tier} 
                        onChange={(e) => updateTier(user.id, e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black text-slate-900 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm"
                      >
                        <option value="PREMIUM">PREMIUM</option>
                        <option value="ELITE">ELITE</option>
                        <option value="PPIC">PPIC</option>
                      </select>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest ${user.membershipActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.membershipActive ? 'bg-emerald-600' : 'bg-red-600'}`} />
                        {user.membershipActive ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Audit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
             <button 
               onClick={() => setShowForm(true)}
               className="flex h-full flex-col items-center justify-center rounded-[2.5rem] border-4 border-dashed border-slate-200 bg-white p-12 transition-all hover:border-emerald-600 hover:bg-emerald-50 group shadow-sm hover:shadow-xl"
             >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-200 group-hover:scale-110 transition-transform">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4v16m8-8H4"/></svg>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-900">Add New Module</span>
             </button>
             {courses.map(course => (
               <div key={course.id} className="group relative rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100 transition-all hover:shadow-2xl hover:shadow-slate-200">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{course.category?.title}</span>
                  </div>
                  <h3 className="mb-4 text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">{course.title}</h3>
                  <p className="line-clamp-2 text-sm text-slate-500 mb-8 font-medium leading-relaxed">{course.description}</p>
                  <div className="flex gap-4">
                    <button className="flex-1 rounded-2xl bg-slate-100 py-4 text-xs font-black uppercase tracking-widest text-slate-900 hover:bg-slate-200 transition-colors">Add Video</button>
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* Create Course Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
             <div className="w-full max-w-xl rounded-[3rem] bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Create New Module</h2>
                <form onSubmit={handleCreateCourse} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Module Title</label>
                      <input 
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 focus:border-emerald-600 focus:bg-white outline-none transition-all"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                      <select 
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 focus:border-emerald-600 focus:bg-white outline-none transition-all"
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                      >
                         <option value="GETTING_STARTED">Getting Started</option>
                         <option value="SOURCING">Property Sourcing</option>
                         <option value="FINANCING">Financing</option>
                         <option value="LEGAL">Legal & Compliance</option>
                         <option value="MANAGEMENT">Management</option>
                         <option value="ADVANCED">Advanced Strategies</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                      <textarea 
                        required
                        rows={3}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 focus:border-emerald-600 focus:bg-white outline-none transition-all"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                      />
                   </div>
                   <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-2xl bg-slate-100 py-4 text-xs font-black uppercase tracking-widest text-slate-900 hover:bg-slate-200">Cancel</button>
                      <button type="submit" className="flex-1 rounded-2xl bg-emerald-600 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all">Create Module</button>
                   </div>
                </form>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

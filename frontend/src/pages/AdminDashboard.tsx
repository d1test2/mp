import React, { useEffect, useState } from 'react';

function apiBase(): string {
  return (import.meta as any)?.env?.VITE_API_BASE ?? '';
}

interface User {
  id: string;
  email: string;
  role: string;
  tier: string;
  membershipActive: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${apiBase()}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
    // Refresh
    setUsers(users.map(u => u.id === userId ? { ...u, tier } : u));
  };

  if (loading) return <div className="p-12 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-2 text-slate-400">Manage users and content.</p>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Email</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Tier</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 text-sm text-slate-300">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    <select 
                      value={user.tier} 
                      onChange={(e) => updateTier(user.id, e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    >
                      <option value="PREMIUM">PREMIUM</option>
                      <option value="ELITE">ELITE</option>
                      <option value="PPIC">PPIC</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${user.membershipActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {user.membershipActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    <button className="text-indigo-400 hover:text-indigo-300 mr-4">Edit</button>
                    <button className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

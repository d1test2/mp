import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function apiBase(): string {
  return '';
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const resp = await fetch(`${apiBase()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white border-b border-slate-100" />

      <div className="relative w-full max-w-md">
        <div className="mb-12 text-center">
           <Link to="/" className="text-3xl font-black text-slate-900 tracking-tighter">PPAMP <span className="text-emerald-600">ACADEMY</span></Link>
        </div>

        <div className="rounded-[3rem] bg-white p-10 shadow-2xl shadow-slate-200 border border-slate-100">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Member Access.</h2>
          <p className="mt-4 text-slate-500 font-medium">Please authenticate to access your courses.</p>

          <form className="mt-10 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-2xl bg-red-50 p-4 text-xs font-black uppercase tracking-widest text-white animate-in fade-in slide-in-from-top-1 duration-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Account Email</label>
              <input
                type="email"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Key</label>
                <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">Forgot Password?</Link>
              </div>
              <input
                type="password"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-2xl bg-slate-900 py-5 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                   <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                   Verifying...
                </div>
              ) : 'Authenticate Access'}
            </button>
          </form>

          <div className="mt-10 text-center text-xs font-black uppercase tracking-widest text-slate-400">
            Need an account? <Link to="/" className="text-emerald-600 hover:text-emerald-700 transition-colors font-black">Choose a Plan</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

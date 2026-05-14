import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LOGO_URL = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=200";

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    setIsLoggedIn(!!localStorage.getItem('token'));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCheckout = async (tier: string) => {
    setLoading(tier);
    try {
      const resp = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      const { url } = await resp.json();
      if (url) window.location.href = url;
    } catch (err) {
      alert('Connection error. Please check if backend is running.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100">
      
      {/* Sticky Glass Navbar */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter">PREMIER <span className="text-emerald-600">ACADEMY</span></span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#plans" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">View Plans</a>
            {isLoggedIn ? (
              <Link to="/dashboard" className="rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Dashboard</Link>
            ) : (
              <Link to="/login" className="rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Member Login</Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="block md:hidden text-slate-900">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 shadow-2xl animate-in slide-in-from-top-4 duration-300 md:hidden">
            <div className="flex flex-col gap-6">
               <a href="#plans" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-slate-900">View Plans</a>
               {isLoggedIn ? (
                <Link to="/dashboard" className="w-full rounded-2xl bg-emerald-600 py-4 text-center text-xs font-black uppercase tracking-widest text-white">Dashboard</Link>
              ) : (
                <Link to="/login" className="w-full rounded-2xl bg-emerald-600 py-4 text-center text-xs font-black uppercase tracking-widest text-white">Member Login</Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
          <div className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 border border-emerald-200 mb-8">
            The Gold Standard in Property Training
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-slate-900 sm:text-7xl lg:text-8xl leading-[0.95]">
            Master the art of <span className="text-emerald-600 underline decoration-emerald-100 underline-offset-8">Property</span> investing.
          </h1>
          <p className="mx-auto mt-10 max-w-2xl text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
            Join an elite community of investors. Access battle-tested strategies, legal templates, and expert modules designed to scale your portfolio.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#plans" className="rounded-2xl bg-slate-900 px-10 py-5 text-sm font-black uppercase tracking-widest text-white shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95">Get Started Today</a>
          </div>
        </div>
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" style={{backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
      </header>

      {/* Plans Section */}
      <section id="plans" className="py-24 md:py-40 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Choose your path.</h2>
             <p className="mt-4 text-slate-500 font-medium">Select a tier to unlock your full potential.</p>
          </div>
          
          <div className="grid gap-10 md:grid-cols-2 max-w-5xl mx-auto">
            {['PREMIUM', 'ELITE'].map((tier) => (
              <div key={tier} className={`group relative rounded-[3rem] p-10 border transition-all duration-500 ${tier === 'ELITE' ? 'bg-slate-900 text-white border-slate-900 shadow-3xl' : 'bg-white border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-100'}`}>
                {tier === 'ELITE' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white">Most Popular</div>
                )}
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-2">{tier} TIER</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black tracking-tight">£{tier === 'ELITE' ? '1,997' : '997'}</span>
                  <span className={`text-xs font-bold uppercase ${tier === 'ELITE' ? 'text-slate-400' : 'text-slate-400'}`}>/ lifetime</span>
                </div>
                <ul className="mb-10 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7"/></svg>
                      {tier === 'ELITE' ? `Elite Feature Module ${i}` : `Premium Feature ${i}`}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(tier)}
                  disabled={loading !== null}
                  className={`w-full rounded-[2rem] py-5 text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${tier === 'ELITE' ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  {loading === tier ? 'Processing...' : 'Secure My Spot'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xl font-black tracking-tighter text-slate-900">PREMIER <span className="text-emerald-600">ACADEMY</span></p>
          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-400">© 2026 Premier Property Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

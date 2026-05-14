import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function apiBase(): string {
  return '';
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    setIsLoggedIn(!!localStorage.getItem('token'));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCheckout = async (tier: string) => {
    setLoading(tier);
    try {
      // Generate a random temporary ID to track this guest session
      const tempUserId = `guest_${Math.random().toString(36).substring(2, 11)}`;
      
      const resp = await fetch(`${apiBase()}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tier, 
          userId: tempUserId,
          origin: window.location.origin 
        }),
      });
      const data = await resp.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || 'Failed to create session');
    } catch (err: any) {
      alert(err.message || 'Connection error. Please check if backend is running.');
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
          <div className="hidden items-center gap-10 md:flex">
            <a href="#about" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">About</a>
            <a href="#curriculum" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Curriculum</a>
            <a href="#plans" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Plans</a>
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
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-8 shadow-2xl animate-in slide-in-from-top-4 duration-300 md:hidden">
            <div className="flex flex-col gap-8">
               <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-slate-900">About</a>
               <a href="#curriculum" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-slate-900">Curriculum</a>
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
      <header className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block rounded-full bg-emerald-50 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 border border-emerald-100 mb-8">
                The UK's Leading Property Academy
              </div>
              <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl lg:text-8xl leading-[0.95] mb-10">
                Architect Your <br/> <span className="text-emerald-600">Property</span> Empire.
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-12">
                Join an elite community of investors. Access battle-tested strategies, legal templates, and expert modules designed to scale your portfolio from zero to financial freedom.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#plans" className="rounded-2xl bg-slate-900 px-10 py-5 text-sm font-black uppercase tracking-widest text-white shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all hover:scale-105">Join the Academy</a>
                <a href="#curriculum" className="rounded-2xl border border-slate-200 bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all">Explore Modules</a>
              </div>
            </div>
            <div className="flex-1 relative hidden lg:block">
               <div className="relative rounded-[3rem] overflow-hidden shadow-3xl border-8 border-white">
                  <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800" alt="Property" className="w-full h-auto grayscale-[0.3] hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Featured Case Study</p>
                     <p className="text-xl font-black">£2.4M Portfolio in 18 Months</p>
                  </div>
               </div>
               {/* Floating Badge */}
               <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-50 animate-bounce-slow">
                  <p className="text-3xl font-black text-emerald-600">500+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Elite Members</p>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-24 md:py-40 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                 <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-8">Why Premier Academy?</h2>
                 <p className="text-lg text-slate-500 leading-relaxed font-medium mb-12">
                   Most property training is theoretical. We are practical. Our mentors are active investors closing deals every single week. We provide the actual contracts, spreadsheets, and sourcing systems they use.
                 </p>
                 <div className="grid sm:grid-cols-2 gap-8">
                    {[
                      { title: 'Proven Systems', desc: 'Repeatable sourcing & funding models.' },
                      { title: 'Legal Vault', desc: 'Direct access to verified contracts.' },
                      { title: 'Elite Network', desc: 'Connect with UK\'s top deal makers.' },
                      { title: 'Mentorship', desc: 'Live weekly Q&A with industry experts.' }
                    ].map(item => (
                      <div key={item.title}>
                         <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">{item.title}</h4>
                         <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-4 pt-12">
                    <div className="h-64 rounded-3xl bg-emerald-600 p-8 flex flex-col justify-end text-white">
                       <p className="text-4xl font-black">98%</p>
                       <p className="text-xs font-black uppercase tracking-widest opacity-80">Student Success Rate</p>
                    </div>
                    <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=400" className="h-64 w-full object-cover rounded-3xl" />
                 </div>
                 <div className="space-y-4">
                    <img src="https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80&w=400" className="h-64 w-full object-cover rounded-3xl" />
                    <div className="h-64 rounded-3xl bg-slate-900 p-8 flex flex-col justify-end text-white">
                       <p className="text-4xl font-black">24/7</p>
                       <p className="text-xs font-black uppercase tracking-widest opacity-80">Support Access</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-24 md:py-40 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Investment Options.</h2>
             <p className="mt-4 text-slate-500 font-medium">Lifetime access to the UK's most comprehensive property curriculum.</p>
          </div>
          
          <div className="grid gap-10 md:grid-cols-2 max-w-5xl mx-auto">
            {['PREMIUM', 'ELITE'].map((tier) => (
              <div key={tier} className={`group relative rounded-[3rem] p-10 border transition-all duration-500 ${tier === 'ELITE' ? 'bg-slate-900 text-white border-slate-900 shadow-3xl' : 'bg-white border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-100'}`}>
                {tier === 'ELITE' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white">Recommended</div>
                )}
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-2">{tier} TIER</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black tracking-tight">£{tier === 'ELITE' ? '497' : '297'}</span>
                  <span className={`text-xs font-bold uppercase ${tier === 'ELITE' ? 'text-slate-400' : 'text-slate-400'}`}>/ lifetime</span>
                </div>
                <ul className="mb-10 space-y-4">
                  {[
                    'Full Curriculum Access',
                    'Document & Template Vault',
                    'Weekly Group Q&A',
                    'Private Community Access',
                    tier === 'ELITE' ? '1-on-1 Strategy Session' : 'Standard Support',
                    tier === 'ELITE' ? 'HMO & Commercial Mastery' : 'Foundation Modules'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                      <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7"/></svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(tier)}
                  disabled={loading !== null}
                  className={`w-full rounded-[2rem] py-5 text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${tier === 'ELITE' ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  {loading === tier ? 'Initiating Checkout...' : 'Secure My Spot'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div>
              <p className="text-2xl font-black tracking-tighter text-slate-900">PREMIER <span className="text-emerald-600">ACADEMY</span></p>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">Architecting Property Empires.</p>
            </div>
            <div className="flex gap-8">
               <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">Terms</a>
               <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">Privacy</a>
               <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">Contact</a>
            </div>
          </div>
          <div className="mt-12 pt-12 border-t border-slate-200 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">© 2026 Premier Property Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

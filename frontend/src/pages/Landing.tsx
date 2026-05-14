import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LOGO_URL = "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150678007/settings_images/Jdn9PCkTFCPWW3WGcx88_Premier_Property_Academy_Logo_Transparent.png";
const HERO_URL = "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2150678007/settings_images/86d35f-c51-a64e-0323-be71de4464ae_imgonline-com-ua-CompressToSize-YVyAo57nY7vTJl.jpg";

const tiers = [
  {
    key: 'PREMIUM',
    label: 'Premium',
    price: '99.99',
    period: 'year',
    features: [
      '100+ Courses With New Courses Added Monthly',
      'Proven Property Checklists',
      'Exclusive Audio Guides',
      'Facebook Support Community',
      'Digital Monthly Newsletter',
      'Property Market Assessment Reports',
      'VIP Networking Events Access',
      'Full Ebook Library'
    ],
    color: 'from-emerald-400 to-teal-600',
    btnColor: 'bg-emerald-500 hover:bg-emerald-600',
    popular: false
  },
  {
    key: 'ELITE',
    label: 'Elite',
    price: '199.99',
    period: 'year',
    features: [
      'Everything in Premium Plus:',
      'Document & Template Library',
      'Priority In-Person Event Access',
      'Online Deal Analysis Software',
      'Annual 60min Tax Consultation',
      'Advanced Deal Analysers',
      'Strategic Property Planner',
      'Full Slide Deck Library',
      '100% Training Event Discounts'
    ],
    color: 'from-amber-400 to-orange-600',
    btnColor: 'bg-amber-500 hover:bg-amber-600',
    popular: true
  },
  {
    key: 'PPIC',
    label: 'PPIC',
    price: 'Application Only',
    period: '',
    features: [
      'Exclusive to Inner Circle Members',
      'Private Mentorship Programme',
      'Advanced Portfolio Strategies',
      'One-on-One Strategic Support',
      'Application-Only Entry',
      'Qualifying Criteria Applies'
    ],
    color: 'from-blue-600 to-indigo-800',
    btnColor: 'bg-indigo-900 hover:bg-indigo-950',
    popular: false,
    isApplication: true
  }
];

function apiBase(): string {
  return ((import.meta as any)?.env?.VITE_API_BASE ?? '').trim();
}

export default function Landing() {
  const [loading, setLoading] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkout = async (tier: string) => {
    setLoading(tier);
    try {
      let guestId = localStorage.getItem('guestUserId');
      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem('guestUserId', guestId);
      }

      const resp = await fetch(`${apiBase()}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, userId: guestId })
      });

      if (!resp.ok) {
        const data = await resp.json();
        alert(data.error || 'Checkout failed');
        return;
      }

      const { url } = await resp.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
      alert('Connection error. Please check if backend is running.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Sticky Glass Navbar */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Logo" className="h-12 w-auto md:h-16" />
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hidden text-sm font-bold uppercase tracking-widest text-slate-700 hover:text-emerald-600 md:block transition-colors">Login</Link>
            <a href="#plans" className="rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-md hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95">Start Learning</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-slate-950 pt-20">
        <div className="absolute inset-0 z-0">
          <img src={HERO_URL} alt="Property" className="h-full w-full object-cover opacity-30 scale-105 animate-pulse-slow" />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-emerald-900/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:py-24">
          <div className="max-w-3xl text-left">
            <span className="mb-4 inline-block rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30">
              Official Property Academy
            </span>
            <h1 className="mb-6 text-4xl font-black leading-[1.1] text-white sm:text-6xl lg:text-7xl">
              Master UK Property <br/> 
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Investing Successfully</span>
            </h1>
            <p className="mb-10 text-lg text-slate-300 md:text-xl leading-relaxed max-w-2xl">
              Get instant access to 1,000+ hours of expert-led content, proven checklists, and audio guides. Learn at your own pace, anytime, anywhere.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="#plans" className="rounded-xl bg-emerald-500 px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl hover:bg-emerald-600 transition-all hover:-translate-y-1">
                View Membership Plans
              </a>
              <Link to="/login" className="rounded-xl bg-white/10 px-8 py-4 text-sm font-black uppercase tracking-widest text-white backdrop-blur-md hover:bg-white/20 transition-all">
                Student Login
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-16 flex flex-wrap gap-x-12 gap-y-6">
              <div>
                <div className="text-3xl font-black text-white">100+</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Expert Courses</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">10k+</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Students</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">24/7</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Community Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl group">
               <img src={HERO_URL} alt="Dashboard" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-emerald-900/20" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white/30 p-4 backdrop-blur-xl transition-transform hover:scale-110 cursor-pointer">
                    <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                  </div>
               </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Everything you need in one powerful place.</h2>
              <div className="grid gap-6">
                {[
                  { title: "Watch Anytime", desc: "Access high-quality video lessons on your laptop, tablet or phone." },
                  { title: "Proven Checklists", desc: "Download the exact documents we use for our million-pound deals." },
                  { title: "Audio Guides", desc: "Learn on the go with dedicated audio modules for your commute." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-black">0{i+1}</div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="relative bg-[#f0f9f6] py-32 overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-emerald-200/30 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-200/30 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-4xl font-black text-slate-900 sm:text-6xl">Investment Plans</h2>
            <p className="mx-auto max-w-2xl text-lg font-medium text-slate-600">Choose the path that fits your goals. Start small or go all-in with our Elite mentorship resources.</p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3 lg:items-stretch">
            {tiers.map((t) => (
              <div key={t.key} className={`group relative flex flex-col rounded-[2.5rem] bg-white p-2 shadow-2xl transition-all duration-500 hover:-translate-y-4 ${t.popular ? 'ring-4 ring-amber-400' : 'hover:ring-2 hover:ring-emerald-400'}`}>
                
                {t.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-6 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-lg">
                    Most Recommended
                  </div>
                )}

                <div className="flex flex-col h-full rounded-[2.2rem] p-8 md:p-10">
                  <div className={`mb-10 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${t.color} text-white shadow-lg`}>
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <h3 className="mb-2 text-3xl font-black text-slate-900">{t.label}</h3>
                  
                  <div className="mb-10 flex items-baseline gap-1">
                    {t.isApplication ? (
                      <span className="text-4xl font-black text-slate-900 leading-tight">Application Only</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold text-slate-900">£</span>
                        <span className="text-6xl font-black text-slate-900 tracking-tighter">{t.price}</span>
                        <div className="ml-2">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">+{t.period}</p>
                          <p className="text-[10px] font-bold text-emerald-500 uppercase">Billed Annually</p>
                        </div>
                      </>
                    )}
                  </div>

                  <ul className="mb-12 space-y-5 flex-grow">
                    {t.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-600">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <span className={`text-sm leading-snug ${f.includes(':') ? 'font-bold text-slate-800' : ''}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => !t.isApplication && checkout(t.key)}
                    disabled={loading !== null}
                    className={`relative w-full overflow-hidden rounded-2xl py-5 text-sm font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95 ${t.btnColor}`}
                  >
                    {loading === t.key ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                        Securing...
                      </div>
                    ) : t.isApplication ? 'Apply Now' : 'Activate Membership'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-emerald-600 py-12">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap items-center justify-center gap-12 text-center text-white/80 font-black uppercase tracking-widest text-sm">
           <div className="flex items-center gap-2"><span className="text-white text-2xl">★</span> Trustpilot 4.9/5</div>
           <div>As Seen On Forbes</div>
           <div>PropTech Winner 2026</div>
           <div>10,000+ Success Stories</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-24 text-slate-400">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <img src={LOGO_URL} alt="Logo" className="mb-8 h-20 brightness-200 grayscale opacity-70" />
              <p className="max-w-sm text-lg leading-relaxed">
                Empowering the next generation of property investors with the tools, knowledge and community they need to succeed.
              </p>
            </div>
            <div>
              <h5 className="mb-6 font-black uppercase tracking-widest text-white">Platform</h5>
              <ul className="space-y-4">
                <li><Link to="/" className="hover:text-emerald-400 transition-colors">Courses</Link></li>
                <li><Link to="/" className="hover:text-emerald-400 transition-colors">Mentorship</Link></li>
                <li><Link to="/" className="hover:text-emerald-400 transition-colors">Events</Link></li>
                <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Student Login</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-6 font-black uppercase tracking-widest text-white">Support</h5>
              <ul className="space-y-4">
                <li><Link to="/" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
                <li><Link to="/" className="hover:text-emerald-400 transition-colors">FAQ</Link></li>
                <li><Link to="/" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 border-t border-white/10 pt-12 text-center text-sm font-medium">
            © 2026 Premier Property Academy. All rights reserved. Registered in England & Wales.
          </div>
        </div>
      </footer>
      
      {/* Scroll CSS */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1.05); }
          50% { opacity: 0.4; transform: scale(1.08); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}

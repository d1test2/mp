import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LOGO_URL = "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150678007/settings_images/Jdn9PCkTFCPWW3WGcx88_Premier_Property_Academy_Logo_Transparent.png";
const HERO_URL = "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2150678007/settings_images/86d35f-c51-a64e-0323-be71de4464ae_imgonline-com-ua-CompressToSize-YVyAo57nY7vTJl.jpg";

const tiers = [
  {
    key: 'PREMIUM',
    label: 'Premium',
    price: '99.99',
    features: [
      '100+ Courses With New Courses Added Monthly',
      'Checklists',
      'Audios Guides',
      'Facebook Support Community',
      'Digital Monthly Newsletter',
      'Monthly Property Market Assessment Report',
      'VIP access to monthly Networking Events',
      'Ebook Library',
      'Digital Copy of "Boost Your Pension And Income From Property" By Kam Dovedi'
    ],
    color: 'from-green-400 to-emerald-500'
  },
  {
    key: 'ELITE',
    label: 'Elite',
    price: '199.99',
    features: [
      'All of Premium And:',
      'Document Library - Documents, Template & Checklist',
      'First Access to All In-Person Events Before They Sell Out',
      'Online Analysis Software',
      'Annual 60min Tax Consultation',
      '2 Deal Analysers',
      'Property Planner',
      'Slide Deck Library',
      '100% Discount on Selected Training Events (in-person and online)'
    ],
    color: 'from-amber-400 to-orange-500'
  },
  {
    key: 'PPIC',
    label: 'PPIC',
    price: 'Application Only',
    features: [
      'Qualifying Criteria:',
      'This Tier Is Exclusive to Premier Property Inner Circle Members.',
      'The Premier Property Inner Circle Is An Application-Only Private Mentorship Programme'
    ],
    color: 'from-blue-600 to-indigo-700',
    isApplication: true
  }
];

function apiBase(): string {
  return (import.meta as any)?.env?.VITE_API_BASE ?? 'http://localhost:4000';
}

export default function Landing() {
  const [loading, setLoading] = useState(false);

  const checkout = async (tier: string) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar handled by App.tsx, but Landing needs its specific Hero & Content */}
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-4xl mx-auto drop-shadow-sm">
            Welcome To The World's Leading Platform To Learn How You Can Invest Successfully In The UK Property Market
          </h1>
          
          <div className="mt-12 flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-stretch">
            {/* Join Us Box */}
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-slate-900 shadow-2xl text-left border border-slate-100">
              <h2 className="text-4xl font-bold text-center">Join us!</h2>
              <div className="mt-6 space-y-4 text-center">
                <p className="text-lg font-medium text-slate-700">Get instant access to 1,000+ Hours of content, proven checklists and audio guides.</p>
                <p className="text-slate-600">Watch, read and listen anytime, anywhere, at your own pace</p>
                <p className="text-emerald-600 font-bold">Choose from 3 plans. Starting from just £4.99/month (billed annually)</p>
              </div>
            </div>

            {/* Laptop Image */}
            <div className="hidden lg:block w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl border-4 border-white/20">
              <img src={HERO_URL} alt="Premier Property Academy" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-[#f8ffff] py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-4xl font-black text-slate-800 sm:text-5xl">Choose Your Plan & Start Now</h2>
          
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {tiers.map((t) => (
              <div key={t.key} className={`flex flex-col rounded-3xl bg-white p-8 shadow-xl border-2 transition-transform hover:scale-[1.02] ${t.key === 'ELITE' ? 'border-amber-400 relative' : 'border-slate-100'}`}>
                {t.key === 'ELITE' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-white uppercase tracking-widest">Most Popular</div>
                )}
                
                <div className={`rounded-2xl bg-gradient-to-r ${t.color} p-6 text-center text-white mb-8 shadow-lg`}>
                   {t.key === 'PPIC' ? (
                     <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 font-bold text-xl">
                          <span className="h-6 w-6 rounded-full bg-white text-indigo-600 flex items-center justify-center text-[10px]">P</span>
                          PPIC
                        </div>
                        <p className="text-[10px] opacity-90 leading-tight">Premier Property Inner Circle</p>
                     </div>
                   ) : (
                     <h3 className="text-3xl font-black">{t.label}</h3>
                   )}
                </div>

                <div className="mb-8 text-center">
                  {t.isApplication ? (
                    <div className="text-3xl font-black text-slate-800 leading-tight">
                      Application<br />Only
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-bold">£</span>
                      <span className="text-6xl font-black tracking-tight">{t.price}</span>
                      <div className="text-left ml-2">
                        <p className="text-[10px] font-bold text-slate-400">+VAT</p>
                        <p className="text-sm font-bold text-slate-400">/month</p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => !t.isApplication && checkout(t.key)}
                  disabled={loading && !t.isApplication}
                  className={`w-full rounded-xl py-4 font-black uppercase tracking-widest transition-all shadow-md ${
                    t.isApplication 
                      ? 'bg-indigo-950 text-white hover:bg-indigo-900' 
                      : t.key === 'ELITE' 
                        ? 'bg-amber-400 text-white hover:bg-amber-500' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                >
                  {t.isApplication ? 'Currently Full. Join Waiting List' : loading ? 'Processing...' : 'Buy Now'}
                </button>

                <div className="mt-8 border-t border-slate-100 pt-8">
                  <p className="text-center font-bold text-slate-800 mb-6">- Includes: -</p>
                  <ul className="space-y-4">
                    {t.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className={`mt-1 h-4 w-4 shrink-0 ${t.isApplication ? 'text-indigo-600' : 'text-emerald-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={`text-sm leading-tight ${f.includes(':') ? 'font-bold text-slate-800 mt-2 block' : 'text-slate-600'}`}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <img src={LOGO_URL} alt="Premier Property Academy" className="mx-auto h-24 mb-8" />
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm font-bold text-slate-600 uppercase tracking-widest">
            <Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link>
            <Link to="/" className="hover:text-emerald-500 transition-colors">View Plans</Link>
            <Link to="/" className="hover:text-emerald-500 transition-colors">About</Link>
            <Link to="/" className="hover:text-emerald-500 transition-colors">Store</Link>
            <Link to="/login" className="hover:text-emerald-500 transition-colors">Sign Up</Link>
          </div>
          <p className="mt-12 text-sm text-emerald-500 font-medium">© 2026 Premier Property, all rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

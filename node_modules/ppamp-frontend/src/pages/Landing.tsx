import React from 'react';
import { useState } from 'react';


const tiers = [
  { key: 'PREMIUM', label: 'Premium', price: '£20', features: ['Course access', 'Progress tracking'] },
  { key: 'ELITE', label: 'Elite', price: '£99', features: ['Everything in Premium', 'Advanced courses'] }
];

type Tier = 'PREMIUM' | 'ELITE';

export default function Landing() {
  const [loading, setLoading] = useState(false);

  async function checkout(tier: Tier) {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first.');
        return;
      }

      const resp = await fetch(`${import.meta.env.VITE_API_BASE ?? 'http://localhost:4000'}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tier })
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        alert(data?.error ?? 'Checkout failed');
        return;
      }

      const data: { url?: string } = await resp.json();
      if (data.url) window.location.href = data.url;
      else alert('Stripe session URL missing');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-4xl font-bold">Membership</h1>
        <p className="mt-3 text-slate-300">Choose your tier. Activate instantly via Stripe.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {tiers.map((t) => (
            <div key={t.key} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t.label}</h2>
                <div className="text-2xl font-bold">{t.price}</div>
              </div>
              <ul className="mt-4 space-y-2 text-slate-300">
                {t.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <button
                className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-60"
                onClick={() => checkout(t.key as any)}
                disabled={loading}
              >
                {loading ? 'Preparing...' : `Checkout (${t.key})`}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
          PPIC tier is admin-only.
        </div>
      </div>
    </div>
  );
}


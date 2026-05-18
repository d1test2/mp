import React, { useMemo, useState } from 'react';

function apiBase(): string {
  return '';
}

type ChatResponse = {
  answer?: string;
  upgradePrompt?: string | null;
  suggestedTier?: string | null;
  error?: string;
};

export default function AIChat({ className }: { className?: string }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => localStorage.getItem('token'), []);

  const submit = async () => {
    setError(null);
    const q = question.trim();
    if (!q) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setQuestion('');

    try {
      const resp = await fetch(`${apiBase()}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: q }),
      });

      const data: ChatResponse = await resp.json().catch(() => ({} as any));
      if (!resp.ok) {
        throw new Error(data.error || `Chat failed (${resp.status})`);
      }

      const answer = data.answer || '';
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);

      if (data.upgradePrompt) {
        // Lightweight UI: show upgrade prompt as a separate assistant message.
        setMessages((prev) => [...prev, { role: 'assistant', content: data.upgradePrompt || '' }]);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Chat failed');
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry—something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={
        className ??
        'fixed bottom-6 right-6 w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden'
      }
    >
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-black text-slate-900">Premier AI Tutor</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Asks • Answers • Suggests upgrades</div>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4 max-h-[320px] overflow-auto">
        {messages.length === 0 ? (
          <div className="text-sm text-slate-500">
            Ask a question about modules, deal analysis, financing, legal, or strategy.
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div
                  className={
                    m.role === 'user'
                      ? 'inline-block bg-emerald-50 text-slate-900 rounded-2xl px-4 py-2 border border-emerald-100'
                      : 'inline-block bg-slate-50 text-slate-900 rounded-2xl px-4 py-2 border border-slate-100'
                  }
                >
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    {m.role === 'user' ? 'You' : 'AI'}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <div className="mt-3 text-xs font-bold text-red-600">{error}</div>}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex gap-2 items-center">
          <input
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/5"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
            disabled={loading}
          />
          <button
            onClick={submit}
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}


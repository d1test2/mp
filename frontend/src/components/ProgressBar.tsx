import React from 'react';

export default function ProgressBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label?: string;
}) {
  const safeMax = max <= 0 ? 1 : max;
  const pct = Math.max(0, Math.min(100, (value / safeMax) * 100));

  return (
    <div className="w-full">
      {label ? (
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      ) : null}

      <div className="h-3 w-full rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
        <div
          className="h-full bg-emerald-600"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}


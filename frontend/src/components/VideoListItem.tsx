import React from 'react';

export default function VideoListItem({
  index,
  title,
  active,
  locked,
  completed,
  onClick,
  onResume,
}: {
  index: number;
  title: string;
  active: boolean;
  locked: boolean;
  completed: boolean;
  onClick: () => void;
  onResume?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      className={`group relative flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all border mb-3 ${
        active
          ? 'bg-emerald-50 border-emerald-200 shadow-sm'
          : locked
            ? 'bg-white border-slate-100 text-slate-300'
            : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50'
      }`}
    >
      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
          active
            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
            : locked
              ? 'bg-slate-100 text-slate-400'
              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-50'
        }`}
      >
        {completed ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          index
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-black uppercase tracking-widest ${active ? 'text-slate-900' : 'text-slate-700'}`}>
            {title}
          </p>
          {locked ? (
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              🔒
            </span>
          ) : null}
        </div>

        <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {completed ? 'Completed' : locked ? 'Locked' : active ? 'Currently Watching' : 'In Progress'}
        </div>
      </div>

      {onResume ? (
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hidden md:inline">
          Resume
        </span>
      ) : null}
    </button>
  );
}


import React, { useMemo, useState } from 'react';
import ProgressBar from './ProgressBar';
import VideoListItem from './VideoListItem';

type VideoLike = {
  id: string;
  title: string;
  slug: string;
};

type ModuleConfig = {
  id: string;
  title: string;
  description?: string;
  videoSlugs: string[];
  resources?: {
    transcript?: string;
    worksheet?: string;
    handout?: string;
    exercise?: string;
  };
  requiresComplete?: string;
};

export default function ModuleAccordion({
  modules,
  courseVideos,
  completedVideoIds,
  activeVideoId,
  onSelectVideo,
  onResumeVideo,
  lockedModuleIds,
}: {
  modules: ModuleConfig[];
  courseVideos: VideoLike[];
  completedVideoIds: Set<string>;
  activeVideoId: string | null;
  onSelectVideo: (v: VideoLike) => void;
  onResumeVideo: (v: VideoLike) => void;
  lockedModuleIds: Set<string>;
}) {
  const [openId, setOpenId] = useState<string>(modules[0]?.id ?? '');

  const videoBySlug = useMemo(() => {
    const m = new Map<string, VideoLike>();
    for (const v of courseVideos) m.set(v.slug, v);
    return m;
  }, [courseVideos]);

  const overallVideoIds = useMemo(() => courseVideos.map((v) => v.id), [courseVideos]);
  const overallCompleted = useMemo(() => overallVideoIds.filter((id) => completedVideoIds.has(id)).length, [overallVideoIds, completedVideoIds]);

  return (
    <div>
      {modules.map((mod) => {
        const modLocked = lockedModuleIds.has(mod.id);

        const modVideos = mod.videoSlugs
          .map((slug) => videoBySlug.get(slug))
          .filter(Boolean) as VideoLike[];

        const completedCount = modVideos.filter((v) => completedVideoIds.has(v.id)).length;
        const total = modVideos.length;
        const isOpen = openId === mod.id;

        return (
          <div key={mod.id} className="mb-6 rounded-[2.25rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(mod.id)}
              className="w-full text-left p-6 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <span className="text-xs font-black text-slate-700">📁</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-black uppercase tracking-widest text-slate-900 truncate">
                      {mod.title}
                    </div>
                    {mod.description ? (
                      <div className="mt-1 text-sm text-slate-500 leading-relaxed line-clamp-2">{mod.description}</div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4">
                  <ProgressBar value={completedCount} max={total} />
                </div>

                <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {total === 0 ? 'No videos' : `${completedCount}/${total} videos completed`}
                </div>
              </div>

              <div className="flex flex-col items-end">
                {modLocked ? (
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">🔒 Locked</div>
                ) : completedCount === total && total > 0 ? (
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">✓ Complete</div>
                ) : (
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">In Progress</div>
                )}
                <svg
                  className={`h-5 w-5 mt-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </button>

            {isOpen ? (
              <div className="p-6 pt-0">
                {modVideos.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs font-black uppercase tracking-widest text-slate-400">Videos</div>
                      <div className="flex gap-2">
                        {mod.resources?.transcript || mod.resources?.worksheet ? (
                          <a
                            href={mod.resources?.transcript ?? '#'}
                            target="_blank"
                            rel="noreferrer"
                            className={`rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 border transition-all ${
                              modLocked
                                ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed pointer-events-none'
                                : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-200 hover:text-emerald-700'
                            }`}
                          >
                            Download Resources
                          </a>
                        ) : null}
                      </div>
                    </div>

                    {modVideos.map((v, idx) => (
                      <VideoListItem
                        key={v.id}
                        index={idx + 1}
                        title={v.title}
                        active={activeVideoId === v.id}
                        completed={completedVideoIds.has(v.id)}
                        locked={modLocked}
                        onClick={() => onSelectVideo(v)}
                        onResume={() => onResumeVideo(v)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">No videos in this module.</div>
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}


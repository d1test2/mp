import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AIChat from '../components/AIChat';
import ModuleAccordion from '../components/ModuleAccordion';
import { moduleMapping, type ModuleConfig } from '../data/moduleMapping';
import ProgressBar from '../components/ProgressBar';
import { safeVideoProgressMap } from '../data/courseProgress';

function apiBase(): string {
  return '';
}

interface Video {
  id: string;
  title: string;
  slug: string;
  videoUrl: string;
  transcript: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  videos: Video[];
}

type ProgressRow = {
  videoId: string;
  completed: boolean;
};

export default function CourseDetail() {
  const { slug } = useParams();

  const [course, setCourse] = useState<Course | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'overview' | 'transcript'>('overview');

  // video progress (completed only, since current backend progress model tracks completed)
  const [completedVideoIds, setCompletedVideoIds] = useState<Set<string>>(new Set());

  const courseKey = useMemo(() => {
    // backend uses course.slug in URL and data.course.videos belong to that course.
    // moduleMapping keys are slugs too.
    return slug ?? '';
  }, [slug]);

  const courseModules: ModuleConfig[] = useMemo(() => {
    if (!courseKey) return [];
    return moduleMapping[courseKey]?.modules ?? [];
  }, [courseKey]);

  const overallProgress = useMemo(() => {
    if (!course?.videos?.length) return { completed: 0, total: 0, pct: 0 };
    const total = course.videos.length;
    const completed = course.videos.filter((v) => completedVideoIds.has(v.id)).length;
    const pct = total === 0 ? 0 : (completed / total) * 100;
    return { completed, total, pct };
  }, [course, completedVideoIds]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // 1) Load course
    fetch(`${apiBase()}/api/courses/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401) throw new Error('Please login to access this course.');
        if (res.status === 403) throw new Error('Your membership tier does not include this course.');
        if (!res.ok) throw new Error('Failed to load course details.');
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      })
      .then((data) => {
        if (data && data.course) {
          setCourse(data.course);

          // active video: resume first incomplete across *mapped modules*.
          const videos: Video[] = data.course.videos ?? [];
          const first = videos.find((v: Video) => !completedVideoIds.has(v.id));
          setActiveVideo(first ?? videos[0] ?? null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  // 2) Load progress for all videos in this course
  useEffect(() => {
    if (!course?.videos?.length) return;
    const token = localStorage.getItem('token');

    let cancelled = false;

    (async () => {
      // fetch per-video progress endpoint (existing backend)
      const courseSlug = slug as string;
      const rows: ProgressRow[] = [];

      for (const v of course.videos) {
        try {
          const resp = await fetch(
            `${apiBase()}/api/courses/${courseSlug}/videos/${v.slug}/progress`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!resp.ok) continue;
          const data = await resp.json();
          rows.push({ videoId: v.id, completed: !!data?.progress?.completed });
        } catch {
          // ignore
        }
      }

      if (cancelled) return;

      const { completedVideoIds: completedSet } = safeVideoProgressMap(rows);
      setCompletedVideoIds(completedSet);

      // update active video to first incomplete if needed
      setActiveVideo((prev) => {
        const videos = course.videos;
        const next = videos.find((x) => !completedSet.has(x.id));
        if (!next) return prev ?? videos[0] ?? null;
        // if previous is locked/completed, jump.
        if (!prev) return next;
        if (completedSet.has(prev.id)) return next;
        return prev;
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [course, slug]);

  const getEmbedUrl = (url: string) => {
    let id = '';
    if (url.includes('v=')) {
      id = url.split('v=')[1].split('&')[0];
    } else {
      id = url.split('/').pop()?.split('?')[0] || '';
    }
    return `https://www.youtube.com/embed/${id}`;
  };

  const lockedModuleIds = useMemo(() => {
    // module gating: Module 2+ locked unless previous module is fully complete.
    const locked = new Set<string>();
    if (!courseModules.length || !course?.videos?.length) return locked;

    const courseVideosBySlug = new Map(course.videos.map((v) => [v.slug, v] as const));

    let prevComplete = true;
    for (let i = 0; i < courseModules.length; i++) {
      const m = courseModules[i];
      if (i === 0) {
        prevComplete = true;
        continue;
      }

      if (!prevComplete) {
        locked.add(m.id);
      }

      const modVideos = m.videoSlugs.map((s) => courseVideosBySlug.get(s)).filter(Boolean) as Video[];
      const completedCount = modVideos.filter((v) => completedVideoIds.has(v.id)).length;
      prevComplete = modVideos.length > 0 && completedCount === modVideos.length;
    }

    return locked;
  }, [courseModules, course, completedVideoIds]);

  const overallResumeVideo = useMemo(() => {
    if (!course?.videos?.length) return null;
    return course.videos.find((v) => !completedVideoIds.has(v.id)) ?? course.videos[0] ?? null;
  }, [course, completedVideoIds]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <div className="mb-6 rounded-full bg-red-50 p-4 text-red-600 border border-red-100 shadow-sm">
           <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 leading-tight">Access Restricted</h2>
        <p className="mt-4 text-slate-500 max-w-sm">{error}</p>
        <Link to="/" className="mt-10 rounded-xl bg-slate-900 px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all">
          View Membership Plans
        </Link>
      </div>
    );
  }

  if (!course) return null;

  const courseVideoSlugs = course.videos.map((v) => v.slug);
  const hasMappedVideos = courseModules.some((m) => m.videoSlugs.some((s) => courseVideoSlugs.includes(s)));

  return (
    <div className="min-h-screen bg-white font-sans text-slate-600">
      {/* Mini Nav */}
      <nav className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-[1600px] px-6 py-4 flex items-center justify-between">
           <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 19l-7-7 7-7"/></svg>
              Library
           </Link>
           <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 hidden md:block">{course.title}</h2>
           <div className="w-20" /> {/* Spacer */}
        </div>
      </nav>

      <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-12 bg-slate-50/50">
          <div className="aspect-video w-full overflow-hidden rounded-[2.5rem] bg-slate-200 shadow-2xl shadow-slate-200 border border-white">
            {activeVideo && (
              <iframe
                src={getEmbedUrl(activeVideo.videoUrl)}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
            {!activeVideo && (
              <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold uppercase tracking-widest">
                 No Video Selected
              </div>
            )}
          </div>

          <div className="mt-8 rounded-[3rem] bg-white p-10 shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{activeVideo?.title || course.title}</h1>
                <p className="mt-2 text-slate-500">Follow the module sequence and unlock the next lessons when you're ready.</p>
              </div>
              <div className="min-w-[260px]">
                <ProgressBar
                  value={overallProgress.completed}
                  max={overallProgress.total}
                  label={`Course Progress (${overallProgress.completed}/${overallProgress.total})`}
                />
                {overallResumeVideo ? (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setActiveVideo(overallResumeVideo)}
                      className="w-full rounded-[2rem] py-4 text-xs font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800"
                    >
                      Resume Learning
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-10 flex gap-8 border-b border-slate-100">
              <button
                onClick={() => setView('overview')}
                className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${view === 'overview' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-400 hover:text-slate-900'}`}
              >
                Module Overview
              </button>
              <button
                onClick={() => setView('transcript')}
                className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${view === 'transcript' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-400 hover:text-slate-900'}`}
              >
                Full Transcript
              </button>
            </div>

            <div className="mt-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {view === 'overview' ? (
                <div className="text-lg text-slate-500 leading-relaxed space-y-6">
                  <p>{course.description}</p>
                </div>
              ) : (
                <div className="rounded-[2rem] bg-slate-50 p-10 border border-slate-100 text-slate-600 leading-relaxed italic">
                  {activeVideo?.transcript || 'A detailed transcript for this session is being processed.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full border-l border-slate-100 bg-white lg:w-[450px]">
          <div className="sticky top-24 p-8">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
               <span className="h-1 w-8 bg-emerald-600 rounded-full" />
               Learning Path
            </h2>

            {!hasMappedVideos ? (
              <div className="text-sm text-slate-500">
                Module mapping is not yet aligned with your current video slugs.
                <div className="mt-3 text-xs text-slate-400">Fallback: show all videos in original order.</div>
                <div className="mt-6">
                  {course.videos.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveVideo(v)}
                      className={`w-full mb-3 rounded-2xl border p-4 text-left transition-all ${
                        activeVideo?.id === v.id ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600">{idx + 1}</div>
                        <div>
                          <div className="text-sm font-black uppercase tracking-widest text-slate-900">{v.title}</div>
                          <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {completedVideoIds.has(v.id) ? 'Completed' : 'In Progress'}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ModuleAccordion
                modules={courseModules}
                courseVideos={course.videos.map((v) => ({ id: v.id, title: v.title, slug: v.slug }))}
                completedVideoIds={completedVideoIds}
                activeVideoId={activeVideo?.id ?? null}
                onSelectVideo={(v) => {
                  const real = course.videos.find((x) => x.id === v.id);
                  if (real) setActiveVideo(real);
                }}
                onResumeVideo={(v) => {
                  const real = course.videos.find((x) => x.id === v.id);
                  if (real) setActiveVideo(real);
                }}
                lockedModuleIds={lockedModuleIds}
              />
            )}
          </div>
        </aside>
      </div>

      <AIChat />
    </div>
  );
}



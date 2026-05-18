import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AIChat from '../components/AIChat';


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

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'overview' | 'transcript'>('overview');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${apiBase()}/api/courses/${slug}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
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
          if (data.course.videos && data.course.videos.length > 0) {
            setActiveVideo(data.course.videos[0]);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const getEmbedUrl = (url: string) => {
    // Handle both youtube.com/watch?v=ID and youtu.be/ID
    let id = '';
    if (url.includes('v=')) {
      id = url.split('v=')[1].split('&')[0];
    } else {
      id = url.split('/').pop()?.split('?')[0] || '';
    }
    return `https://www.youtube.com/embed/${id}`;
  };

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

          <div className="mt-12 bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{activeVideo?.title || course.title}</h1>
            
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                     <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Length</div>
                        <div className="text-slate-900 font-bold">15:42</div>
                     </div>
                     <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Level</div>
                        <div className="text-emerald-600 font-bold">Expert</div>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[2rem] bg-slate-50 p-10 border border-slate-100 text-slate-600 leading-relaxed italic">
                  {activeVideo?.transcript || "A detailed transcript for this session is being processed."}
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
               Course Syllabus
            </h2>
            <div className="space-y-4">
              {course.videos && course.videos.length > 0 ? (
                course.videos.map((video, idx) => (
                  <button
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className={`group relative flex w-full items-center gap-6 rounded-3xl p-6 text-left transition-all duration-300 border ${
                      activeVideo?.id === video.id 
                        ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                        : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
                      activeVideo?.id === video.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-black uppercase tracking-widest ${activeVideo?.id === video.id ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>
                        {video.title}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <span className={activeVideo?.id === video.id ? 'text-emerald-600' : ''}>Active Module</span>
                         <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                         <span>15m</span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-sm text-slate-400 italic">No videos found for this course.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
      <AIChat />
    </div>
  );
}


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function apiBase(): string {
  return (import.meta as any)?.env?.VITE_API_BASE ?? 'http://localhost:4000';
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${apiBase()}/api/courses/${slug}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.status === 401) throw new Error('Please login to access this course.');
        if (res.status === 403) throw new Error('Your current membership tier does not include this course.');
        return res.json();
      })
      .then((data) => {
        setCourse(data.course);
        setActiveVideo(data.course.videos[0]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const getEmbedUrl = (url: string) => {
    // Handle https://youtu.be/NnA4P4yrNeQ?si=mq3ypVcB6E0HV8j3
    const id = url.split('/').pop()?.split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
        <h2 className="text-2xl font-bold text-white">Access Restricted</h2>
        <p className="mt-2 text-slate-400">{error}</p>
        <a href="/" className="mt-6 rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white hover:bg-indigo-500">
          Back to Membership
        </a>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
            {activeVideo && (
              <iframe
                src={getEmbedUrl(activeVideo.videoUrl)}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>

          <div className="mt-8">
            <h1 className="text-3xl font-bold text-white">{activeVideo?.title || course.title}</h1>
            <div className="mt-6 flex gap-4 border-b border-slate-800 pb-4">
              <button className="border-b-2 border-indigo-500 px-2 pb-4 text-sm font-medium text-white">Overview</button>
              <button className="px-2 pb-4 text-sm font-medium text-slate-400 hover:text-white">Transcript</button>
              <button className="px-2 pb-4 text-sm font-medium text-slate-400 hover:text-white">Resources</button>
            </div>

            <div className="mt-6 text-slate-300 leading-relaxed">
              <p>{course.description}</p>
              {activeVideo?.transcript && (
                <div className="mt-8 rounded-xl bg-slate-900/50 p-6 border border-slate-800">
                  <h3 className="font-bold text-white">Transcript</h3>
                  <p className="mt-4 text-sm text-slate-400">{activeVideo.transcript}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full border-l border-slate-800 bg-slate-900/30 lg:w-[400px]">
          <div className="sticky top-20 p-6">
            <h2 className="text-xl font-bold text-white">Course Content</h2>
            <div className="mt-6 space-y-2">
              {course.videos.map((video, idx) => (
                <button
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className={`flex w-full items-center gap-4 rounded-xl p-4 text-left transition-colors ${
                    activeVideo?.id === video.id ? 'bg-indigo-600/10 border border-indigo-500/50' : 'hover:bg-slate-800'
                  }`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeVideo?.id === video.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${activeVideo?.id === video.id ? 'text-white' : 'text-slate-300'}`}>
                      {video.title}
                    </p>
                    <p className="text-[10px] text-slate-500">15:00</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

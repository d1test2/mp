import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function apiBase(): string {
  return (import.meta as any)?.env?.VITE_API_BASE ?? '';
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: {
    title: string;
    slug: string;
  };
}

export default function CourseLibrary() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiBase()}/api/courses/library`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Course Library</h1>
            <p className="mt-2 text-slate-400">Master every aspect of property investment.</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700">Filter</button>
            <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700">Search</button>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900 transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              <div className="aspect-video w-full rounded-t-2xl bg-slate-800 flex items-center justify-center overflow-hidden relative">
                 <img 
                    src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400`} 
                    alt={course.title}
                    className="object-cover w-full h-full opacity-60 group-hover:scale-105 transition-transform duration-500"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                 <div className="absolute top-4 left-4 rounded-full bg-indigo-600/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {course.category.title}
                 </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                  {course.description}
                </p>
                <div className="mt-auto pt-6 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>12 Lessons</span>
                  <span>4.5 Hours</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

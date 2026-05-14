import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function apiBase(): string {
  return '';
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
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') {
      setShowSuccess(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    fetch(`${apiBase()}/api/courses/library`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* Top Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
           <Link to="/" className="text-xl font-black text-slate-900 tracking-tighter">PPAMP <span className="text-emerald-600">ACADEMY</span></Link>
           <div className="flex items-center gap-8">
              <Link to="/dashboard" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">My Learning</Link>
              <button onClick={handleLogout} className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors">Logout</button>
           </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        
        {showSuccess && (
          <div className="mb-16 flex items-center justify-between rounded-3xl bg-emerald-50 p-8 text-white shadow-2xl shadow-emerald-200 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7"/></svg>
              </div>
              <div>
                <h3 className="text-2xl font-black">Activation Successful</h3>
                <p className="text-sm font-medium opacity-90 mt-1">Your membership is now active. Welcome to the academy.</p>
              </div>
            </div>
            <button onClick={() => setShowSuccess(false)} className="hover:bg-white/10 rounded-full p-2 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        )}

        <header className="mb-20 text-center md:text-left">
          <div className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 border border-emerald-200 mb-6">
            Learning Pathways
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none mb-6">Expert Knowledge.</h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
            Every module is designed to accelerate your property investment journey with practical, high-yield strategies.
          </p>
        </header>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.slug}`}
              className="group relative flex flex-col rounded-[2.5rem] bg-white p-3 transition-all duration-500 hover:-translate-y-2 shadow-sm hover:shadow-2xl hover:shadow-slate-200 border border-slate-100"
            >
              <div className="aspect-[16/10] w-full rounded-[2rem] bg-slate-100 overflow-hidden relative">
                 <img 
                    src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600`} 
                    alt={course.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-all duration-700 grayscale-[0.5] group-hover:grayscale-0"
                 />
                 <div className="absolute top-6 left-6 rounded-full bg-white/90 backdrop-blur-md px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                    {course.category.title}
                 </div>
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">{course.title}</h3>
                <p className="mt-4 line-clamp-2 text-sm text-slate-500 font-medium leading-relaxed">
                  {course.description}
                </p>
                <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                   <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>12 Modules</span>
                      <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                      <span>4h 20m</span>
                   </div>
                   <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7"/></svg>
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

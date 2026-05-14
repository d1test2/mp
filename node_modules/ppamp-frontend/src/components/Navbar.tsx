import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LOGO_URL = "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150678007/settings_images/Jdn9PCkTFCPWW3WGcx88_Premier_Property_Academy_Logo_Transparent.png";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center">
          <img src={LOGO_URL} alt="Premier Property Academy" className="h-16 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center space-x-8 md:flex">
          <Link to="/" className="text-sm font-bold text-teal-500 hover:text-emerald-500 transition-colors uppercase tracking-tight">Home</Link>
          <Link to="/" className="text-sm font-bold text-teal-500 hover:text-emerald-500 transition-colors uppercase tracking-tight">View Plans</Link>
          <Link to="/" className="text-sm font-bold text-teal-500 hover:text-emerald-500 transition-colors uppercase tracking-tight">About</Link>
          <Link to="/" className="text-sm font-bold text-teal-500 hover:text-emerald-500 transition-colors uppercase tracking-tight">Store</Link>
          
          {token ? (
            <>
              <Link to="/courses" className="text-sm font-bold text-teal-500 hover:text-emerald-500 transition-colors uppercase tracking-tight">Courses</Link>
              <Link to="/dashboard" className="text-sm font-bold text-teal-500 hover:text-emerald-500 transition-colors uppercase tracking-tight">Dashboard</Link>
              <button
                onClick={logout}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors uppercase tracking-tight"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-teal-500 hover:text-emerald-500 transition-colors uppercase tracking-tight">Sign Up</Link>
              <Link
                to="/login"
                className="text-sm font-bold text-teal-500 hover:text-emerald-500 transition-colors uppercase tracking-tight"
              >
                Log In
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu could be added here if needed */}
      </div>
    </nav>
  );
}

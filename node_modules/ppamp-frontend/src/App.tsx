import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">Login page (working on it)</div>} />

    </Routes>
  );
}



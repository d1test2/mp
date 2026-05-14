import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourseLibrary from './pages/CourseLibrary';
import CourseDetail from './pages/CourseDetail';

export default function App() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/courses" element={<CourseLibrary />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
      </Routes>
    </div>
  );
}

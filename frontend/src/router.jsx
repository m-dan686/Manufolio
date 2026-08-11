import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Downloads from './pages/Downloads';
import Certifications from './pages/Certifications';
import Contact from './pages/ContactPage';

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

const SinglePagePortfolio = () => {
  return (
    <div className="scroll-smooth min-h-screen">
      <Home />
      <About />
      <Projects />
      <Downloads />
      <Certifications />
      <Contact />
    </div>
  );
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-xs font-mono text-[var(--text-muted)]">Loading...</div>}>
      <Routes location={location} key={location.pathname}>
        {/* Main Single Page Layout */}
        <Route path="/" element={<SinglePagePortfolio />} />

        {/* Admin CMS Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;


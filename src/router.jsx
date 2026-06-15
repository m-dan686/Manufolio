import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/animations/PageTransition';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Downloads from './pages/Downloads';
import Certifications from './pages/Certifications';
import Contact from './pages/ContactPage';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';

const SinglePagePortfolio = () => {
    return (
        <div className="scroll-smooth">
            <section id="home"><Home /></section>
            <section id="about"><About /></section>
            <section id="projects"><Projects /></section>
            <section id="certifications"><Certifications /></section>
            <section id="downloads"><Downloads /></section>
            <section id="contact"><Contact /></section>
        </div>
    );
};

const AppRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Main Single Page Layout */}
                <Route path="/" element={<PageTransition><SinglePagePortfolio /></PageTransition>} />

                {/* Admin CMS Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    {/* Placeholder for future admin sub-pages */}
                </Route>
                
                {/* Fallback for removed multi-page routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;

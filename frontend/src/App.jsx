import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import AppRoutes from './router';
import { gsap, ScrollTrigger } from './utils/animations.gsap';
import ScrollToTop from './components/utils/ScrollToTop';
import { Cursor } from './components/ui/cursor';
import PageLoader from './components/animations/PageLoader';
import ManufolioBackground from './components/animations/ManufolioBackground';
import EditorialSpine from './components/ui/EditorialSpine';
import { initSmoothScroll } from './utils/smoothScroll';
import { pingHealth } from './api/services/healthService';
import './styles/background.css';

function App() {
  const location = useLocation();
  const isAdminMode = location.pathname.startsWith('/admin');
  const progressRef = useRef(null);

  // Trigger ONE background health request on app mount to wake Render free-tier backend
  useEffect(() => {
    pingHealth();
  }, []);

  // Initialize Global Lenis Smooth Scroll
  useEffect(() => {
    if (isAdminMode) return;
    const lenis = initSmoothScroll();
    return () => {
      // Lenis global instance lives for lifetime of public portfolio
    };
  }, [isAdminMode]);

  // Scroll Progress Indicator
  useEffect(() => {
    if (isAdminMode || !progressRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${self.progress})`;
        }
      },
    });

    return () => trigger.kill();
  }, [isAdminMode]);

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300 overflow-x-hidden relative"
         style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Scroll Progress Indicator */}
      {!isAdminMode && <div ref={progressRef} className="scroll-progress" style={{ transform: 'scaleX(0)' }} />}

      <PageLoader />
      {!isAdminMode && <Cursor />}
      {!isAdminMode && <EditorialSpine />}
      <ScrollToTop />
      {!isAdminMode && <ManufolioBackground />}

      <div className={isAdminMode ? '' : 'manufolio-content flex flex-col min-h-screen'}>
        {!isAdminMode && <Navbar />}

        <main className={`flex-grow min-h-screen relative z-[1] ${isAdminMode ? 'pt-0' : 'pt-20'}`}>
          <AppRoutes />
        </main>

        {!isAdminMode && <Footer />}
      </div>
    </div>
  );
}

export default App;

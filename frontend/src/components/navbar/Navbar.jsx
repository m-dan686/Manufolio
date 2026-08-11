import React, { useRef, useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiMenu, FiX } from 'react-icons/fi';
import ManufolioLogo from './ManufolioLogo';
import { scrollToSection } from '../../utils/smoothScroll';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { name: 'HOME', id: '#home', num: '01' },
  { name: 'ABOUT', id: '#about', num: '02' },
  { name: 'PROJECTS', id: '#projects', num: '03' },
  { name: 'DOWNLOADS', id: '#downloads', num: '04' },
  { name: 'CERTIFICATIONS', id: '#certifications', num: '05' },
  { name: 'CONTACT', id: '#contact', num: '06' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [activeSection, setActiveSection] = useState('#home');
  const lastScrollY = useRef(0);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileLinksRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;

      // Active Section Scroll Spy
      const sectionIds = ['#home', '#about', '#projects', '#downloads', '#certifications', '#contact'];
      const scrollPos = window.scrollY + 220;

      for (let id of sectionIds) {
        const cleanId = id.replace('#', '');
        const el = document.getElementById(cleanId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (isOpen) {
      gsap.fromTo(mobileMenuRef.current,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.45, ease: "power3.out" }
      );
      gsap.from(mobileLinksRef.current.filter(Boolean), {
        x: 30,
        opacity: 0,
        stagger: 0.06,
        duration: 0.35,
        delay: 0.15,
        ease: "power2.out",
      });
    }
  }, [isOpen]);

  const handleNavClick = (id) => {
    setIsOpen(false);
    setActiveSection(id);
    scrollToSection(id);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}
        style={{
          backgroundColor: 'var(--card-bg)',
          opacity: 0.96,
          backdropFilter: 'blur(16px)',
          borderBottom: '1.5px solid rgba(31, 157, 85, 0.25)',
        }}
      >
        <div className="container mx-auto px-6 py-3 flex justify-between items-center relative">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('#home')}
            className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer group"
          >
            <ManufolioLogo />
            <div className="flex flex-col text-left">
              <span className="hidden sm:block font-extrabold text-base tracking-tight transition-colors duration-200 group-hover:text-[var(--orange)]" style={{ color: 'var(--text-primary)' }}>
                Manufolio
              </span>
              <span className="hidden sm:block text-[0.6rem] font-mono text-[var(--green)] tracking-widest uppercase">
                SIGNAL WORKSHOP
              </span>
            </div>
          </button>

          {/* Desktop Nav Links with Restored Old Hover Animations & Underline */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.id)}
                  className="group relative py-1 px-0.5 bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span
                    className="text-[0.65rem] font-mono font-bold transition-colors duration-200"
                    style={{ color: isActive ? 'var(--orange)' : 'var(--text-muted)' }}
                  >
                    {link.num}
                  </span>
                  <span
                    className="text-xs font-mono font-bold tracking-wider transition-colors duration-200"
                    style={{ color: isActive ? 'var(--green)' : 'var(--text-primary)' }}
                  >
                    {link.name}
                  </span>

                  {/* Restored Animated Underline Indicator */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ${
                      isActive ? 'w-full bg-[var(--orange)]' : 'w-0 bg-[var(--green)] group-hover:w-full'
                    }`}
                  />

                  {/* Active Status Pulse Dot */}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--orange)] shadow-sm animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-xl border-none bg-transparent cursor-pointer p-1"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* Subtle Orange Accent Line */}
          <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, var(--orange), transparent)', opacity: 0.4 }} />
        </div>
      </nav>

      {/* Mobile Slide Panel */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-[45] lg:hidden flex flex-col justify-center items-center gap-6"
          style={{
            backgroundColor: 'var(--bg-primary)',
            transform: 'translateX(100%)',
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-6 text-2xl border-none bg-transparent cursor-pointer"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Close menu"
          >
            <FiX />
          </button>

          {navLinks.map((link, i) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.name}
                ref={(el) => (mobileLinksRef.current[i] = el)}
                onClick={() => handleNavClick(link.id)}
                className="text-xl font-mono font-bold bg-transparent border-none cursor-pointer transition-colors duration-200 flex items-center gap-3"
                style={{ color: isActive ? 'var(--orange)' : 'var(--text-primary)' }}
              >
                <span className="text-xs text-[var(--green)] font-mono">{link.num}</span>
                {link.name}
              </button>
            );
          })}

          <div className="mt-4">
            <ThemeToggle />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

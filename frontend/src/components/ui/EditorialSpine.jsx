import React, { useEffect, useState } from 'react';
import { scrollToSection } from '../../utils/smoothScroll';

const spineSections = [
  { id: 'home', num: '01', name: 'HOME' },
  { id: 'about', num: '02', name: 'ABOUT' },
  { id: 'projects', num: '03', name: 'PROJECTS' },
  { id: 'downloads', num: '04', name: 'DOWNLOADS' },
  { id: 'certifications', num: '05', name: 'CERTIFICATIONS' },
  { id: 'contact', num: '06', name: 'CONTACT' },
];

const EditorialSpine = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    spineSections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <aside
      className="hidden 2xl:flex fixed left-5 top-1/2 -translate-y-1/2 z-30 flex-col gap-6 pointer-events-none select-none"
      aria-label="Editorial Section Spine"
    >
      <div className="text-[0.65rem] font-mono font-bold tracking-widest uppercase opacity-40 mb-1 pointer-events-auto" style={{ color: 'var(--text-secondary)' }}>
        MANUFOLIO
      </div>

      <div className="flex flex-col gap-3 relative">
        <div
          className="absolute left-0 w-[2px] rounded-full transition-all duration-300 pointer-events-none"
          style={{
            backgroundColor: 'var(--orange)',
            top: `${spineSections.findIndex(s => s.id === activeSection) * 32}px`,
            height: '24px'
          }}
        />

        {spineSections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(`#${sec.id}`)}
              className="flex items-center gap-2.5 pl-3 py-1 bg-transparent border-none cursor-pointer group text-left pointer-events-auto transition-all duration-200"
            >
              <span
                className="text-[0.7rem] font-mono font-semibold transition-colors duration-200"
                style={{ color: isActive ? 'var(--orange)' : 'var(--text-muted)' }}
              >
                {sec.num}
              </span>
              <span
                className="text-[0.75rem] font-mono font-bold tracking-wider transition-all duration-200 group-hover:translate-x-1"
                style={{ color: isActive ? 'var(--green)' : 'var(--text-secondary)', opacity: isActive ? 1 : 0.6 }}
              >
                {sec.name}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default EditorialSpine;

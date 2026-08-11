import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ManufolioBackground = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Green layer — slowest parallax
      gsap.to(".bg-layer-green", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 2.5,
        },
      });

      // Orange layer — medium parallax
      gsap.to(".bg-layer-orange", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      // Neutral dots — subtle drift
      gsap.to(".bg-layer-neutral", {
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 3,
        },
      });
    }, bgRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={bgRef} className="bg-layer" aria-hidden="true">
      {/* Grid */}
      <div className="bg-grid" />

      {/* Green geometric shapes */}
      <div className="bg-layer-green">
        <div className="bg-shape bg-shape-green" style={{ width: 200, height: 200, top: '8%', left: '5%' }} />
        <div className="bg-shape bg-shape-green" style={{ width: 120, height: 120, top: '45%', right: '8%' }} />
        <div className="bg-shape bg-shape-green" style={{ width: 80, height: 80, bottom: '20%', left: '15%' }} />
      </div>

      {/* Orange geometric shapes */}
      <div className="bg-layer-orange">
        <div className="bg-shape bg-shape-orange" style={{ width: 160, height: 160, top: '20%', right: '12%' }} />
        <div className="bg-shape bg-shape-orange" style={{ width: 100, height: 100, bottom: '35%', left: '40%' }} />
        <div className="bg-shape bg-shape-orange" style={{ width: 60, height: 60, top: '70%', right: '30%' }} />
      </div>

      {/* Neutral dots */}
      <div className="bg-layer-neutral">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 3 + (i % 3) * 2,
              height: 3 + (i % 3) * 2,
              backgroundColor: 'var(--text-primary)',
              opacity: 0.04,
              top: `${8 + i * 7.5}%`,
              left: `${10 + (i * 17) % 80}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ManufolioBackground;

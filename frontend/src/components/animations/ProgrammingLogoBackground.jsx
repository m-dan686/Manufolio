import React, { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FaReact,
  FaJs,
  FaJava,
  FaPython,
  FaGitAlt,
  FaGithub,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs
} from 'react-icons/fa';
import {
  SiSpringboot,
  SiMysql,
  SiTailwindcss,
  SiVite,
  SiMongodb,
  SiExpress
} from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const LOGO_COMPONENTS = [
  { icon: FaReact, color: '#61DAFB' },
  { icon: FaJs, color: '#F7DF1E' },
  { icon: FaJava, color: '#5382A1' },
  { icon: FaPython, color: '#3776AB' },
  { icon: SiSpringboot, color: '#6DB33F' },
  { icon: SiMysql, color: '#4479A1' },
  { icon: FaGitAlt, color: '#F05032' },
  { icon: FaGithub, color: '#6e5494' },
  { icon: FaHtml5, color: '#E34F26' },
  { icon: FaCss3Alt, color: '#1572B6' },
  { icon: SiTailwindcss, color: '#06B6D4' },
  { icon: FaNodeJs, color: '#339933' },
  { icon: SiVite, color: '#646CFF' },
  { icon: SiMongodb, color: '#47A248' },
  { icon: SiExpress, color: '#888888' }
];

const ProgrammingLogoBackground = () => {
  const containerRef = useRef(null);

  const logoInstances = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 16 : 32;

    return Array.from({ length: count }, (_, i) => {
      const spec = LOGO_COMPONENTS[i % LOGO_COMPONENTS.length];
      const isBrandColor = i % 2 === 0;
      return {
        id: i,
        IconComponent: spec.icon,
        authenticColor: spec.color,
        isBrandColor,
        brandClass: i % 4 === 0 ? 'text-[var(--green)]' : (i % 4 === 2 ? 'text-[var(--orange)]' : ''),
        size: Math.floor(Math.random() * 22) + 26,
        top: `${Math.random() * 92 + 4}%`,
        left: `${Math.random() * 90 + 5}%`,
      };
    });
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const logoEls = containerRef.current.querySelectorAll('.bg-logo-item');

      logoEls.forEach((el, index) => {
        gsap.set(el, {
          x: gsap.utils.random(-40, 40),
          y: gsap.utils.random(-40, 40),
          scale: gsap.utils.random(0.55, 1.1),
          rotation: gsap.utils.random(-25, 25),
          opacity: gsap.utils.random(0.20, 0.45)
        });

        if (!prefersReducedMotion) {
          // Floating Drift
          gsap.to(el, {
            x: "+=" + gsap.utils.random(-90, 90),
            y: "+=" + gsap.utils.random(-80, 80),
            rotation: "+=" + gsap.utils.random(-35, 35),
            duration: gsap.utils.random(10, 20),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: gsap.utils.random(0, 3)
          });

          // Continuous slow rotation on alternate icons
          if (index % 2 === 0) {
            gsap.to(el, {
              rotation: "+=360",
              duration: gsap.utils.random(25, 50),
              repeat: -1,
              ease: "none"
            });
          }
        }
      });

      // Scroll Parallax across whole document
      if (!prefersReducedMotion) {
        gsap.to(logoEls, {
          yPercent: (i) => (i % 2 === 0 ? -18 : -32),
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [logoInstances]);

  return (
    <div
      ref={containerRef}
      className="programming-logo-background fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {logoInstances.map(({ id, IconComponent, authenticColor, isBrandColor, brandClass, size, top, left }) => (
        <div
          key={id}
          className={`bg-logo-item absolute transform-gpu will-change-transform ${isBrandColor ? brandClass : ''}`}
          style={{
            top,
            left,
            fontSize: size,
            color: isBrandColor ? undefined : authenticColor,
          }}
        >
          <IconComponent />
        </div>
      ))}
    </div>
  );
};

export default ProgrammingLogoBackground;

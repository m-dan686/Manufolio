import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiDownload, FiArrowRight, FiGithub, FiLinkedin, FiTwitter, FiInstagram } from "react-icons/fi";
import { TextRoll } from "../components/ui/text-roll";
import { InfiniteSlider } from "../components/ui/infinite-slider";
import { scrollToSection } from "../utils/smoothScroll";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

const techStack = [
  "React", "JavaScript", "Python", "Java", "C++",
  "Spring Boot", "MySQL", "Node.js", "Express", "GSAP",
  "Git", "GitHub", "Tailwind CSS", "Vite", "AI", "Machine Learning"
];

const nameWords = ["Manu", "Anandan", "G"];

const socialLinks = [
  { icon: <FiGithub />, url: "https://github.com/m-dan686", name: "GitHub" },
  { icon: <FiLinkedin />, url: "https://www.linkedin.com/in/manu-anandan/", name: "LinkedIn" },
  { icon: <FiTwitter />, url: "https://x.com/m_dan686", name: "X / Twitter" },
  { icon: <FiInstagram />, url: "https://www.instagram.com/m_dan686/", name: "Instagram" }
];

const Home = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      /* ═══════ HERO TIMELINE SEQUENCE (RUNS EXACTLY ONCE ON LOAD) ═══════ */
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      heroTl
        .fromTo(".hero-badge", 
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 }
        )
        .fromTo(".hero-name-word",
          { y: 85, opacity: 0, rotateX: -20 },
          { y: 0, opacity: 1, rotateX: 0, stagger: 0.08, duration: 0.95 },
          "-=0.3"
        )
        .fromTo(".hero-role",
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75 },
          "-=0.4"
        )
        .fromTo(".hero-desc",
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75 },
          "-=0.35"
        )
        .fromTo(".hero-meta",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          "-=0.3"
        )
        .fromTo(".hero-cta",
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.12, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(".hero-image-wrapper",
          { scale: 0.82, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: "power3.out" },
          "-=0.7"
        )
        .fromTo(".orbit-ring-orange",
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8 },
          "-=0.7"
        )
        .fromTo(".orbit-ring-green",
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(".orbiting-stat",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.15, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.4"
        );

      if (!prefersReducedMotion) {
        /* ═══════ PARALLAX RINGS & HERO IMAGE ═══════ */
        gsap.to(".orbit-ring-green", {
          rotation: 18,
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });

        gsap.to(".orbit-ring-orange", {
          rotation: -14,
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        gsap.to(".hero-image-wrapper", {
          yPercent: -6,
          scale: 1.02,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        /* ═══════ RESTORED WORKING ORBIT MOTION PATHS ═══════ */
        gsap.to(".orbiting-projects", {
          motionPath: {
            path: "#orbitPathProjects",
            align: "#orbitPathProjects",
            alignOrigin: [0.5, 0.5],
          },
          duration: 16,
          repeat: -1,
          ease: "linear",
        });

        gsap.to(".orbiting-certificates", {
          motionPath: {
            path: "#orbitPathCerts",
            align: "#orbitPathCerts",
            alignOrigin: [0.5, 0.5],
          },
          duration: 22,
          repeat: -1,
          ease: "linear",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleImageClick = (e) => {
    const ripple = document.createElement("span");
    ripple.className = "absolute inset-0 rounded-full animate-ripple pointer-events-none";
    e.currentTarget.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  };

  return (
    <section id="home" ref={containerRef} className="relative min-h-[94vh] flex flex-col justify-between overflow-hidden">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 my-auto py-16">
        {/* ═══ LEFT ═══ */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full hero-badge"
                  style={{ backgroundColor: 'var(--green-soft)', color: 'var(--green)', border: '1px solid rgba(var(--green-rgb), 0.2)' }}>
              01 / SIGNAL WORKSHOP
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">COIMBATORE, INDIA</span>
          </div>

          {/* Word-by-Word Split Animated Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight flex flex-wrap gap-x-[0.25em]" style={{ color: 'var(--text-primary)' }}>
            {nameWords.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden py-1">
                <span className="hero-name-word inline-block transform-gpu will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <h2 className="hero-role text-xl md:text-2xl font-bold" style={{ color: 'var(--orange)' }}>
            <TextRoll text="Software Engineer | AI & Machine Learning Enthusiast" />
          </h2>

          <p className="hero-desc text-base leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            Motivated B.Tech Information Technology student at Sri Krishna College of Technology with strong foundations in Python, Java, C++, web development, AI, ML, and Data Science. Experienced in developing application-oriented projects using React, Node.js, Express, and MySQL.
          </p>

          <div className="flex flex-wrap items-center gap-3 hero-meta pt-1">
            <span className="text-xs font-mono px-2.5 py-1 rounded border" style={{ borderColor: 'var(--border-neutral)', color: 'var(--text-muted)' }}>
              PHONE: 9342770249
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded border" style={{ borderColor: 'var(--border-neutral)', color: 'var(--text-muted)' }}>
              EMAIL: manuanandan686@gmail.com
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection('#projects')}
              className="hero-cta cursor-pointer border-none inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white transition-all duration-250 hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--orange)' }}
            >
              View Projects <FiArrowRight />
            </button>
            <a
              href={`${import.meta.env.BASE_URL}files/Manu Anandan G - Resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold border-2 transition-all duration-250 hover:shadow-lg hover:-translate-y-0.5"
              style={{ borderColor: 'var(--green)', color: 'var(--green)' }}
            >
              Download Resume <FiDownload />
            </a>
          </div>

          {/* Preserved Social Links */}
          <div className="flex items-center gap-4 pt-3 hero-meta">
            <span className="text-xs font-mono text-[var(--text-muted)]">CONNECT:</span>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-[var(--text-secondary)] hover:text-[var(--orange)] transition-colors duration-200"
                aria-label={social.name}
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ═══ RIGHT: HERO PROFILE & RESTORED ORBITS ═══ */}
        <div className="relative flex justify-center items-center h-[420px] lg:h-[500px]">
          {/* Rings */}
          <div className="absolute w-[280px] h-[280px] rounded-full border border-[rgba(255,122,0,0.25)] orbit-ring-orange pointer-events-none" />
          <div className="absolute w-[420px] h-[420px] rounded-full border border-[rgba(31,157,85,0.25)] orbit-ring-green pointer-events-none" />

          {/* Profile Photo */}
          <div
            onClick={handleImageClick}
            className="hero-image-wrapper relative w-56 h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-xl cursor-pointer"
            style={{ border: '4px solid var(--green)' }}
          >
            <img
              src={`${import.meta.env.BASE_URL}files/portfolio_images/photo2.jpeg`}
              alt="Manu Anandan G"
              className="w-full h-full object-cover"
            />
          </div>

          {/* SVG Orbit Paths for MotionPathPlugin */}
          <svg className="absolute w-[500px] h-[500px] pointer-events-none" viewBox="0 0 500 500" aria-hidden="true">
            <path id="orbitPathProjects" d="M 250,90 A 160,160 0 1,1 249.9,90" fill="none" stroke="none" />
            <path id="orbitPathCerts" d="M 250,45 A 205,205 0 1,1 249.9,45" fill="none" stroke="none" />
            <circle cx="250" cy="250" r="160" fill="none" stroke="rgba(255, 122, 0, 0.15)" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="250" cy="250" r="205" fill="none" stroke="rgba(31, 157, 85, 0.15)" strokeWidth="1" strokeDasharray="6 10" />
          </svg>

          {/* Restored Orbiting Stat Badges */}
          <div
            className="orbiting-projects orbiting-stat absolute px-4 py-2.5 rounded-xl text-center shadow-lg cursor-pointer transition-transform hover:scale-110 z-20 pointer-events-auto"
            onClick={() => scrollToSection('#projects')}
            style={{ backgroundColor: 'var(--card-bg)', border: '1.5px solid var(--orange)' }}
          >
            <span className="text-sm font-extrabold font-mono" style={{ color: 'var(--orange)' }}>7+</span>
            <span className="block text-[0.6rem] font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Projects</span>
          </div>

          <div
            className="orbiting-certificates orbiting-stat absolute px-4 py-2.5 rounded-xl text-center shadow-lg cursor-pointer transition-transform hover:scale-110 z-20 pointer-events-auto"
            onClick={() => scrollToSection('#certifications')}
            style={{ backgroundColor: 'var(--card-bg)', border: '1.5px solid var(--green)' }}
          >
            <span className="text-sm font-extrabold font-mono" style={{ color: 'var(--green)' }}>12+</span>
            <span className="block text-[0.6rem] font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Certificates</span>
          </div>
        </div>
      </div>

      {/* ═══ INFINITE TECH SLIDER ═══ */}
      <div className="w-full py-3 relative z-10" style={{ borderTop: '1px solid var(--border-neutral)', borderBottom: '1px solid var(--border-neutral)' }}>
        <InfiniteSlider speed={40} className="text-xs font-mono font-bold uppercase tracking-widest">
          {techStack.map((tech, i) => (
            <span key={i} className="mx-6 flex items-center gap-2 whitespace-nowrap"
                  style={{ color: i % 2 === 0 ? 'var(--green)' : 'var(--orange)' }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ backgroundColor: i % 2 === 0 ? 'var(--green)' : 'var(--orange)' }} />
              {tech}
            </span>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
};

export default Home;

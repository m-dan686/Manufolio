import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BorderTrail } from "./ui/border-trail";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectCard({ project, onOpen }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Scroll Entrance Reveal
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // GSAP Image Parallax Inside Clipped Card
      if (!prefersReducedMotion && imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2
            }
          }
        );
      }
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="project-card group relative overflow-hidden rounded-2xl cursor-pointer bg-[var(--card-bg)] border-2 border-[var(--card-border)] hover:border-[var(--orange)] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 select-none"
      onClick={() => onOpen(project)}
    >
      <BorderTrail color="var(--orange)" duration={5} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="overflow-hidden h-[240px] w-full relative rounded-t-2xl">
        <img 
          ref={imgRef}
          src={project.image} 
          alt={project.title} 
          loading="lazy" 
          className="absolute top-0 left-0 w-full h-[120%] object-cover scale-[1.04] group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded text-[0.65rem] font-mono font-bold bg-black/60 backdrop-blur-sm text-white border border-white/10">
          FEATURED #{String(project.id).padStart(2, '0')}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--orange)] transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>
          {project.title}
        </h3>
        <p className="text-xs leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tech.map((t) => (
            <span key={t} className="px-2.5 py-1 text-[0.68rem] font-mono font-bold rounded"
                  style={{ backgroundColor: 'rgba(var(--green-rgb), 0.12)', color: 'var(--green)' }}>
              {t}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--border-neutral)' }}>
          <span className="text-xs font-mono font-bold text-[var(--text-muted)] group-hover:text-[var(--green)] transition-colors duration-200">
            Inspect Project Details →
          </span>
          <button
            className="px-4 py-2 text-xs font-bold font-mono rounded-lg text-white transition-all duration-200 group-hover:scale-105"
            style={{ backgroundColor: 'var(--green)' }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

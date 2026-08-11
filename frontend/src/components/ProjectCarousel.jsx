import React, { useRef, useEffect, useState } from "react";
import { gsap, Draggable } from "../utils/animations.gsap";
import { FiChevronLeft, FiChevronRight, FiExternalLink } from "react-icons/fi";

export default function ProjectCarousel({ projects, onOpenProject }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const draggableRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    let resizeObserver = null;

    const ctx = gsap.context(() => {
      const initDraggable = () => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) return;

        const containerWidth = container.clientWidth;
        const trackWidth = track.scrollWidth;
        const minX = Math.min(0, containerWidth - trackWidth - 32);

        if (draggableRef.current) {
          draggableRef.current.applyBounds({ minX, maxX: 0 });
        } else {
          const instance = Draggable.create(track, {
            type: "x",
            edgeResistance: 0.75,
            bounds: { minX, maxX: 0 },
            dragClickables: false,
            zIndexBoost: false,
            allowEventDefault: true,
            onDragEnd() {
              const firstCard = track.children[0];
              const cardStep = firstCard ? firstCard.getBoundingClientRect().width + 24 : 390;
              const index = Math.abs(Math.round(this.x / cardStep));
              setCurrentIndex(gsap.utils.clamp(0, projects.length - 1, index));
            }
          });
          draggableRef.current = instance[0];
        }
      };

      const timer = setTimeout(initDraggable, 100);

      resizeObserver = new ResizeObserver(() => {
        initDraggable();
      });

      resizeObserver.observe(containerRef.current);
      if (trackRef.current) resizeObserver.observe(trackRef.current);

      return () => clearTimeout(timer);
    }, containerRef);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      if (draggableRef.current) {
        draggableRef.current.kill();
        draggableRef.current = null;
      }
      ctx.revert();
    };
  }, [projects]);

  const slideTo = (index) => {
    const clampedIndex = gsap.utils.clamp(0, projects.length - 1, index);
    setCurrentIndex(clampedIndex);
    if (trackRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const trackWidth = trackRef.current.scrollWidth;
      const firstCard = trackRef.current.children[0];
      const cardStep = firstCard ? firstCard.getBoundingClientRect().width + 24 : 390;
      const targetX = gsap.utils.clamp(Math.min(0, containerWidth - trackWidth - 32), 0, -clampedIndex * cardStep);

      gsap.to(trackRef.current, {
        x: targetX,
        duration: 0.6,
        ease: "power3.out",
        onUpdate: () => {
          if (draggableRef.current) {
            draggableRef.current.update();
          }
        }
      });
    }
  };

  return (
    <div ref={containerRef} className="projects-carousel-container relative w-full py-4 overflow-hidden select-none">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            DRAGGABLE ARCHIVE ({String(currentIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')})
          </span>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => slideTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-xl border-2 border-[var(--green)] text-[var(--green)] disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--card-bg)] shadow-md flex items-center justify-center text-lg transition-all duration-200 cursor-pointer hover:border-[var(--orange)] hover:text-[var(--orange)]"
            aria-label="Previous project"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => slideTo(currentIndex + 1)}
            disabled={currentIndex === projects.length - 1}
            className="w-10 h-10 rounded-xl border-2 border-[var(--green)] text-[var(--green)] disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--card-bg)] shadow-md flex items-center justify-center text-lg transition-all duration-200 cursor-pointer hover:border-[var(--orange)] hover:text-[var(--orange)]"
            aria-label="Next project"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Draggable Viewport Track */}
      <div 
        className="carousel-viewport overflow-hidden w-full py-4 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
      >
        <div ref={trackRef} className="carousel-track flex gap-6 w-max transform-gpu pointer-events-auto">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className="carousel-card-item w-[340px] md:w-[380px] p-6 rounded-2xl bg-[var(--card-bg)] border-2 border-[var(--card-border)] hover:border-[var(--orange)] shadow-xl transition-all duration-300 select-none cursor-pointer flex flex-col justify-between flex-shrink-0 group hover:-translate-y-2"
              onClick={() => onOpenProject(project)}
            >
              <div>
                <div className="overflow-hidden rounded-xl h-48 mb-4 relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded text-[0.65rem] font-mono font-bold bg-black/60 backdrop-blur-sm text-white border border-white/10">
                    PROJECT #{String(idx + 1).padStart(2, '0')}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-[var(--orange)] transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>
                  {project.title}
                </h3>
                
                <p className="text-xs line-clamp-3 mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {project.description}
                </p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: 'var(--border-neutral)' }}>
                <div className="flex gap-1.5 flex-wrap">
                  {project.tech.slice(0, 3).map((t) => (
                    <span key={t} className="px-2 py-0.5 text-[0.65rem] font-mono font-bold rounded"
                          style={{ backgroundColor: 'rgba(var(--green-rgb), 0.12)', color: 'var(--green)' }}>
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-lg text-white transition-all duration-200 border-none cursor-pointer group-hover:scale-105"
                  style={{ backgroundColor: 'var(--green)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenProject(project);
                  }}
                >
                  Inspect <FiExternalLink />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

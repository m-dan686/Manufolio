import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * TextReveal component that splits text into animated words/phrases using GSAP ScrollTrigger
 */
export const TextReveal = ({
  children,
  text,
  className = "",
  as: Component = "div",
  delay = 0,
  stagger = 0.035,
  yOffset = 40,
  duration = 0.65
}) => {
  const containerRef = useRef(null);

  const contentText = text || (typeof children === "string" ? children : null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const targetElements = containerRef.current.querySelectorAll(".reveal-word");

      if (prefersReducedMotion) {
        gsap.set(targetElements, { opacity: 1, y: 0 });
        return;
      }

      if (targetElements.length > 0) {
        gsap.fromTo(
          targetElements,
          {
            y: yOffset,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: duration,
            delay: delay,
            stagger: stagger,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      } else {
        gsap.fromTo(
          containerRef.current,
          { y: yOffset, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: duration,
            delay: delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [contentText, delay, stagger, yOffset, duration]);

  if (!contentText) {
    return (
      <Component ref={containerRef} className={`reveal-container ${className}`}>
        {children}
      </Component>
    );
  }

  const words = contentText.split(" ");

  return (
    <Component ref={containerRef} className={`reveal-container flex flex-wrap gap-x-[0.3em] gap-y-[0.1em] ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-0.5">
          <span className="reveal-word inline-block transform-gpu will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
};

export default TextReveal;

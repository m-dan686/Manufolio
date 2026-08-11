import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const SectionReveal = ({
  children,
  className = "",
  delay = 0,
  yOffset = 70
}) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(sectionRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        sectionRef.current,
        {
          opacity: 0,
          y: yOffset
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          delay: delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [delay, yOffset]);

  return (
    <div ref={sectionRef} className={`section-reveal ${className}`}>
      {children}
    </div>
  );
};

export default SectionReveal;

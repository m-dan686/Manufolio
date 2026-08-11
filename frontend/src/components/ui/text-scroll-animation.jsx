import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Skiper31({ text, className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = containerRef.current;
    if (!el) return;

    if (prefersReducedMotion) {
      el.innerHTML = text;
      return;
    }

    // Split text into individual words wrapped in spans
    const words = text.split(" ");
    el.innerHTML = words
      .map(word => `<span class="scroll-word inline-block mr-1.5 transition-colors duration-300" style="opacity: 0.15; color: var(--text-primary)">${word}</span>`)
      .join(" ");

    const wordSpans = el.querySelectorAll(".scroll-word");

    // Timeline to highlight words with brand colors as scroll moves
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        end: "bottom 55%",
        scrub: 1,
      }
    });

    tl.to(wordSpans, {
      opacity: 1,
      color: "var(--orange)",
      stagger: 0.05,
    }).to(wordSpans, {
      color: "var(--text-primary)",
      stagger: 0.05,
    }, 0.2);

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [text]);

  return (
    <p ref={containerRef} className={className}>
      {text}
    </p>
  );
}

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Reusable Grid & List Staggered Entrance Reveal Utility.
 * Applies a robust GSAP ScrollTrigger entrance animation to child items.
 * Guaranteed safety fallback: If prefers-reduced-motion is true or if JavaScript triggers pass,
 * elements remain fully visible.
 *
 * @param {HTMLElement|string} container - Parent DOM node or selector
 * @param {string} childSelector - Target child selector (e.g., ".grid-item")
 * @param {object} options - Custom parameters (stagger, y, scale, start, duration)
 * @returns {gsap.Context|null}
 */
export function createGridReveal(container, childSelector, options = {}) {
  if (!container) return null;

  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const {
    stagger = 0.09,
    y = 40,
    scale = 0.96,
    duration = 0.7,
    start = "top 85%",
    ease = "power3.out",
    once = true,
  } = options;

  const ctx = gsap.context(() => {
    const parentEl = typeof container === "string" ? document.querySelector(container) : container;
    if (!parentEl) return;

    const children = parentEl.querySelectorAll(childSelector);
    if (!children || children.length === 0) return;

    if (prefersReducedMotion) {
      gsap.set(children, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.fromTo(
      children,
      { opacity: 0, y, scale },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        stagger,
        ease,
        scrollTrigger: {
          trigger: parentEl,
          start,
          once,
          toggleActions: "play none none reverse",
        },
      }
    );
  }, container);

  return ctx;
}

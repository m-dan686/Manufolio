import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function initSmoothScroll() {
  if (typeof window === "undefined") return null;
  if (lenisInstance) return lenisInstance;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return null;

  lenisInstance = new Lenis({
    duration: 1.2,
    lerp: 0.08,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.2
  });

  lenisInstance.on("scroll", () => {
    ScrollTrigger.update();
  });

  const updateRaf = (time) => {
    lenisInstance?.raf(time * 1000);
  };

  gsap.ticker.add(updateRaf);
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

export function scrollToSection(target) {
  if (typeof window === "undefined" || !target) return;

  const cleanId = typeof target === "string" ? target.replace(/^#/, "") : "";
  const selector = typeof target === "string" && target.startsWith("#") ? target : `#${cleanId}`;
  const element = document.getElementById(cleanId) || document.querySelector(selector);

  if (!element) {
    console.warn(`Section #${cleanId} not found`);
    return;
  }

  if (lenisInstance) {
    lenisInstance.scrollTo(element, { offset: -80, duration: 1.2 });
  } else {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

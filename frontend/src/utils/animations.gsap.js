import gsap from "gsap";
import {
  ScrollTrigger,
  Draggable,
  TextPlugin,
  MotionPathPlugin
} from "gsap/all";

/* ============================================================
   MANUFOLIO — GLOBAL GSAP PLUGIN REGISTRATION
   ============================================================ */

gsap.registerPlugin(
  ScrollTrigger,
  Draggable,
  TextPlugin,
  MotionPathPlugin
);

export { gsap, ScrollTrigger, Draggable, TextPlugin, MotionPathPlugin };

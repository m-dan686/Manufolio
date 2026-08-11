import React, { useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  AnimatePresence
} from 'framer-motion';
import BackgroundGrid from './BackgroundGrid';
import BackgroundOrbits from './BackgroundOrbits';
import FloatingParticles from './FloatingParticles';
import FloatingShapes from './FloatingShapes';
import SectionAmbientMotion from './SectionAmbientMotion';
import ProgrammingLogoBackground from './ProgrammingLogoBackground';
import '../../styles/background.css';

const ManufolioBackground = () => {
  const shouldReduceMotion = useReducedMotion();

  // Scroll Parallax
  const { scrollYProgress } = useScroll();

  const greenRawY = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const orangeRawY = useTransform(scrollYProgress, [0, 1], [0, 260]);

  const smoothGreenY = useSpring(greenRawY, { stiffness: 40, damping: 20, mass: 1 });
  const smoothOrangeY = useSpring(orangeRawY, { stiffness: 40, damping: 20, mass: 1 });

  // Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const greenMouseX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-35, 35]), { stiffness: 50, damping: 22 });
  const greenMouseY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-25, 25]), { stiffness: 50, damping: 22 });

  const orangeMouseX = useSpring(useTransform(mouseX, [-0.5, 0.5], [30, -30]), { stiffness: 50, damping: 22 });
  const orangeMouseY = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), { stiffness: 50, damping: 22 });

  useEffect(() => {
    if (shouldReduceMotion) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) return;

    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, shouldReduceMotion]);

  return (
    <AnimatePresence>
      <div className="manufolio-background" aria-hidden="true">
        {/* Structural Grid */}
        <BackgroundGrid />

        {/* Programming Logo Background System */}
        <ProgrammingLogoBackground />

        {/* Green Ambient Orb */}
        <motion.div
          className="ambient-orb ambient-orb-green"
          style={{
            x: shouldReduceMotion ? 0 : greenMouseX,
            y: shouldReduceMotion ? 0 : smoothGreenY
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1, 1.08, 0.96, 1]
                }
          }
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Orange Ambient Orb */}
        <motion.div
          className="ambient-orb ambient-orb-orange"
          style={{
            x: shouldReduceMotion ? 0 : orangeMouseX,
            y: shouldReduceMotion ? 0 : smoothOrangeY
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1, 0.95, 1.06, 1]
                }
          }
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Orbits */}
        <BackgroundOrbits />

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Floating Shapes */}
        <FloatingShapes />

        {/* Section Ambient Glow */}
        <SectionAmbientMotion />
      </div>
    </AnimatePresence>
  );
};

export default ManufolioBackground;

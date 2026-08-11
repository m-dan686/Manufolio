import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const FloatingParticles = () => {
  const shouldReduceMotion = useReducedMotion();

  const particles = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 15 : 30;
    const colorPalette = [
      'rgba(31, 157, 85, 0.35)',
      'rgba(255, 122, 0, 0.32)',
      'rgba(31, 157, 85, 0.28)',
      'rgba(255, 122, 0, 0.26)'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 6) + 3,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      color: colorPalette[i % colorPalette.length],
      randomX: (Math.random() - 0.5) * 70,
      randomY: (Math.random() - 0.5) * 70,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 4
    }));
  }, []);

  if (shouldReduceMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            backgroundColor: p.color
          }}
          animate={{
            x: [0, p.randomX, 0],
            y: [0, p.randomY, 0],
            opacity: [0.3, 0.75, 0.3],
            scale: [0.8, 1.25, 0.8]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;

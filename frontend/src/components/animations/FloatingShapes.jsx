import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const FloatingShapes = () => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Top Left Green Ring */}
      <motion.div
        className="absolute rounded-full border-2 border-[var(--green)] opacity-25"
        style={{ width: 85, height: 85, top: '10%', left: '7%' }}
        animate={{
          rotate: 360,
          y: [-15, 15, -15]
        }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
          y: { duration: 7, repeat: Infinity, ease: 'easeInOut' }
        }}
      />

      {/* Top Right Orange Square */}
      <motion.div
        className="absolute rounded-lg border-2 border-[var(--orange)] opacity-25"
        style={{ width: 70, height: 70, top: '16%', right: '9%' }}
        animate={{
          rotate: -360,
          y: [14, -18, 14]
        }}
        transition={{
          rotate: { duration: 38, repeat: Infinity, ease: 'linear' },
          y: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
        }}
      />

      {/* Mid Left Orange Diamond */}
      <motion.div
        className="absolute rounded-sm bg-[var(--orange)] opacity-20"
        style={{ width: 40, height: 40, top: '46%', left: '4%', transform: 'rotate(45deg)' }}
        animate={{
          y: [-22, 22, -22],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Mid Right Green Circle */}
      <motion.div
        className="absolute rounded-full bg-[var(--green)] opacity-20"
        style={{ width: 55, height: 55, top: '56%', right: '5%' }}
        animate={{
          y: [16, -16, 16],
          x: [-12, 12, -12]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Bottom Left Green Rounded Rect */}
      <motion.div
        className="absolute rounded-xl border-2 border-[var(--green)] opacity-25"
        style={{ width: 95, height: 55, bottom: '14%', left: '10%' }}
        animate={{
          rotate: [0, 15, -15, 0],
          y: [-14, 14, -14]
        }}
        transition={{
          rotate: { duration: 24, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
        }}
      />

      {/* Bottom Right Orange Ring */}
      <motion.div
        className="absolute rounded-full border-2 border-dashed border-[var(--orange)] opacity-25"
        style={{ width: 115, height: 115, bottom: '20%', right: '12%' }}
        animate={{
          rotate: 360,
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{
          rotate: { duration: 42, repeat: Infinity, ease: 'linear' },
          scale: { duration: 11, repeat: Infinity, ease: 'easeInOut' }
        }}
      />
    </div>
  );
};

export default FloatingShapes;

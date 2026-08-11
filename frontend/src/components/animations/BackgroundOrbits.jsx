import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const BackgroundOrbits = () => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="background-orbit orbit-green opacity-40" />
        <div className="background-orbit orbit-orange opacity-30" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Green Orbit */}
      <motion.div
        className="background-orbit orbit-green"
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      />

      {/* Orange Orbit */}
      <motion.div
        className="background-orbit orbit-orange"
        animate={{ rotate: -360 }}
        transition={{ duration: 58, repeat: Infinity, ease: 'linear' }}
      />

      {/* Neutral Orbit */}
      <motion.div
        className="background-orbit orbit-neutral"
        animate={{ rotate: 360 }}
        transition={{ duration: 72, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export default BackgroundOrbits;

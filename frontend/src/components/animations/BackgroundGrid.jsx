import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const BackgroundGrid = () => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className="background-grid opacity-40" aria-hidden="true" />;
  }

  return (
    <motion.div
      className="background-grid"
      aria-hidden="true"
      animate={{
        backgroundPosition: ['0px 0px', '80px 40px', '0px 0px']
      }}
      transition={{
        duration: 32,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
};

export default BackgroundGrid;

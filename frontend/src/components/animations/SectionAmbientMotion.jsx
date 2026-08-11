import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const SectionAmbientMotion = () => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* About Section Accent */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-[var(--green)] opacity-5 blur-3xl"
        style={{ top: '22%', left: '10%' }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.08, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2 }}
      />

      {/* Projects Section Accent */}
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-[var(--orange)] opacity-5 blur-3xl"
        style={{ top: '42%', right: '8%' }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.08, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2 }}
      />

      {/* Certifications Section Accent */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-[var(--green)] opacity-5 blur-3xl"
        style={{ top: '65%', left: '15%' }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.08, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2 }}
      />

      {/* Contact Section Accent */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-[var(--orange)] opacity-5 blur-3xl"
        style={{ top: '88%', right: '12%' }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.08, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2 }}
      />
    </div>
  );
};

export default SectionAmbientMotion;

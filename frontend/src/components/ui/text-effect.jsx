import React from 'react';
import { motion } from 'framer-motion';

export function TextEffect({ text, className = '' }) {
  const words = text.split(' ');

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: i * 0.04,
            ease: 'easeOut',
          }}
          className="inline-block mr-1.5"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

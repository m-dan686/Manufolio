import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export function Carousel({ children, className = '' }) {
  const [index, setIndex] = useState(0);
  const count = React.Children.count(children);

  const next = () => {
    setIndex((prev) => (prev + 1) % count);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + count) % count);
  };

  if (count === 0) return null;

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Slide Navigation */}
      <div className="flex justify-between items-center absolute inset-y-0 top-1/2 -translate-y-1/2 z-10 px-2 pointer-events-none w-full">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center pointer-events-auto transition-colors focus:outline-none border border-white/10"
        >
          <FiChevronLeft className="text-2xl" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center pointer-events-auto transition-colors focus:outline-none border border-white/10"
        >
          <FiChevronRight className="text-2xl" />
        </button>
      </div>

      <div className="w-full flex justify-center items-center py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full flex justify-center"
          >
            {React.Children.toArray(children)[index]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

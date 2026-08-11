import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable custom cursor on mobile/touch pointer devices
    const mql = window.matchMedia("(pointer: fine)");
    if (!mql.matches) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed w-6 h-6 rounded-full border-2 border-[var(--orange)] pointer-events-none z-[9999] hidden lg:block"
      style={{
        left: position.x - 12,
        top: position.y - 12,
      }}
      animate={{
        scale: 1,
      }}
      transition={{ type: 'spring', damping: 30, mass: 0.2, stiffness: 450 }}
    />
  );
}

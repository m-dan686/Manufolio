import React from 'react';

export function TextRoll({ text, className = '' }) {
  return (
    <span className={`group inline-flex overflow-hidden relative leading-none ${className}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="relative inline-block transition-transform duration-300 group-hover:-translate-y-full"
          style={{ transitionDelay: `${i * 15}ms` }}
        >
          <span>{char === ' ' ? '\u00A0' : char}</span>
          <span className="absolute left-0 top-full text-[var(--orange)]">
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </span>
  );
}

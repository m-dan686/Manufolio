import React from 'react';

export function BorderTrail({
  className = '',
  duration = 4,
  color = 'var(--orange)',
}) {
  return (
    <div className={`absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          margin: '-2px',
          padding: '2px',
          borderRadius: 'inherit',
          background: `conic-gradient(from 0deg, transparent 50%, ${color} 80%, transparent 100%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: `border-trail-spin ${duration}s linear infinite`,
        }}
      />
      <style>{`
        @keyframes border-trail-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

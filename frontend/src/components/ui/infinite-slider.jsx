import React from 'react';

export function InfiniteSlider({ children, speed = 25, reverse = false, className = '' }) {
  return (
    <div className={`w-full overflow-hidden relative flex py-4 ${className}`}>
      <div
        className="flex gap-8 items-center whitespace-nowrap min-w-full"
        style={{
          animation: `slide-infinite ${speed}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {children}
        {children}
      </div>
      <style>{`
        @keyframes slide-infinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

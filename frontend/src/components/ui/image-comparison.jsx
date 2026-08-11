import React, { useState } from 'react';

export function ImageComparison({ beforeImage, afterImage, className = '' }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  return (
    <div
      className={`relative overflow-hidden select-none cursor-ew-resize rounded-xl border border-white/10 ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* After Image (Background) */}
      <img src={afterImage} alt="After" className="w-full h-full object-cover pointer-events-none" />

      {/* Before Image (Foreground overlay clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img src={beforeImage} alt="Before" className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none" />
      </div>

      {/* Slider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white z-10 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-[var(--orange)] flex items-center justify-center shadow-md">
          <span className="text-black text-xs font-bold font-sans">↔</span>
        </div>
      </div>
    </div>
  );
}

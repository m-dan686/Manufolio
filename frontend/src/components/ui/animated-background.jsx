import { motion } from 'framer-motion';
import React, { useState } from 'react';

export function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  transition,
  enableHover = true,
  activeId,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        const id = child.props['data-id'];

        return React.cloneElement(child, {
          onMouseEnter: () => {
            if (enableHover) setHoveredId(id);
          },
          onMouseLeave: () => {
            if (enableHover) setHoveredId(null);
          },
          onClick: (e) => {
            if (child.props.onClick) child.props.onClick(e);
            if (onValueChange) onValueChange(id);
          },
          children: (
            <div className="relative w-full h-full flex items-center justify-center">
              {((enableHover && hoveredId === id) || (!enableHover && activeId === id)) && (
                <motion.span
                  layoutId="animated-background-bubble"
                  className="absolute inset-0 bg-white/10 dark:bg-white/5 border border-white/10 rounded-xl -z-10"
                  transition={transition || { type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              {child.props.children}
            </div>
          )
        });
      })}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CursorFollower = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const mouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            // Check if hovering over clickable element
            const target = e.target;
            const isClickable = target.closest('a') || target.closest('button') || target.closest('input') || target.closest('textarea');
            setIsHovering(!!isClickable);
        };

        window.addEventListener("mousemove", mouseMove);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 pointer-events-none z-[9999] hidden md:block" // Hidden on mobile
            animate={{
                x: mousePosition.x - 16,
                y: mousePosition.y - 16,
                borderColor: isHovering ? 'var(--green)' : 'var(--orange)',
                scale: isHovering ? 1.5 : 1,
                backgroundColor: isHovering ? 'rgba(0, 200, 83, 0.1)' : 'transparent'
            }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 28,
                mass: 0.5
            }}
        />
    );
};

export default CursorFollower;

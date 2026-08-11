export const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 1, 0.5, 1]
        }
    }
};

export const scaleHover = {
    hover: {
        scale: 1.05,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20
        }
    }
};

export const staggerContainer = {
    visible: {
        transition: {
            staggerChildren: 0.12
        }
    }
};

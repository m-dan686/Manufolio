import { motion } from "framer-motion";
import { useEffect } from "react";

const PageTransition = ({ children }) => {

    /* Scroll reset */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }}
            style={{
                willChange: "transform, opacity"
            }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;

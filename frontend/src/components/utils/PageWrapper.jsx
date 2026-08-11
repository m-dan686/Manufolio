import React from 'react';
import { motion } from 'framer-motion';

const PageWrapper = ({ children }) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full flex-grow"
        >
            {children}
        </motion.section>
    );
};

export default PageWrapper;

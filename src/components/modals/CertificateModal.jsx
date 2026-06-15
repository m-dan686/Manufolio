import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const CertificateModal = ({ isOpen, onClose, pdf, title }) => {
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 25 }}
                        className="relative w-full max-w-6xl h-[90vh] bg-black rounded-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* CLOSE */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-red-500 text-white rounded-full p-3 transition-colors shadow-lg border border-white/10 backdrop-blur-sm"
                            aria-label="Close Modal"
                        >
                            <FiX className="text-2xl" />
                        </button>

                        {/* CONTENT VIEWER (PDF or Image) */}
                        {pdf?.toLowerCase().endsWith('.pdf') ? (
                            <iframe
                                src={`${pdf}#toolbar=0&navpanes=0&scrollbar=1`}
                                title={title}
                                className="w-full h-full rounded-xl"
                            />
                        ) : (
                            <img
                                src={pdf}
                                alt={title}
                                className="w-full h-full object-contain rounded-xl bg-black"
                            />
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CertificateModal;

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

const CertificateModal = ({ isOpen, onClose, pdf, title }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-6xl h-[90vh] bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-2xl border border-[var(--card-border)] transform-gpu transition-all duration-300 animate-scaleUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-50 px-6 py-4 bg-black/75 backdrop-blur-md flex justify-between items-center border-b border-white/10">
                    <h3 className="text-sm font-mono font-bold text-white truncate max-w-lg">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="bg-black/60 hover:bg-red-500 text-white rounded-full p-2.5 transition-colors shadow-lg border border-white/10"
                        aria-label="Close Modal"
                    >
                        <FiX className="text-xl" />
                    </button>
                </div>

                {/* Viewer */}
                <div className="w-full h-full pt-14 bg-black">
                    {pdf?.toLowerCase().endsWith('.pdf') ? (
                        <iframe
                            src={`${pdf}#toolbar=0&navpanes=0&scrollbar=1`}
                            title={title}
                            className="w-full h-full border-none"
                        />
                    ) : (
                        <img
                            src={pdf}
                            alt={title}
                            className="w-full h-full object-contain bg-black"
                        />
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CertificateModal;

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiGithub, FiExternalLink } from "react-icons/fi";

const ProjectModal = ({ isOpen, onClose, project }) => {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-bg-secondary w-full max-w-4xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* CLOSE BUTTON */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-orange transition-colors backdrop-blur-md"
                        >
                            <FiX size={24} />
                        </button>

                        {/* IMAGE HEADER */}
                        <div className="h-64 md:h-80 w-full relative">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary to-transparent" />
                        </div>

                        {/* CONTENT */}
                        <div className="p-8 -mt-12 relative">
                            <h2 className="text-4xl font-bold text-text-primary mb-2">
                                {project.title}
                            </h2>
                            <div className="flex gap-2 mb-6">
                                {project.tags?.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="text-xs font-mono px-3 py-1 rounded-full bg-orange/10 text-orange border border-orange/20"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <p className="text-text-primary opacity-80 leading-relaxed mb-8">
                                {project.details || project.description}
                            </p>

                            {/* ACTIONS */}
                            <div className="flex gap-4">
                                {project.demoLink && (
                                    <a
                                        href={project.demoLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 px-6 py-3 bg-orange text-white rounded-xl font-bold hover:bg-orange/90 transition-colors"
                                    >
                                        <FiExternalLink /> Live Demo
                                    </a>
                                )}
                                {project.githubLink && (
                                    <a
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 px-6 py-3 bg-white/5 text-text-primary border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors"
                                    >
                                        <FiGithub /> Source Code
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;

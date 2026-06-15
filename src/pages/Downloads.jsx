import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FiDownload, FiUnlock } from "react-icons/fi";
import gsap from "gsap";

const downloadableFiles = [
    { name: "resume.pdf", path: import.meta.env.BASE_URL + "files/Manu Anandan G - Resume.pdf", label: "My Resume" },
    { name: "10th-marksheet.pdf", path: import.meta.env.BASE_URL + "files/academics/school/10th-marksheet.pdf", label: "10th Marksheet" },
    { name: "11th-marksheet.pdf", path: import.meta.env.BASE_URL + "files/academics/school/11th-marksheet.pdf", label: "11th Marksheet" },
    { name: "12th-marksheet.pdf", path: import.meta.env.BASE_URL + "files/academics/school/12th-marksheet.pdf", label: "12th Marksheet" },
    { name: "sem1-marksheet.pdf", path: import.meta.env.BASE_URL + "files/academics/college/sem1-marksheet.pdf", label: "Sem 1 Marksheet" },
    { name: "sem2-marksheet.pdf", path: import.meta.env.BASE_URL + "files/academics/college/sem2-marksheet.pdf", label: "Sem 2 Marksheet" },
    { name: "sem3-marksheet.pdf", path: import.meta.env.BASE_URL + "files/academics/college/sem3-marksheet.pdf", label: "Sem 3 Marksheet" },
    { name: "sem4-marksheet.pdf", path: import.meta.env.BASE_URL + "files/academics/college/sem4-marksheet.pdf", label: "Sem 4 Marksheet" }
];

const Downloads = () => {

    useEffect(() => {

        /* Vault breathing glow */
        gsap.to(".vault-card", {
            boxShadow:
                "0 0 45px rgba(255,115,0,0.35), 0 25px 60px rgba(0,0,0,0.15)",
            duration: 2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            stagger: 0.2
        });

        /* Hover animation */
        gsap.utils.toArray(".vault-card").forEach((card) => {

            card.addEventListener("mouseenter", () => {
                gsap.to(card, {
                    scale: 1.03,
                    boxShadow:
                        "0 0 80px rgba(255,115,0,0.7), 0 30px 80px rgba(0,0,0,0.25)",
                    duration: 0.3
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    scale: 1,
                    boxShadow:
                        "0 0 45px rgba(255,115,0,0.35), 0 25px 60px rgba(0,0,0,0.15)",
                    duration: 0.4
                });
            });

        });

        /* Floating nodes */
        gsap.utils.toArray(".floating-node").forEach((node, i) => {
            gsap.to(node, {
                y: "+=20",
                x: "+=10",
                repeat: -1,
                yoyo: true,
                duration: 2 + i * 0.4,
                ease: "sine.inOut"
            });
        });

    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden px-6 py-12">

            {/* Orbit Background */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">

                <div className="absolute w-[350px] h-[350px] rounded-full border border-orange/30 animate-spin-slow"></div>

                <div className="absolute w-[500px] h-[500px] rounded-full border border-green/30 animate-spin-reverse-slow"></div>

                <div className="absolute w-[650px] h-[650px] rounded-full border border-white/10"></div>

                <div className="absolute w-96 h-96 bg-orange/20 blur-3xl animate-pulse-soft"></div>

            </div>

            {/* Floating Nodes */}
            <svg className="absolute w-full h-full pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <circle
                        key={i}
                        cx={100 + i * 80}
                        cy={80 + i * 60}
                        r="3"
                        fill="rgba(255,255,255,0.6)"
                        className="floating-node"
                    />
                ))}
            </svg>

            {/* Header */}
            <div className="text-center mb-16 relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                    Document <span className="text-orange">Downloads</span>
                </h1>

                <p className="text-text-primary opacity-60 max-w-lg mx-auto">
                    Access my academic records and professional documents.
                </p>
            </div>

            {/* Download Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">

                {downloadableFiles.map((file) => (

                    <motion.div
                        key={file.name}
                        className="vault-card rounded-2xl p-6 bg-bg-light/80 backdrop-blur-md border border-white/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >

                        <div className="flex items-center gap-4 mb-6">

                            <div className="p-4 rounded-full bg-green/15 text-green">
                                <FiUnlock className="text-2xl" />
                            </div>

                            <div>
                                <h3 className="font-bold text-lg text-text-primary">
                                    {file.label}
                                </h3>

                                <p className="text-xs opacity-50 font-mono">
                                    {file.name}
                                </p>
                            </div>

                        </div>

                        <a
                            href={file.path}
                            download
                            className="w-full py-3 bg-green text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <FiDownload /> Download File
                        </a>

                    </motion.div>

                ))}

            </div>
        </div>
    );
};

export default Downloads;

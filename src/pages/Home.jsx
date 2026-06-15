import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiDownload, FiArrowRight } from "react-icons/fi";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

const Home = () => {
    const containerRef = useRef(null);
    const nameRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ================= SPLIT TEXT ================= */
            const chars = nameRef.current.innerText.split("");
            nameRef.current.innerHTML = chars
                .map(
                    (c) =>
                        `<span class="inline-block opacity-0 translate-y-10 class-char">${c === " " ? "&nbsp;" : c
                        }</span>`
                )
                .join("");

            gsap.to(".class-char", {
                y: 0,
                opacity: 1,
                stagger: 0.05,
                duration: 0.8,
                ease: "back.out(1.7)",
            });

            gsap.from(".hero-subtext", {
                opacity: 0,
                y: 20,
                duration: 0.8,
                stagger: 0.2,
                delay: 0.6,
            });

            gsap.from(".hero-cta", {
                scale: 0.8,
                opacity: 0,
                stagger: 0.1,
                duration: 0.5,
                ease: "back.out(1.6)",
                delay: 0.8,
            });

            /* ================= ORBIT GLOW BREATHING ================= */
            gsap.to(".orbit-ring-orange", {
                boxShadow: "0 0 80px rgba(255,115,0,0.9)",
                scrollTrigger: {
                    trigger: containerRef.current,
                    scrub: true,
                },
            });

            gsap.to(".orbit-ring-green", {
                boxShadow: "0 0 70px rgba(16, 185, 129, 0.4)",
                scrollTrigger: {
                    trigger: containerRef.current,
                    scrub: true,
                },
            });

            /* ================= DEPTH PARALLAX ================= */
            gsap.utils
                .toArray([
                    ".orbit-ring-orange",
                    ".orbit-ring-green",
                    ".orbit-ring-neutral",
                ])
                .forEach((ring, i) => {
                    gsap.to(ring, {
                        y: (i + 1) * 40,
                        scrollTrigger: {
                            trigger: containerRef.current,
                            scrub: true,
                        },
                    });
                });

            /* ================= ORBIT PATH ================= */
            /* ================= PROJECTS ORBIT ================= */
            gsap.to(".orbiting-projects", {
                motionPath: {
                    path: "#orbitPathProjects",
                    align: "#orbitPathProjects",
                    alignOrigin: [0.5, 0.5],
                },
                duration: 12,
                repeat: -1,
                ease: "linear",
            });

            gsap.to(".orbiting-projects", {
                boxShadow: "0 0 60px rgba(255,115,0,0.8)",
                repeat: -1,
                yoyo: true,
                duration: 1.6,
                ease: "sine.inOut",
            });

            /* ================= CERTIFICATES ORBIT ================= */
            gsap.to(".orbiting-certificates", {
                motionPath: {
                    path: "#orbitPathCerts",
                    align: "#orbitPathCerts",
                    alignOrigin: [0.5, 0.5],
                },
                duration: 18,
                repeat: -1,
                ease: "linear",
            });

            gsap.to(".orbiting-certificates", {
                boxShadow: "0 0 60px rgba(16, 185, 129, 0.4)",
                repeat: -1,
                yoyo: true,
                duration: 2,
                ease: "sine.inOut",
            });

            /* ================= CTA GLOW ================= */
            gsap.utils.toArray(".hero-cta").forEach((btn) => {
                const isGreen = btn.classList.contains("border-green");
                const glowColor = isGreen ? "rgba(16, 185, 129, 0.5)" : "rgba(255,115,0,0.7)";

                btn.addEventListener("mouseenter", () => {
                    gsap.to(btn, {
                        boxShadow: `0 0 40px ${glowColor}`,
                        duration: 0.3,
                    });

                    const icon = btn.querySelector("svg");
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1.2,
                            y: isGreen ? 2 : 0,
                            x: isGreen ? 0 : 4,
                            duration: 0.3,
                            ease: "back.out(2)"
                        });
                    }
                });

                btn.addEventListener("mouseleave", () => {
                    gsap.to(btn, { boxShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.4 });

                    const icon = btn.querySelector("svg");
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1,
                            y: 0,
                            x: 0,
                            duration: 0.3
                        });
                    }
                });
            });

            /* ================= FLOATING NODES ================= */
            gsap.utils.toArray(".floating-node").forEach((node, i) => {
                gsap.to(node, {
                    y: "+=20",
                    x: "+=10",
                    repeat: -1,
                    yoyo: true,
                    duration: 2 + i * 0.4,
                    ease: "sine.inOut",
                });
            });

            /* ================= SVG DASH ROTATION ================= */
            gsap.to(".orbit-svg circle", {
                strokeDashoffset: 500,
                duration: 20,
                repeat: -1,
                ease: "linear",
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleMagneticHover = (e) => {
        const { left, top, width, height } =
            e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - (left + width / 2)) * 0.3;
        const y = (e.clientY - (top + height / 2)) * 0.3;
        gsap.to(e.currentTarget, { x, y, duration: 0.2 });
    };

    const handleMagneticLeave = (e) =>
        gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.2 });

    const handleImageClick = (e) => {
        const ripple = document.createElement("span");
        ripple.className =
            "absolute inset-0 rounded-full animate-ripple pointer-events-none";
        e.currentTarget.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    };

    return (
        <div
            ref={containerRef}
            className="relative min-h-[90vh] flex items-center overflow-hidden"
        >
            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* LEFT */}
                <div className="space-y-6">
                    <p className="hero-subtext text-green text-2xl bold">Hi, I'm</p>
                    <h1
                        ref={nameRef}
                        className="text-5xl md:text-6xl font-bold text-text-primary"
                    >
                        Manu Anandan
                    </h1>
                    <h2 className="hero-subtext text-3xl opacity-80">
                        <span className="text-orange">AI & Full Stack Developer</span>
                    </h2>
                    <p className="hero-subtext opacity-60 max-w-lg text-justify">
                        AI & Full Stack Developer building intelligent systems 
                        with React, Machine Learning, and Data-driven design.
                    </p>
                    <p className="hero-subtext opacity-60 max-w-lg">
                        I create applications that combine intelligent backend logic 
                        with engaging, animated user experiences.
                    </p>

                    <div className="flex gap-4 pt-8">
                        <a
                            href="#projects"
                            onClick={(e) => {
                                e.preventDefault();
                                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            onMouseMove={handleMagneticHover}
                            onMouseLeave={handleMagneticLeave}
                            className="hero-cta px-8 py-4 bg-orange text-white rounded-full font-bold flex items-center gap-2"
                        >
                            View Work <FiArrowRight />
                        </a>

                        <a
                            href={`${import.meta.env.BASE_URL}files/Manu Anandan G - Resume.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseMove={handleMagneticHover}
                            onMouseLeave={handleMagneticLeave}
                            className="hero-cta px-8 py-4 border-2 border-green text-green rounded-full font-bold flex items-center gap-2"
                        >
                            Resume <FiDownload />
                        </a>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="relative flex justify-center items-center h-[500px]">
                    <div className="absolute w-[300px] h-[300px] rounded-full orbit-ring-orange animate-spin-slow"></div>
                    <div className="absolute w-[450px] h-[450px] rounded-full orbit-ring-green animate-spin-reverse-slow"></div>
                    <div className="absolute w-[600px] h-[600px] rounded-full orbit-ring-neutral"></div>

                    <div className="absolute w-80 h-80 rounded-full bg-orange/20 blur-3xl animate-pulse-soft"></div>

                    <div
                        onClick={handleImageClick}
                        className="relative w-72 h-72 rounded-full overflow-hidden border-4 border-bg-light shadow-2xl cursor-pointer"
                    >
                        <img
                            src={`${import.meta.env.BASE_URL}files/portfolio_images/photo2.jpeg`}
                            alt="Manu"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* ORBIT STAT */}
                    {/* ORBIT STATS */}
                    <svg width="0" height="0">
                        <path
                            id="orbitPathProjects"
                            d="M -120,0 A 120,120 0 1,1 120,0 A 120,120 0 1,1 -120,0"
                        />
                        <path
                            id="orbitPathCerts"
                            d="M -160,0 A 160,160 0 1,1 160,0 A 160,160 0 1,1 -160,0"
                        />
                    </svg>

                    {/* 10+ PROJECTS */}
                    <div className="orbiting-projects absolute bg-bg-light/80 backdrop-blur-md border border-orange p-4 rounded-2xl text-center">
                        <span className="text-xl font-bold text-orange">5+</span>
                        <span className="block text-xs opacity-70">PROJECTS</span>
                    </div>

                    {/* 12+ CERTIFICATES */}
                    <div className="orbiting-certificates absolute bg-bg-light/80 backdrop-blur-md border border-green p-4 rounded-2xl text-center">
                        <span className="text-xl font-bold text-green">12+</span>
                        <span className="block text-xs opacity-70">CERTIFICATES</span>
                    </div>

                    {/* SVG */}
                    <svg className="orbit-svg absolute w-[520px] h-[520px]">
                        <circle
                            cx="260"
                            cy="260"
                            r="250"
                            fill="none"
                            stroke="rgba(255,115,0,0.25)"
                            strokeWidth="2"
                            strokeDasharray="6 12"
                        />
                    </svg>

                    {/* FLOAT NODES */}
                    <svg className="absolute w-full h-full">
                        {[...Array(6)].map((_, i) => (
                            <circle
                                key={i}
                                cx={100 + i * 60}
                                cy={50 + i * 40}
                                r="3"
                                fill="rgba(255,255,255,0.6)"
                                className="floating-node"
                            />
                        ))}
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Home;

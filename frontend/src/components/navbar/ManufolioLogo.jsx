import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ManufolioLogo() {
    const logoRef = useRef(null);

    /* ===== SYSTEM LIGHT / DARK AUTO SYNC ===== */
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: light)");
        document.documentElement.classList.toggle("light", mq.matches);
        mq.addEventListener("change", e =>
            document.documentElement.classList.toggle("light", e.matches)
        );
    }, []);

    /* ===== INTRO + CONTINUOUS GLOW ===== */
    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(
            ".ma-rect",
            { strokeDasharray: 400, strokeDashoffset: 400 },
            { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" }
        )
            .fromTo(
                ".ma-text",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.6 },
                "-=0.5"
            )
            .to(
                logoRef.current,
                {
                    filter: "drop-shadow(0 0 18px var(--logo-glow))",
                    duration: 0.8
                },
                "-=0.3"
            );

        gsap.to(logoRef.current, {
            filter: "drop-shadow(0 0 26px var(--logo-glow))",
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }, []);

    /* ===== SCROLL INTELLIGENCE ===== */
    useEffect(() => {
        ScrollTrigger.create({
            start: "top -12",
            onEnter: () =>
                gsap.to(logoRef.current, {
                    filter: "drop-shadow(0 0 34px var(--logo-glow))",
                    duration: 0.4
                }),
            onLeaveBack: () =>
                gsap.to(logoRef.current, {
                    filter: "drop-shadow(0 0 18px var(--logo-glow))",
                    duration: 0.4
                })
        });
    }, []);

    /* ===== CURSOR REACTIVE MICRO MOTION ===== */
    useEffect(() => {
        const el = logoRef.current;

        const move = e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) / 8;
            const y = (e.clientY - r.top - r.height / 2) / 8;

            gsap.to(el, {
                x,
                y,
                rotateX: -y,
                rotateY: x,
                duration: 0.4,
                ease: "power2.out"
            });
        };

        const reset = () =>
            gsap.to(el, {
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                duration: 0.6,
                ease: "power3.out"
            });

        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", reset);

        return () => {
            el.removeEventListener("mousemove", move);
            el.removeEventListener("mouseleave", reset);
        };
    }, []);

    return (
        <div ref={logoRef} className="ma-logo-wrapper w-10 h-10">
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                    className="ma-rect"
                    x="4"
                    y="4"
                    width="92"
                    height="92"
                    rx="16"
                    fill="var(--logo-bg)"
                    stroke="var(--logo-border)"
                    strokeWidth="4"
                />
                <text
                    className="ma-text"
                    x="50"
                    y="62"
                    textAnchor="middle"
                    fontSize="42"
                    fontWeight="800"
                    letterSpacing="-4"
                    fill="var(--logo-text)"
                    fontFamily="Times New Roman, serif"
                >
                    MA
                </text>
            </svg>
        </div>
    );
}

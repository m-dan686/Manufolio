import React, { useRef, useEffect } from 'react';
import { FaTwitter, FaInstagram, FaWhatsapp, FaGithub, FaLinkedin } from 'react-icons/fa';
import gsap from 'gsap';

const socialLinks = [
    { icon: <FaTwitter />, url: 'https://x.com/m_dan686', name: 'Twitter' },
    { icon: <FaInstagram />, url: 'https://www.instagram.com/m_dan686/', name: 'Instagram' },
    { icon: <FaWhatsapp />, url: '#', name: 'WhatsApp' },
    { icon: <FaGithub />, url: 'https://github.com/m-dan686', name: 'GitHub' },
    { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/manu-anandan/', name: 'LinkedIn' },
];

const Footer = () => {
    const footerRef = useRef(null);

    const handleMouseEnter = (e) => {
        gsap.to(e.target, {
            scale: 1.2,
            rotate: 10,
            color: 'var(--green)',
            textShadow: '0 0 10px var(--green)',
            duration: 0.3
        });
    };

    const handleMouseLeave = (e) => {
        gsap.to(e.target, {
            scale: 1,
            rotate: 0,
            color: 'var(--text-primary)',
            textShadow: 'none',
            duration: 0.3
        });
    };

    return (
        <footer ref={footerRef} className="py-8 bg-[var(--bg-primary)] border-t border-white/10 transition-colors duration-300">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-[var(--text-primary)] opacity-70">
                    © {new Date().getFullYear()} Manufolio. All rights reserved.
                </p>

                <div className="flex items-center gap-6">
                    {socialLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl text-[var(--text-primary)] transition-colors"
                            onMouseEnter={(e) => handleMouseEnter(e)}
                            onMouseLeave={(e) => handleMouseLeave(e)}
                            aria-label={link.name}
                        >
                            {/* Ensure the event target logic works on the icon parent */}
                            <span className="pointer-events-none">{link.icon}</span>
                            {/* Actually, it's safer to put event on anchor and animate anchor's color/transform. */}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;

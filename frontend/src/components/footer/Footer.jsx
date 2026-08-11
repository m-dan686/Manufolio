import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { icon: <FaGithub />, url: 'https://github.com/m-dan686', name: 'GitHub' },
  { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/manu-anandan/', name: 'LinkedIn' },
  { icon: <FaTwitter />, url: 'https://x.com/m_dan686', name: 'X / Twitter' },
  { icon: <FaInstagram />, url: 'https://www.instagram.com/m_dan686/', name: 'Instagram' },
];

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-item", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="py-14 border-t transition-colors duration-300 relative z-10 block w-full"
      style={{ borderColor: 'var(--border-neutral)', backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="container mx-auto px-6 flex flex-col items-center gap-6">
        {/* Brand Header */}
        <div className="footer-item text-center">
          <h3 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--green)' }}>Manu Anandan G</h3>
          <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-secondary)' }}>
            Software Engineer | AI & Machine Learning Enthusiast
          </p>
        </div>

        {/* Social Links */}
        <div className="footer-item flex items-center gap-6 my-2">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl transition-all duration-200 hover:text-[var(--green)] hover:-translate-y-1"
              style={{ color: 'var(--text-secondary)' }}
              aria-label={link.name}
              title={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>

        {/* Bottom Metadata & CMS Link */}
        <div className="footer-item flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          <span>© {new Date().getFullYear()} MANUFOLIO. All rights reserved.</span>
          <span className="hidden sm:inline">•</span>
          <Link
            to="/admin"
            className="hover:text-[var(--green)] transition-colors duration-200 underline decoration-dotted"
          >
            CMS Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

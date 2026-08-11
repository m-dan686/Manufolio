import React, { useRef, useEffect, useState } from 'react';
import { 
  IoHomeOutline, 
  IoPersonOutline, 
  IoBriefcaseOutline, 
  IoDownloadOutline, 
  IoRibbonOutline, 
  IoMailOutline 
} from 'react-icons/io5';
import gsap from 'gsap';
import { scrollToSection } from '../../utils/smoothScroll';

const menuItems = [
  { title: 'Home', path: '#home', icon: <IoHomeOutline /> },
  { title: 'About', path: '#about', icon: <IoPersonOutline /> },
  { title: 'Work', path: '#projects', icon: <IoBriefcaseOutline /> },
  { title: 'Files', path: '#downloads', icon: <IoDownloadOutline /> },
  { title: 'Certs', path: '#certifications', icon: <IoRibbonOutline /> },
  { title: 'Inbox', path: '#contact', icon: <IoMailOutline /> }
];

export default function GradientMenu() {
  const [activeItem, setActiveItem] = useState('#home');
  const itemsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['#home', '#about', '#projects', '#downloads', '#certifications', '#contact'];
      const scrollPos = window.scrollY + 200;

      for (let id of sectionIds) {
        const cleanId = id.replace('#', '');
        const el = document.getElementById(cleanId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveItem(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (index) => {
    const el = itemsRef.current[index];
    if (el) {
      gsap.to(el, {
        scale: 1.08,
        y: -3,
        borderColor: '#FF7A00',
        duration: 0.3,
        ease: "power3.out"
      });
    }
  };

  const handleMouseLeave = (index) => {
    const el = itemsRef.current[index];
    if (el) {
      gsap.to(el, {
        scale: 1,
        y: 0,
        borderColor: 'rgba(31, 157, 85, 0.4)',
        duration: 0.3,
        ease: "power3.out"
      });
    }
  };

  return (
    <ul className="flex gap-3 sm:gap-4 flex-wrap justify-center py-1">
      {menuItems.map(({ title, path, icon }, idx) => {
        const isActive = activeItem === path;
        return (
          <li
            key={idx}
            ref={(el) => (itemsRef.current[idx] = el)}
            className={`relative w-[46px] h-[46px] rounded-full flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer select-none border-2 ${
              isActive ? 'border-[var(--green)] bg-[var(--card-bg)] shadow-md' : 'border-[rgba(31,157,85,0.4)] bg-[var(--card-bg)]'
            }`}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={() => handleMouseLeave(idx)}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(path);
            }}
            title={title}
          >
            {/* Icon */}
            <span className={`text-xl transition-colors duration-200 ${isActive ? 'text-[var(--green)]' : 'text-[var(--text-primary)]'}`}>
              {icon}
            </span>

            {/* Active Indicator Dot */}
            {isActive && (
              <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-[var(--orange)] shadow-sm animate-pulse" />
            )}
          </li>
        );
      })}
    </ul>
  );
}

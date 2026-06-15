import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ================= JOURNEY (UNCHANGED) ================= */

      // 1. Text Entrance
      gsap.from(".about-header", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1
      });

      // 2. Timeline Line Drawing
      gsap.from(".timeline-line", {
        height: 0,
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1
        }
      });

      // 3. Timeline Items Pop-in
      gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
          x: i % 2 === 0 ? -50 : 50,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });
      });

      /* ================= TECH ARSENAL (UNCHANGED) ================= */

      // 4. Skills Stagger
      gsap.from(".skill-bar", {
        width: 0,
        duration: 1.5,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".skills-container",
          start: "top 80%"
        }
      });

      /* ================= NEW SECTIONS ================= */

      // Vision (Keep Vision separate as it wasn't in the update list, but decouple custom goal animation)
      gsap.from(".vision-card", {
        y: 25,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".vision-section",
          start: "top 85%"
        }
      });

      /* ================= ENHANCED ANIMATIONS ================= */

      /* FUN FACTS – Flip + Float */
      gsap.from(".fun-fact-card", {
        rotateX: -80,
        opacity: 0,
        y: 40,
        transformOrigin: "top center",
        stagger: 0.12,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".fun-facts-section",
          start: "top 85%",
        },
      });

      // subtle floating loop
      gsap.utils.toArray(".fun-fact-card").forEach((card, i) => {
        gsap.to(card, {
          y: -6,
          duration: 2 + i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      /* ================= MOTION PREMIUM UPGRADE ================= */
      
      // 1. Text Entry Animation
      gsap.from(".section-title", {
        scrollTrigger: {
          trigger: ".section-title",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2
      });

      // 2. Cards Stagger Entry
      ScrollTrigger.batch(".motion-card", {
        start: "top 85%",
        onEnter: batch =>
          gsap.fromTo(
            batch,
            {
              y: 60,
              opacity: 0,
              scale: 0.95
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              stagger: 0.15,
              duration: 0.8,
              ease: "power3.out"
            }
          )
      });

      // 3. Subtle Float (Background Life)
      gsap.to(".motion-card", {
        y: "+=6",
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.2
      });

      // 4. Hover Interactions (Premium Feel)
      gsap.utils.toArray(".motion-card").forEach(card => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -10,
            scale: 1.03,
            boxShadow: `
              0 20px 40px rgba(34,197,94,0.25),
              0 0 20px rgba(249,115,22,0.25)
            `,
            duration: 0.3,
            ease: "power3.out"
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: "0 0 0 rgba(0,0,0,0)",
            backgroundImage: "none",
            duration: 0.3
          });
        });

        // 5. Cursor-follow glow inside card
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          gsap.to(card, {
            backgroundImage: `radial-gradient(circle at ${x}px ${y}px, rgba(34,197,94,0.12), transparent 60%)`,
            duration: 0.2
          });
        });
      });

      // Enhanced Hover/Touch Logic for Fun Fact Cards
      gsap.utils.toArray(".fun-fact-card").forEach(card => {
        const hoverIn = () => {
          card.classList.add("active");

          gsap.to(card, {
            y: -12,
            scale: 1.04,
            boxShadow: "0 20px 40px rgba(34,197,94,0.25), 0 0 20px rgba(249,115,22,0.25)",
            duration: 0.3,
            ease: "power3.out"
          });
        };

        const hoverOut = () => {
          card.classList.remove("active");

          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: "0 0 0 rgba(0,0,0,0)",
            duration: 0.3,
            ease: "power3.out"
          });
        };

        // Desktop hover
        card.addEventListener("mouseenter", hoverIn);
        card.addEventListener("mouseleave", hoverOut);

        // Mobile touch support
        card.addEventListener("touchstart", hoverIn);
        card.addEventListener("touchend", hoverOut);

        // Cursor-follow glow
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          gsap.to(card, {
            background: `radial-gradient(circle at ${x}px ${y}px, rgba(34,197,94,0.15), transparent 60%)`,
            duration: 0.2
          });
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const timelineData = [
    {
      year: '2024 – Present',
      role: 'B.Tech – Information Technology',
      desc: 'Sri Krishna College of Technology | CGPA: 8.7',
      side: 'left'
    },
    {
      year: '2022 – 2024',
      role: 'Higher Secondary',
      desc: 'Carmel Garden MHSS | 12th: 86%, 11th: 89%',
      side: 'right'
    },
    {
      year: '2010 – 2022',
      role: 'Schooling',
      desc: 'Carmel Garden MHSS | 10th: 91%',
      side: 'left'
    }
  ];

  const skills = [
    { n: 'React / Frontend Development', v: '90%' },
    { n: 'JavaScript / Web Apps', v: '90%' },
    { n: 'Python / Machine Learning', v: '85%' },
    { n: 'Artificial Intelligence', v: '80%' },
    { n: 'Data Science & Analytics', v: '80%' },
    { n: 'Node.js / Express', v: '80%' },
    { n: 'MySQL / MongoDB', v: '80%' },
    { n: 'UI/UX + GSAP Animations', v: '85%' }
  ];

  return (
    <div ref={containerRef} className="container mx-auto px-6 py-12 min-h-screen">

      {/* JOURNEY */}
      <div className="text-center mb-20 max-w-4xl mx-auto">
        <h1 className="about-header text-5xl font-bold mb-6 text-text-primary">
          My <span className="text-orange">Journey</span>
        </h1>
        <p className="about-header text-lg opacity-70 leading-relaxed text-text-primary">
          More than just code, it's about the evolution of problem-solving.
          Here is how I paved my path in the world of technology.
        </p>
      </div>

      {/* TIMELINE */}
      <div className="timeline-container relative max-w-4xl mx-auto mb-24">
        <div className="timeline-line absolute left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-orange to-green h-full rounded-full opacity-30" />
        <div className="space-y-12">
          {timelineData.map((item, idx) => (
            <div
              key={idx}
              className={`timeline-item flex ${item.side === 'left' ? 'flex-row' : 'flex-row-reverse'} items-center justify-between`}
            >
              <div className={`w-[45%] ${item.side === 'left' ? 'text-right pr-8' : 'text-left pl-8'}`}>
                <h3 className="text-2xl font-bold text-text-primary">{item.role}</h3>
                <p className="text-orange font-mono text-sm mb-2">{item.year}</p>
                <p className="opacity-60 text-sm text-text-primary">{item.desc}</p>
              </div>
              <div className="z-10 w-4 h-4 bg-bg-light border-4 border-green rounded-full shadow-[0_0_10px_var(--green)]" />
              <div className="w-[45%]" />
            </div>
          ))}
        </div>
      </div>

      {/* SKILLS & SUPERPOWERS */}
      <div className="grid md:grid-cols-2 gap-16 skills-container mb-24">

        {/* TECH ARSENAL */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-text-primary">
            Technical <span className="text-green">Arsenal</span>
          </h2>

          <div className="space-y-6">
            {skills.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2 text-sm font-bold text-text-primary">
                  <span>{s.n}</span>
                  <span>{s.v}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="skill-bar h-full bg-gradient-to-r from-orange to-green"
                    style={{ width: s.v }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUPERPOWERS */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-text-primary">
            My <span className="text-orange">Superpowers</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              'Creative Thinker',
              'Rapid Learner',
              'Detail Oriented',
              'Team Catalyst',
              'Leadership Potential',
              'Adaptable Problem Solver',
              'Hard + Smart Worker'
            ].map((p, i) => (
              <div key={i} className="hover-card p-6 bg-white/5 border border-orange/20 rounded-xl text-center">
                <span className="font-bold text-text-primary">{p}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FUN FACTS */}
      <div className="fun-facts-section max-w-4xl mx-auto mb-24">
        <h2 className="text-3xl font-bold mb-8 text-text-primary">
          Fun <span className="text-orange">Facts</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Favorite Stack: React + Spring Boot",
            "Favorite Field: AI & Machine Learning",
            "Enjoy building animated UI",
            "Love solving real-world problems",
            "Energy fuel: Sweets ",
            "Hackathon enthusiast"
          ].map((fact, i) => (
            <div key={i} className="fun-fact-card hover-card p-5 bg-white/5 rounded-lg text-center">
              {fact}
            </div>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div className="achievements-section max-w-4xl mx-auto mb-24">
        <h2 className="section-title text-3xl font-bold mb-8 text-text-primary">
          Key <span className="text-green">Achievements</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            "Department 3rd Rank (2nd & 3rd Semester)",
            "Class Representative (2 Years)",
            "Top 50 Team – Smart India Hackathon",
            "VelIdeaforge 2K26 Shortlisted (52/90 teams)",
            "Participated – Kreative Genesis Hackathon",
            "Participated – PSG Tech Kriya Ideathon"
          ].map((a, i) => (
            <div key={i} className="achievement-card motion-card p-6 bg-white/5 backdrop-blur-md rounded-xl flex items-center shadow-lg">
              {a}
            </div>
          ))}
        </div>
      </div>

      {/* VISION */}
      <div className="vision-section max-w-4xl mx-auto mb-24">
        <h2 className="section-title text-3xl font-bold mb-8 text-text-primary">
          My <span className="text-green">Vision</span>
        </h2>
        <div className="vision-card motion-card p-6 bg-white/5 backdrop-blur-md rounded-xl text-text-primary opacity-90 shadow-lg">
          My aim is to become an AI-driven full-stack developer who builds intelligent, scalable systems that combine machine learning with real-world applications. My focus is on creating solutions that are not only technically powerful but also intuitive and user-centric.
        </div>
      </div>

      {/* FUTURE GOALS */}
      <div className="vision-section max-w-4xl mx-auto">
        <h2 className="section-title text-3xl font-bold mb-8 text-text-primary">
          Future <span className="text-orange">Goals</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            "Master AI + scalable backend architectures",
            "Build production-grade ML-powered applications",
            "Contribute to open-source AI tools",
            "Grow into a technical leader and mentor"
          ].map((goal, i) => (
            <div key={i} className="goal-card motion-card p-6 bg-white/5 backdrop-blur-md rounded-xl flex items-center shadow-lg">
              {goal}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default About;

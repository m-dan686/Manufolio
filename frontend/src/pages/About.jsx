import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IconCloud } from '../components/ui/interactive-icon-cloud';
import { Skiper31 } from '../components/ui/text-scroll-animation';
import { BorderTrail } from '../components/ui/border-trail';
import TextReveal from '../components/animations/TextReveal';

gsap.registerPlugin(ScrollTrigger);

const educationData = [
  {
    num: '01',
    period: '2024 – PRESENT',
    degree: 'B.Tech — Information Technology',
    institution: 'Sri Krishna College of Technology, Coimbatore, India',
    metrics: 'CGPA: 8.70 / 10.00 (Current through 4th Semester)',
    highlight: 'Department 3rd Rank in 2nd & 3rd Semesters'
  },
  {
    num: '02',
    period: 'SCHOOLING',
    degree: 'Higher Secondary Schooling',
    institution: 'Carmel Garden Matriculation Higher Secondary School, Coimbatore, India',
    metrics: 'Class 12: 86%  |  Class 10: 91%',
    highlight: 'Strong STEM Foundation'
  }
];

const skillCategories = [
  {
    category: 'Programming Languages',
    skills: ['Python', 'Java', 'C++']
  },
  {
    category: 'Web Development',
    skills: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Node.js', 'Express']
  },
  {
    category: 'AI / Machine Learning / Data Science',
    skills: ['Artificial Intelligence', 'Machine Learning', 'Data Science']
  },
  {
    category: 'Database',
    skills: ['MySQL']
  },
  {
    category: 'Tools',
    skills: ['Git', 'GitHub']
  },
  {
    category: 'Soft Skills',
    skills: ['Problem Solving', 'Analytical Thinking', 'Effective Communication', 'Team Collaboration', 'Presentation Skills']
  }
];

const technologySlugs = [
  "python", "java", "cplusplus", "javascript", "react",
  "html5", "css3", "tailwindcss", "nodedotjs", "express",
  "mysql", "git", "github", "vite"
];

const achievementsData = [
  { title: "Academic Excellence", detail: "Secured 3rd Rank in the Department during 2nd & 3rd semesters.", badge: "Academic" },
  { title: "Leadership Impact", detail: "Served as Class Representative for 2 years at SKCT.", badge: "Leadership" },
  { title: "Technical Participation", detail: "Participated in multiple technical events, ideathons, & paper presentations.", badge: "Participation" }
];

const leadershipData = [
  {
    role: "Class Representative",
    organization: "Sri Krishna College of Technology",
    period: "2 Years",
    points: [
      "Facilitated communication between students and faculty.",
      "Supported coordination of academic and class-related activities."
    ]
  },
  {
    role: "IGNITE Tech Community — Secretary",
    organization: "Sri Krishna College of Technology",
    period: "Active",
    points: [
      "Coordinate and organize technical events, meetings, and activities.",
      "Maintain proper communication and documentation within the community.",
      "Coordinate team members and follow up on tasks to ensure on-time execution."
    ]
  }
];

const participationsData = [
  {
    event: "KRIYA Ideathon 2026",
    institution: "PSG College of Technology",
    org: "Students Union 2025–2026",
    role: "Participant",
    date: "March 13–15, 2026"
  },
  {
    event: "Paper Presentation — Digital Innovators",
    institution: "Sri Ramakrishna Engineering College",
    org: "SREC Utsava'26",
    role: "Participant",
    date: "January 30–31, 2026"
  },
  {
    event: "VEL IDEAFORGE 2K26",
    institution: "Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology",
    org: "National Level 24 Hours Hackathon",
    role: "Participant",
    date: "February 19–20, 2026"
  }
];

const About = () => {
  const containerRef = useRef(null);
  const [activeTech, setActiveTech] = useState("Python / AI Ecosystem");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      /* ═══ TIMELINE LINE DRAW ═══ */
      if (!prefersReducedMotion) {
        gsap.fromTo(".journey-line", {
          scaleY: 0,
          transformOrigin: "top"
        }, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".journey-section",
            start: "top 75%",
            end: "bottom 75%",
            scrub: 1,
          },
        });

        /* ═══ EXTENDED SIDE PARTICLE FIELD ═══ */
        gsap.fromTo(".side-particle-field", {
          opacity: 0.1,
          y: -40
        }, {
          opacity: 0.4,
          y: 40,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-main-container",
            start: "top 70%",
            end: ".skills-section",
            scrub: 1.5,
          }
        });
      }

      /* ═══ SKILL CARDS STAGGER ENTRANCE ═══ */
      gsap.utils.toArray('.skill-cat-card').forEach((card, idx) => {
        gsap.fromTo(card,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            delay: idx * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      /* ═══ EXTENDED ICON PANEL ENTRANCE ═══ */
      gsap.fromTo(".extended-icon-panel",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".skills-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      /* ═══ TIMELINE ITEMS STAGGER ═══ */
      gsap.utils.toArray('.timeline-item').forEach((item) => {
        gsap.fromTo(item,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse"
            },
          }
        );
      });

      /* ═══ ACHIEVEMENTS STAGGER ═══ */
      gsap.fromTo(".achievement-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".achievements-section",
            start: "top 82%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={containerRef} className="py-20 relative z-[1] about-main-container overflow-hidden">
      {/* Extended Side Particle Field spanning through Soft Skills */}
      <div className="side-particle-field absolute right-0 top-0 bottom-10 w-80 pointer-events-none opacity-25 z-0" aria-hidden="true">
        <div className="w-full h-full bg-gradient-to-b from-[rgba(31,157,85,0.15)] via-[rgba(255,122,0,0.12)] to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* ═══════════════════════════════
            SECTION HEADER
        ═══════════════════════════════ */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--green-soft)', color: 'var(--green)', border: '1px solid rgba(var(--green-rgb), 0.2)' }}>
              02 / ABOUT
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">ENGINEERING IDENTITY</span>
          </div>
          <TextReveal text="Manu Anandan G" as="h2" className="text-4xl md:text-5xl font-extrabold" style={{ color: 'var(--text-primary)' }} />
        </div>

        {/* ═══════════════════════════════
            CAREER OBJECTIVE
        ═══════════════════════════════ */}
        <div className="mb-24 p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-xl"
             style={{ backgroundColor: 'var(--card-bg)', border: '2px solid var(--green)' }}>
          <BorderTrail color="var(--orange)" duration={6} />
          
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--green)' }} />
            <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: 'var(--green)' }}>
              CAREER OBJECTIVE
            </span>
          </div>

          <Skiper31
            text="Motivated B.Tech Information Technology student with a strong foundation in Python, Java, C++, web development, Artificial Intelligence, Machine Learning, and Data Science. Experience developing academic and application-oriented projects involving React, Node.js, Express, and MySQL. Seeking opportunities to apply technical, problem-solving, and collaborative skills in software development, AI/ML, and emerging technologies while continuously learning and contributing to impactful solutions."
            className="text-base md:text-lg leading-relaxed font-medium"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {/* ═══════════════════════════════
            EDUCATION TIMELINE
        ═══════════════════════════════ */}
        <div className="journey-section mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--orange-soft)', color: 'var(--orange)', border: '1px solid rgba(var(--orange-rgb), 0.2)' }}>
              ACADEMIC TIMELINE
            </span>
            <TextReveal text="Education" as="h2" className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }} />
          </div>

          <div className="relative pl-6 sm:pl-10">
            <div className="journey-line absolute left-2.5 sm:left-4 top-2 bottom-2 w-0.5 rounded-full"
                 style={{ background: 'linear-gradient(to bottom, var(--green), var(--orange))', opacity: 0.4 }} />

            <div className="space-y-8">
              {educationData.map((edu) => (
                <div key={edu.num} className="timeline-item relative p-6 md:p-8 rounded-2xl shadow-md transition-all duration-300 hover:translate-x-2"
                     style={{ backgroundColor: 'var(--card-bg)', border: '1.5px solid var(--card-border)' }}>
                  
                  <div className="absolute -left-[31px] sm:-left-[39px] top-8 w-5 h-5 rounded-full shadow-sm flex items-center justify-center"
                       style={{ backgroundColor: 'var(--green)', border: '3px solid var(--bg-primary)' }} />

                  <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded"
                          style={{ backgroundColor: 'rgba(var(--green-rgb), 0.12)', color: 'var(--green)' }}>
                      {edu.period}
                    </span>
                    <span className="text-xs font-mono font-bold" style={{ color: 'var(--orange)' }}>
                      INDEX / {edu.num}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {edu.degree}
                  </h3>

                  <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {edu.institution}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold pt-2 border-t" style={{ borderColor: 'var(--border-neutral)' }}>
                    <span className="px-3 py-1 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--orange)' }}>
                      {edu.metrics}
                    </span>
                    <span className="text-[var(--text-muted)]">• {edu.highlight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════
            TECHNICAL ARSENAL & EXTENDED ICON PANEL
        ═══════════════════════════════ */}
        <div className="skills-section mb-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ backgroundColor: 'var(--green-soft)', color: 'var(--green)', border: '1px solid rgba(var(--green-rgb), 0.2)' }}>
                TECHNICAL ARSENAL
              </span>
              <TextReveal text="Skills & Expertise" as="h2" className="text-3xl md:text-4xl font-extrabold mt-2" style={{ color: 'var(--text-primary)' }} />
            </div>
            <p className="text-xs font-mono text-[var(--text-muted)] max-w-xs">
              Categorized core competencies with interactive extended 3D technology matrix.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: All 6 Categorized Skill Blocks */}
            <div className="lg:col-span-7 space-y-6">
              {skillCategories.map((cat, idx) => {
                const isSoftSkills = cat.category === 'Soft Skills';
                return (
                  <div key={idx} className={`skill-cat-card p-6 rounded-2xl shadow-md transition-all duration-300 hover:border-[var(--green)] hover:-translate-y-1 ${isSoftSkills ? 'soft-skills-container' : ''}`}
                       style={{ backgroundColor: 'var(--card-bg)', border: '1.5px solid var(--card-border)' }}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--orange)' }}>
                        // {cat.category}
                      </h4>
                      <span className="text-[0.65rem] font-mono text-[var(--text-muted)]">
                        {String(idx + 1).padStart(2, '0')} / 06
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {cat.skills.map((s, i) => (
                        <span key={i}
                              onMouseEnter={() => setActiveTech(s)}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105 hover:border-[var(--orange)]"
                              style={{ backgroundColor: 'rgba(var(--green-rgb), 0.10)', color: 'var(--green)', border: '1px solid rgba(var(--green-rgb), 0.22)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: EXTENDED TECHNICAL ARSENAL INTERACTIVE ICON PANEL */}
            <div className="lg:col-span-5">
              <div className="extended-icon-panel sticky top-24 h-full min-h-[580px] p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden border-2"
                   style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--green)' }}>
                <BorderTrail color="var(--orange)" duration={7} />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: 'var(--orange)' }}>
                      INTERACTIVE ICON MATRIX
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--green)] animate-pulse" />
                  </div>
                  
                  <p className="text-xs leading-relaxed font-mono mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Active focus: <span className="font-bold text-[var(--green)]">{activeTech}</span>
                  </p>
                </div>

                {/* 3D Floating Icon Sphere */}
                <div className="w-full flex justify-center items-center h-[340px] my-auto">
                  <IconCloud iconSlugs={technologySlugs} />
                </div>

                {/* Footer Signal Badge */}
                <div className="pt-4 border-t flex items-center justify-between text-[0.65rem] font-mono" style={{ borderColor: 'var(--border-neutral)', color: 'var(--text-muted)' }}>
                  <span>SIGNAL WORKSHOP 2026</span>
                  <span className="text-[var(--green)]">FULL STACK & AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════
            KEY ACHIEVEMENTS
        ═══════════════════════════════ */}
        <div className="achievements-section mb-24 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--orange-soft)', color: 'var(--orange)', border: '1px solid rgba(var(--orange-rgb), 0.2)' }}>
              HONORS & MERIT
            </span>
            <TextReveal text="Key Achievements" as="h2" className="text-3xl md:text-4xl font-extrabold mt-2 justify-center" style={{ color: 'var(--text-primary)' }} />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {achievementsData.map((item, i) => (
              <div key={i} className="achievement-card p-6 rounded-2xl relative overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1.5 cursor-default"
                   style={{ backgroundColor: 'var(--card-bg)', border: '1.5px solid var(--card-border)' }}>
                <BorderTrail color={i % 2 === 0 ? "var(--green)" : "var(--orange)"} duration={5} />
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[0.7rem] font-mono font-bold uppercase px-2.5 py-1 rounded"
                        style={{ backgroundColor: i % 2 === 0 ? 'var(--green-soft)' : 'var(--orange-soft)', color: i % 2 === 0 ? 'var(--green)' : 'var(--orange)' }}>
                    {item.badge}
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">0{i+1}</span>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════
            LEADERSHIP & RESPONSIBILITIES
        ═══════════════════════════════ */}
        <div className="leadership-section mb-24 max-w-4xl mx-auto">
          <div className="mb-10">
            <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--green-soft)', color: 'var(--green)', border: '1px solid rgba(var(--green-rgb), 0.2)' }}>
              ORGANIZATIONAL ROLES
            </span>
            <TextReveal text="Leadership & Responsibilities" as="h2" className="text-3xl md:text-4xl font-extrabold mt-2" style={{ color: 'var(--text-primary)' }} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {leadershipData.map((lead, idx) => (
              <div key={idx} className="leadership-card p-6 md:p-8 rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1"
                   style={{ backgroundColor: 'var(--card-bg)', border: '1.5px solid var(--card-border)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--orange)' }}>
                    {lead.period}
                  </span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--green)' }} />
                </div>
                <h3 className="text-xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {lead.role}
                </h3>
                <p className="text-xs font-mono font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>
                  {lead.organization}
                </p>
                <ul className="space-y-2 pl-4 list-disc text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {lead.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════
            PARTICIPATIONS & HACKATHONS
        ═══════════════════════════════ */}
        <div className="participations-section max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--orange-soft)', color: 'var(--orange)', border: '1px solid rgba(var(--orange-rgb), 0.2)' }}>
              EVENT ARCHIVE
            </span>
            <TextReveal text="Participations & Hackathons" as="h2" className="text-3xl md:text-4xl font-extrabold mt-2 justify-center" style={{ color: 'var(--text-primary)' }} />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {participationsData.map((event, idx) => (
              <div key={idx} className="participation-card p-6 rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1.5"
                   style={{ backgroundColor: 'var(--card-bg)', border: '1.5px solid var(--card-border)' }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[0.7rem] font-mono font-extrabold uppercase px-2.5 py-1 rounded"
                        style={{ backgroundColor: 'var(--green-soft)', color: 'var(--green)', border: '1px solid rgba(var(--green-rgb), 0.2)' }}>
                    {event.role}
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">{event.date}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                  {event.event}
                </h3>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--orange)' }}>
                  {event.institution}
                </p>
                <p className="text-[0.7rem] font-mono" style={{ color: 'var(--text-muted)' }}>
                  {event.org}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;

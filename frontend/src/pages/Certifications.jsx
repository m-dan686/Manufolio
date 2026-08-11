import React, { useState, useEffect, useRef } from "react";
import { certificatesData } from "../data/certificatesData";
import CertificateModal from "../components/modals/CertificateModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BorderTrail } from "../components/ui/border-trail";
import TextReveal from "../components/animations/TextReveal";

gsap.registerPlugin(ScrollTrigger);

const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stage = sectionRef.current;

    const ctx = gsap.context(() => {
      /* ═══ SCROLLTRIGGER BATCH ENTRANCE ═══ */
      ScrollTrigger.batch(".certification-card", {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(batch,
            { opacity: 0, y: 50, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.08, ease: "power3.out", overwrite: true }
          );
        },
      });

      /* ═══ CURSOR PROXIMITY CARD SCALING ═══ */
      if (!prefersReducedMotion && stage) {
        const cards = gsap.utils.toArray(".certification-card");
        const radius = 220;
        const maxScale = 1.08;
        const duration = 0.35;

        const handleMouseMove = (event) => {
          const mouseX = event.clientX;
          const mouseY = event.clientY;

          cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            const distance = Math.hypot(mouseX - cardCenterX, mouseY - cardCenterY);

            const proximity = gsap.utils.clamp(
              0,
              1,
              gsap.utils.mapRange(0, radius, 1, 0, distance)
            );

            gsap.to(card, {
              scale: 1 + (maxScale - 1) * proximity,
              overwrite: true,
              duration: duration,
              ease: "power2.out"
            });
          });
        };

        const handleMouseLeave = () => {
          cards.forEach((card) => {
            gsap.to(card, {
              scale: 1,
              duration: duration * 2,
              overwrite: true,
              ease: "power2.out"
            });
          });
        };

        stage.addEventListener("mousemove", handleMouseMove);
        stage.addEventListener("mouseleave", handleMouseLeave);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="certifications" ref={sectionRef} className="py-20 relative z-[1]">
      <div className="container mx-auto px-6">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--green-soft)', color: 'var(--green)', border: '1px solid rgba(var(--green-rgb), 0.2)' }}>
              05 / CERTIFICATIONS
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">VERIFIED CREDENTIALS</span>
          </div>
          <TextReveal text="Professional Certifications" as="h2" className="text-4xl md:text-5xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }} />
          <TextReveal text="Verified course completions across Algorithms, Python, AI, Java, C++, Systems, & Soft Skills." as="p" className="text-sm max-w-xl" style={{ color: 'var(--text-secondary)' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificatesData.map((cert, index) => (
            <div
              key={cert.id}
              className="certification-card relative cursor-pointer rounded-2xl overflow-hidden group transition-all duration-300 shadow-md bg-[var(--card-bg)] border-2 border-[var(--border-neutral)] hover:border-[var(--orange)] flex flex-col justify-between"
              onClick={() => setSelectedCert(cert)}
            >
              {index < 3 && <BorderTrail color="var(--orange)" duration={5} />}

              <div className="overflow-hidden aspect-video w-full relative">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded text-[0.65rem] font-mono font-bold bg-black/60 backdrop-blur-sm text-white border border-white/10">
                  CREDENTIAL #{String(index + 1).padStart(2, '0')}
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow">
                <h3 className="font-bold text-base line-clamp-2 mb-3" style={{ color: 'var(--text-primary)' }}>
                  {cert.title}
                </h3>
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-neutral)' }}>
                  <span className="text-xs font-mono font-bold uppercase" style={{ color: 'var(--orange)' }}>
                    Inspect Certificate →
                  </span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--green)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <CertificateModal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          pdf={selectedCert?.pdf}
          title={selectedCert?.title}
        />
      </div>
    </section>
  );
};

export default Certifications;

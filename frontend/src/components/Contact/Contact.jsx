import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { submitContact } from "../../api/services/contactService";
import { BorderTrail } from "../ui/border-trail";
import "./contact.css";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

function validate(formData) {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required.";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(formData.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (formData.phone.trim() && !PHONE_REGEX.test(formData.phone.trim())) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  if (!formData.message.trim()) {
    errors.message = "Message is required.";
  } else if (formData.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }

  return errors;
}

export default function Contact() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const submitBtnRef = useRef(null);

  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    if (touched[e.target.name]) {
      const fieldErrors = validate(updated);
      setErrors(prev => ({ ...prev, [e.target.name]: fieldErrors[e.target.name] }));
    }
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
    const fieldErrors = validate(formData);
    setErrors(prev => ({ ...prev, [e.target.name]: fieldErrors[e.target.name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError('');

    setTouched({ name: true, email: true, phone: true, message: true });
    const allErrors = validate(formData);
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      if (rightRef.current) {
        gsap.fromTo(
          rightRef.current,
          { x: -10 },
          { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" }
        );
      }
      return;
    }

    setIsSubmitting(true);

    /* ═══ GSAP BUTTON ANIMATION ═══ */
    const btnTimeline = gsap.timeline();
    if (submitBtnRef.current) {
      btnTimeline
        .to(submitBtnRef.current, {
          duration: 0.4,
          text: { value: "Sending...", type: "diff" },
          ease: "sine.in"
        })
        .to(submitBtnRef.current, {
          duration: 0.4,
          text: { value: "Sending", type: "diff" },
          ease: "sine.inOut",
          repeat: 2,
          yoyo: true
        });
    }

    try {
      await submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      });

      if (submitBtnRef.current) {
        gsap.to(submitBtnRef.current, {
          duration: 0.4,
          text: { value: "Sent!", type: "diff" },
          ease: "power2.out",
          onComplete: () => {
            setTimeout(() => {
              setSent(true);
              setFormData({ name: '', email: '', phone: '', message: '' });
              setErrors({});
              setTouched({});
            }, 500);
          }
        });
      } else {
        setSent(true);
      }
    } catch (error) {
      console.error("Contact submission error:", error);
      btnTimeline.kill();
      if (submitBtnRef.current) {
        gsap.to(submitBtnRef.current, { text: "Send Message", duration: 0.3 });
      }

      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        setSubmitError(`Submission error: ${serverMessage}`);
      } else if (error.response?.status === 429) {
        setSubmitError("Too many requests. Please try again later.");
      } else {
        setSubmitError("Message could not be sent to the backend. Please check connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-section",
            start: "top 82%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(
        rightRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-section",
            start: "top 82%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="contact-section relative z-[1] py-20">
      <div className="contact-wrapper container mx-auto px-6 grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Contact Info Card */}
        <div ref={leftRef} className="contact-left lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--green-soft)', color: 'var(--green)', border: '1px solid rgba(var(--green-rgb), 0.2)' }}>
              06 / CONTACT
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">COMMUNICATION TERMINAL</span>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Let's <span style={{ color: 'var(--orange)' }}>Collaborate</span>
            </h2>
            <h3 className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
              Get In <span style={{ color: 'var(--green)' }}>Touch</span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Let's build something meaningful together. Reach out for projects, research, or opportunities.
            </p>
          </div>

          {/* Owner Details Card */}
          <div className="info-card p-6 rounded-2xl relative overflow-hidden shadow-lg border-2"
               style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--green)' }}>
            <BorderTrail color="var(--green)" duration={5} />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                      style={{ backgroundColor: 'rgba(var(--green-rgb), 0.12)', color: 'var(--green)' }}>📞</span>
                <div>
                  <small className="block text-[0.65rem] font-mono uppercase text-[var(--text-muted)]">PHONE</small>
                  <a href="tel:9342770249" className="font-mono font-bold text-sm hover:text-[var(--orange)] transition-colors">9342770249</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                      style={{ backgroundColor: 'rgba(var(--green-rgb), 0.12)', color: 'var(--green)' }}>✉️</span>
                <div>
                  <small className="block text-[0.65rem] font-mono uppercase text-[var(--text-muted)]">PORTFOLIO CONTACT EMAIL</small>
                  <a href="mailto:manuanandan686@gmail.com" className="font-mono font-bold text-sm hover:text-[var(--orange)] transition-colors">manuanandan686@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                      style={{ backgroundColor: 'rgba(var(--green-rgb), 0.12)', color: 'var(--green)' }}>📍</span>
                <div>
                  <small className="block text-[0.65rem] font-mono uppercase text-[var(--text-muted)]">LOCATION</small>
                  <span className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Coimbatore, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Visitor Interactive Form Card */}
        <div ref={rightRef} className="contact-right lg:col-span-7 p-8 rounded-3xl relative overflow-hidden shadow-xl border-2"
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <BorderTrail color="var(--orange)" duration={6} />
          
          {!sent ? (
            <form onSubmit={handleSubmit} noValidate className="relative z-10 space-y-5" autoComplete="off">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-mono font-bold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your name"
                  autoComplete="off"
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 outline-none border-2 ${
                    errors.name && touched.name ? "border-red-500 bg-red-500/5" : "border-[var(--border-neutral)] bg-[var(--bg-secondary)] focus:border-[var(--green)]"
                  }`}
                  style={{ color: 'var(--text-primary)' }}
                />
                {errors.name && touched.name && (
                  <span className="text-xs font-mono text-red-500 mt-1 block">⚠ {errors.name}</span>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-mono font-bold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Your Email Address *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="name@example.com"
                  autoComplete="off"
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 outline-none border-2 ${
                    errors.email && touched.email ? "border-red-500 bg-red-500/5" : "border-[var(--border-neutral)] bg-[var(--bg-secondary)] focus:border-[var(--green)]"
                  }`}
                  style={{ color: 'var(--text-primary)' }}
                />
                {errors.email && touched.email && (
                  <span className="text-xs font-mono text-red-500 mt-1 block">⚠ {errors.email}</span>
                )}
              </div>

              <div>
                <label htmlFor="contact-phone" className="block text-xs font-mono font-bold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Phone Number (Optional)
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="10-digit mobile number"
                  autoComplete="off"
                  maxLength={10}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 outline-none border-2 ${
                    errors.phone && touched.phone ? "border-red-500 bg-red-500/5" : "border-[var(--border-neutral)] bg-[var(--bg-secondary)] focus:border-[var(--green)]"
                  }`}
                  style={{ color: 'var(--text-primary)' }}
                />
                {errors.phone && touched.phone && (
                  <span className="text-xs font-mono text-red-500 mt-1 block">⚠ {errors.phone}</span>
                )}
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono font-bold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  style={{ resize: "none", color: 'var(--text-primary)' }}
                  placeholder="Describe your project, inquiry, or idea..."
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 outline-none border-2 ${
                    errors.message && touched.message ? "border-red-500 bg-red-500/5" : "border-[var(--border-neutral)] bg-[var(--bg-secondary)] focus:border-[var(--green)]"
                  }`}
                />
                {errors.message && touched.message && (
                  <span className="text-xs font-mono text-red-500 mt-1 block">⚠ {errors.message}</span>
                )}
              </div>

              {submitError && (
                <div className="p-3.5 rounded-xl text-xs font-mono text-red-500 bg-red-500/10 border border-red-500/30">
                  ⚠ {submitError}
                </div>
              )}

              <button
                ref={submitBtnRef}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl text-sm font-mono font-bold text-white transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl border-none disabled:opacity-50"
                style={{ backgroundColor: 'var(--green)' }}
              >
                Send Message
              </button>
            </form>
          ) : (
            <div className="success relative z-10 p-8 text-center animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-[var(--green-soft)] border border-[var(--green)] text-[var(--green)] flex items-center justify-center text-3xl mx-auto mb-4">
                ✓
              </div>
              <h4 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent Successfully!</h4>
              <p className="text-xs leading-relaxed max-w-sm mx-auto mb-6" style={{ color: 'var(--text-secondary)' }}>
                Thank you for reaching out. Your message has been received by Manu Anandan G. You will receive a response shortly.
              </p>
              <button
                className="px-6 py-3 rounded-xl text-xs font-mono font-bold text-white bg-[var(--green)] hover:bg-[var(--orange)] transition-colors duration-200 border-none cursor-pointer"
                onClick={() => {
                  setSent(false);
                  setTouched({});
                  setErrors({});
                }}
              >
                ✉ Send Another Message
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

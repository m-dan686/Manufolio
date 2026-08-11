import React, { useEffect, useRef, useState } from "react";
import { FiDownload, FiFileText, FiLock, FiX, FiCheckCircle } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "../components/animations/TextReveal";
import { BorderTrail } from "../components/ui/border-trail";

gsap.registerPlugin(ScrollTrigger);

const downloadableFiles = [
  { name: "resume.pdf", path: import.meta.env.BASE_URL + "files/Manu Anandan G - Resume.pdf", label: "Professional Resume", protected: false },
  { name: "10th-marksheet.pdf", path: import.meta.env.BASE_URL + "files/academics/school/10th-marksheet.pdf", label: "10th Marksheet", protected: true },
  { name: "11th-marksheet.pdf", path: import.meta.env.BASE_URL + "files/academics/school/11th-marksheet.pdf", label: "11th Marksheet", protected: true },
  { name: "12th-marksheet.pdf", path: import.meta.env.BASE_URL + "files/academics/school/12th-marksheet.pdf", label: "12th Marksheet", protected: true },
  { name: "sem1-marksheet.pdf", path: import.meta.env.BASE_URL + "files/academics/college/sem1-marksheet.pdf", label: "Sem 1 Marksheet", protected: true },
  { name: "sem2-marksheet.pdf", path: import.meta.env.BASE_URL + "files/academics/college/sem2-marksheet.pdf", label: "Sem 2 Marksheet", protected: true },
  { name: "sem3-marksheet.pdf", path: import.meta.env.BASE_URL + "files/academics/college/sem3-marksheet.pdf", label: "Sem 3 Marksheet", protected: true },
  { name: "sem4-marksheet.pdf", path: import.meta.env.BASE_URL + "files/academics/college/sem4-marksheet.pdf", label: "Sem 4 Marksheet", protected: true }
];

const Downloads = () => {
  const sectionRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(".vault-card", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(batch,
            { y: 40, opacity: 0, scale: 0.96 },
            { y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.08, ease: "power3.out", overwrite: true }
          );
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, { opacity: 0, y: 30, duration: 0.35, overwrite: true });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleDownloadClick = (file) => {
    if (!file.protected) {
      triggerDownload(file);
    } else {
      setSelectedFile(file);
      setPasswordInput("");
      setErrorMsg("");
    }
  };

  const triggerDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.path;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const expectedPassword = `${selectedFile.name}@manu123`;
    if (passwordInput.trim() === expectedPassword) {
      triggerDownload(selectedFile);
      setSelectedFile(null);
    } else {
      setErrorMsg(`Invalid password. Format required: ${selectedFile.name}@manu123`);
    }
  };

  return (
    <section id="downloads" ref={sectionRef} className="py-20 relative z-[1]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--green-soft)', color: 'var(--green)', border: '1px solid rgba(var(--green-rgb), 0.2)' }}>
              04 / DOWNLOADS
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">DOCUMENT ARCHIVE</span>
          </div>
          <TextReveal text="Personal & Academic Records" as="h2" className="text-4xl md:text-5xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }} />
          <p className="text-sm max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            Access academic marksheets and professional resume files from the verified repository.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {downloadableFiles.map((file, idx) => (
            <div
              key={file.name}
              className="vault-card relative overflow-hidden p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-md flex flex-col justify-between"
              style={{ backgroundColor: 'var(--card-bg)', border: '1.5px solid var(--card-border)' }}
            >
              {idx === 0 && <BorderTrail color="var(--orange)" duration={5} />}
              
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="p-3 rounded-xl flex items-center justify-center"
                       style={{ backgroundColor: 'rgba(var(--green-rgb), 0.12)' }}>
                    <FiFileText className="text-xl" style={{ color: 'var(--green)' }} />
                  </div>
                  {file.protected ? (
                    <span className="flex items-center gap-1 text-[0.65rem] font-mono font-bold px-2 py-0.5 rounded"
                          style={{ backgroundColor: 'var(--orange-soft)', color: 'var(--orange)' }}>
                      <FiLock className="text-xs" /> PROTECTED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[0.65rem] font-mono font-bold px-2 py-0.5 rounded"
                          style={{ backgroundColor: 'var(--green-soft)', color: 'var(--green)' }}>
                      <FiCheckCircle className="text-xs" /> PUBLIC
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base line-clamp-1 mb-1" style={{ color: 'var(--text-primary)' }}>{file.label}</h3>
                <p className="text-xs font-mono mb-4" style={{ color: 'var(--text-muted)' }}>{file.name}</p>
              </div>

              <button
                onClick={() => handleDownloadClick(file)}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border-none shadow-sm"
                style={{ backgroundColor: file.protected ? 'var(--orange)' : 'var(--green)' }}
              >
                <FiDownload /> {file.protected ? "Verify & Download" : "Download File"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Password Protection Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-6 rounded-2xl shadow-2xl bg-[var(--card-bg)] border-2 border-[var(--orange)]">
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute top-4 right-4 text-xl border-none bg-transparent cursor-pointer text-[var(--text-primary)]"
            >
              <FiX />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[var(--orange-soft)] text-[var(--orange)]">
                <FiLock className="text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Protected Archive File
                </h3>
                <p className="text-xs font-mono" style={{ color: 'var(--orange)' }}>
                  {selectedFile.name}
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Enter security key in format: <code className="text-[var(--orange)] font-mono">{selectedFile.name}@manu123</code>
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full text-sm font-mono"
                  autoFocus
                />
                {errorMsg && (
                  <p className="text-xs font-mono mt-1 text-red-500">{errorMsg}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="w-1/2 py-2.5 rounded-xl font-bold text-xs border border-[var(--border-neutral)] bg-transparent text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl font-bold text-xs text-white bg-[var(--orange)] border-none cursor-pointer"
                >
                  Unlock & Download
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Downloads;

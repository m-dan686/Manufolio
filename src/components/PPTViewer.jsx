import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export default function PPTViewer({ project, onClose }) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Animate modal in
        gsap.fromTo(
            ".ppt-modal",
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }
        );

        // Lock background scroll
        document.body.style.overflow = "hidden";

        // ESC to close
        const escHandler = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", escHandler);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", escHandler);
        };
    }, [onClose]);

    if (!project) return null;

    const isMobile = window.innerWidth < 768;

    return createPortal(
        <div className="ppt-backdrop" onClick={onClose}>
            <div
                className="ppt-modal"
                onClick={(e) => e.stopPropagation()}
                onContextMenu={(e) => e.preventDefault()}
            >
                <button className="ppt-close" onClick={onClose}>
                    ✕
                </button>

                {/* MOBILE FALLBACK */}
                {isMobile ? (
                    <div className="ppt-sim">
                        <h2>{project.title}</h2>
                        <p>
                            PPT preview works best on desktop.
                        </p>
                        <a
                            href={project.pptEmbed.replace("/embed", "/present")}
                            target="_blank"
                            rel="noreferrer"
                            className="view-btn"
                        >
                            Open Presentation →
                        </a>
                    </div>
                ) : (
                    <>
                        {!loaded && (
                            <div className="ppt-loader">
                                <div className="loader-bar" />
                                <div className="loader-bar" />
                                <div className="loader-bar" />
                            </div>
                        )}

                        <iframe
                            src={project.pptEmbed}
                            title={project.title}
                            frameBorder="0"
                            allowFullScreen
                            onLoad={() => setLoaded(true)}
                            style={{ opacity: loaded ? 1 : 0 }}
                        />
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}

import { useState } from "react";
import { projectsData } from "../data/projectsData";
import ProjectCard from "../components/ProjectCard";
import ProjectCarousel from "../components/ProjectCarousel";
import PPTViewer from "../components/PPTViewer";
import { ImageComparison } from "../components/ui/image-comparison";
import TextReveal from "../components/animations/TextReveal";
import "../styles/projects.css";

export default function Projects() {
  const [active, setActive] = useState(null);

  return (
    <section id="projects" className="py-20 relative z-[1]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--green-soft)', color: 'var(--green)', border: '1px solid rgba(var(--green-rgb), 0.2)' }}>
              03 / PROJECTS
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">ENGINEERING ARCHIVE</span>
          </div>
          <TextReveal text="Featured Project Collection" as="h2" className="text-4xl md:text-5xl font-extrabold" style={{ color: 'var(--text-primary)' }} />
          <p className="mt-3 text-sm max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Applications built across Full-Stack Web Development, Artificial Intelligence, Machine Learning, and IoT.
          </p>
        </div>

        {/* Desktop Carousel / Draggable Archive */}
        <div className="hidden md:block mb-24">
          <ProjectCarousel projects={projectsData} onOpenProject={setActive} />
        </div>

        {/* Complete Archive Grid (Touch-Safe Vertical on Mobile, Grid on Desktop) */}
        <div className="mb-24">
          <div className="flex justify-between items-center mb-8">
            <TextReveal text="Complete Project Archive" as="h3" className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }} />
            <span className="text-xs font-mono font-bold" style={{ color: 'var(--orange)' }}>
              07 TOTAL PROJECTS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.map((project) => (
              <ProjectCard key={project.id} project={project} onOpen={setActive} />
            ))}
          </div>
        </div>

        {/* Image Comparison */}
        <div className="comparison-section max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--orange-soft)', color: 'var(--orange)', border: '1px solid rgba(var(--orange-rgb), 0.2)' }}>
              DESIGN VS IMPLEMENTATION
            </span>
            <TextReveal text="Wireframe vs Live Application" as="h3" className="text-2xl font-bold mt-2 justify-center" style={{ color: 'var(--text-primary)' }} />
            <p className="mt-2 text-sm max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Drag the interactive divider to compare preliminary design mockup against the executed system.
            </p>
          </div>

          <ImageComparison
            beforeImage={import.meta.env.BASE_URL + "files/portfolio_images/DTA VIS.jpeg"}
            afterImage={import.meta.env.BASE_URL + "files/portfolio_images/twinscape.jpeg"}
            className="aspect-video w-full h-[350px] shadow-lg rounded-2xl overflow-hidden"
          />
        </div>
      </div>

      {active && (
        <PPTViewer project={active} onClose={() => setActive(null)} />
      )}
    </section>
  );
}

import React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchProjects } from "../api/index.js";
import { Github, ExternalLink } from "lucide-react";
import ProjectModal from "./ProjectModal.jsx";

function ProjectCard({ project, onExplore }) {
  const thumb =
    project.imageUrl ||
    project.image ||
    project.thumbnail ||
    project.coverImage ||
    "https://via.placeholder.com/800x450?text=Project+Preview";
  return (
    <motion.div whileHover={{ y: -6 }} className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-blue/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-overlay/40 backdrop-blur-lg border border-white/10 rounded-lg p-4 hover:border-accent/50 transition group-hover:scale-105 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="w-full rounded-md overflow-hidden mb-3">
          <img
            src={thumb}
            alt={project.title}
            className="w-full h-36 object-cover block"
            loading="lazy"
          />
        </div>

        <h3 className="text-lg font-bold text-text-primary mb-1">
          {project.title}
        </h3>
        <p className="text-text-secondary text-sm mb-3 line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-3">
          {project.techStack?.map((tech, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-subtle text-accent text-xs rounded-full font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue hover:text-blue-dim transition text-sm"
              >
                <Github size={14} /> Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-accent hover:text-accent-hover transition text-sm"
              >
                <ExternalLink size={14} /> Live
              </a>
            )}
          </div>

          <button
            onClick={() => onExplore?.(project)}
            className="ml-4 px-3 py-2 bg-accent text-black text-sm rounded-md hover:bg-accent/90 transition"
          >
            Explore
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects()
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="projects" className="py-20 bg-transparent">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold font-head text-text-primary mb-12 text-center">
          Featured Projects
        </h2>

        {loading ? (
          <p className="text-center text-text-secondary">Loading projects...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onExplore={setSelectedProject}
              />
            ))}
          </div>
        )}

        {/* Project Details Modal */}
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}

        {/* Animated HR Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-20 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
        />
      </div>
    </section>
  );
}

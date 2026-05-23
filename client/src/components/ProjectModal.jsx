import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

export default function ProjectModal({ project, onClose }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!project) return null;

  const thumb =
    project.imageUrl ||
    project.image ||
    project.thumbnail ||
    project.coverImage ||
    "https://via.placeholder.com/800x450?text=Project+Preview";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950/75 p-5 pt-12 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl md:p-6 md:pt-12"
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-400 to-green-400 opacity-20 blur-3xl"
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-green-400/10" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white transition hover:bg-black/50"
          aria-label="Close project modal"
        >
          ×
        </button>

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:gap-6">
          <div className="w-full overflow-hidden rounded-xl md:w-[42%]">
            <img
              src={thumb}
              alt={project.title}
              className="h-44 w-full object-cover md:h-full"
            />
          </div>

          <div className="flex-1 md:pt-1">
            <h3 className="mb-2 text-2xl font-bold text-text-primary">
              {project.title}
            </h3>
            <p className="mb-4 text-text-secondary">
              {expanded
                ? project.longDescription || project.description
                : project.description?.slice(0, 220) || ""}
            </p>

            {project.longDescription &&
              project.longDescription.length > 220 && (
                <button
                  onClick={() => setExpanded((s) => !s)}
                  className="mb-4 text-sm text-accent"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}

            <div className="mb-4 space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-sm text-text-secondary">Type:</span>
                <span className="text-sm">{project.type || "Website"}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm text-text-secondary">Languages:</span>
                <span className="text-sm">{(project.techStack || []).join(", ") || "—"}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm text-text-secondary">Live URL:</span>
                <span className="text-sm text-accent">{project.liveUrl || "—"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm"
                >
                  <Github size={14} /> Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm text-black"
                >
                  <ExternalLink size={14} /> Live
                </a>
              )}

            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

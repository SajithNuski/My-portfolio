import React, { useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectModal({ project, onClose }) {
  const [expanded, setExpanded] = useState(false);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="relative max-w-3xl w-full bg-overlay/60 backdrop-blur-xl rounded-xl border border-white/10 p-6 z-10"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 rounded-md overflow-hidden">
            <img
              src={thumb}
              alt={project.title}
              className="w-full h-48 md:h-full object-cover rounded-md"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              {project.title}
            </h3>
            <p className="text-text-secondary mb-4">
              {expanded
                ? project.longDescription || project.description
                : project.description?.slice(0, 220) || ""}
            </p>

            {project.longDescription &&
              project.longDescription.length > 220 && (
                <button
                  onClick={() => setExpanded((s) => !s)}
                  className="text-accent text-sm mb-4"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}

            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack?.map((t, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-subtle text-accent text-xs rounded-full font-mono"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-slate-800 text-sm rounded-md flex items-center gap-2"
                >
                  <Github size={14} /> Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-accent text-black text-sm rounded-md flex items-center gap-2"
                >
                  <ExternalLink size={14} /> Live
                </a>
              )}

              <Link
                to={`/projects/${project._id}`}
                className="ml-auto px-3 py-2 bg-white/5 text-sm rounded-md border border-white/10"
              >
                Open page
              </Link>
              <button
                onClick={onClose}
                className="px-3 py-2 text-sm rounded-md border border-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

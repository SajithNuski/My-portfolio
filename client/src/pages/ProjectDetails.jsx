import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProjects } from "../api/index.js";
import { Github, ExternalLink } from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then((res) => {
        const found = res.data.find((p) => p._id === id);
        setProject(found || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <p className="text-center text-text-secondary">Loading...</p>;
  if (!project)
    return (
      <p className="text-center text-text-secondary">Project not found.</p>
    );

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-overlay/60 backdrop-blur-xl rounded-xl p-6 border border-white/10"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 rounded-md overflow-hidden">
              <img
                src={
                  project.image ||
                  project.thumbnail ||
                  project.coverImage ||
                  "https://via.placeholder.com/800x450?text=Project+Preview"
                }
                alt={project.title}
                className="w-full h-64 object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{project.title}</h1>
              <p className="text-text-secondary mb-4">
                {project.longDescription || project.description}
              </p>

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
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

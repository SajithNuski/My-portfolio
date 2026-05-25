import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Star, X } from "lucide-react";
import { fetchProjects } from "../api/index.js";
import styles from "./Projects.module.css";

const ImageLightbox = lazy(() => import("./ImageLightbox.jsx"));

const accentColors = {
  green: { hex: "#4ade80", rgb: "74,222,128" },
  blue: { hex: "#60a5fa", rgb: "96,165,250" },
  pink: { hex: "#f472b6", rgb: "244,114,182" },
  purple: { hex: "#a78bfa", rgb: "167,139,250" },
};

const MODAL_EXIT_MS = 250;

function splitFeatureColumns(items) {
  const midpoint = Math.ceil(items.length / 2);
  return [items.slice(0, midpoint), items.slice(midpoint)];
}

export default function Projects({ onModalToggle }) {
  const [projects, setProjects] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [modalClosing, setModalClosing] = useState(false);
  const [lightboxProject, setLightboxProject] = useState(null);
  const [particles, setParticles] = useState([]);
  const particleTimeoutsRef = useRef([]);
  const modalTimeoutRef = useRef(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetchProjects();
        const normalized = (response.data || []).map((item, index) => {
          const accentKey = String(item.accent || "green")
            .trim()
            .toLowerCase();
          const allTags = Array.isArray(item.allTags)
            ? item.allTags
            : Array.isArray(item.techStack)
              ? item.techStack
              : [];
          const features = Array.isArray(item.features)
            ? item.features
            : Array.isArray(item.bullets)
              ? item.bullets
              : [];

          return {
            id: item._id,
            num: item.projectNumber || String(index + 1).padStart(2, "0"),
            category: item.category || item.type || "PROJECT",
            accent: accentColors[accentKey] ? accentKey : "green",
            status: item.status || "LIVE",
            title: item.title || "Untitled Project",
            description: item.shortDescription || item.description || "",
            tags: Array.isArray(item.cardTags)
              ? item.cardTags
              : allTags.slice(0, 3),
            thumbnail: item.thumbnail || item.imageUrl || "",
            stars: Number(item.stars || 0),
            fullDescription:
              item.fullDescription ||
              item.longDescription ||
              item.description ||
              "",
            features,
            allTags,
            liveUrl: item.liveUrl || "#",
            visible:
              typeof item.visible === "boolean"
                ? item.visible
                : typeof item.featured === "boolean"
                  ? item.featured
                  : true,
            order: Number(item.order || index),
          };
        });

        setProjects(
          normalized
            .filter((project) => project.visible)
            .sort((a, b) => a.order - b.order),
        );
      } catch (_err) {
        setProjects([]);
      }
    };

    loadProjects();
  }, []);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeModal) || null,
    [activeModal],
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeModal, modalClosing]);

  useEffect(() => {
    return () => {
      particleTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });

      if (modalTimeoutRef.current) {
        window.clearTimeout(modalTimeoutRef.current);
      }
    };
  }, []);

  const spawnParticles = (event, accent) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const hasPointer =
      typeof event.clientX === "number" && typeof event.clientY === "number";
    const baseX = hasPointer ? event.clientX - bounds.left : bounds.width / 2;
    const baseY = hasPointer ? event.clientY - bounds.top : bounds.height / 2;
    const color = accentColors[accent] || accentColors.green;

    const newParticles = Array.from({ length: 10 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 10;
      const distance = 28 + Math.random() * 42;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - (20 + Math.random() * 28);
      return {
        id: `${Date.now()}-${Math.random()}`,
        x: baseX,
        y: baseY,
        dx,
        dy,
        size: 4 + Math.random() * 6,
        delay: index * 0.03,
        color,
      };
    });

    setParticles((current) => [...current, ...newParticles]);

    const timeoutId = window.setTimeout(() => {
      const idsToRemove = new Set(newParticles.map((particle) => particle.id));
      setParticles((current) =>
        current.filter((particle) => !idsToRemove.has(particle.id)),
      );
    }, 1300);

    particleTimeoutsRef.current.push(timeoutId);
  };

  const handleOpenModal = (projectId, event, accent) => {
    spawnParticles(event, accent);
    setModalClosing(false);
    setActiveModal(projectId);
    onModalToggle?.(false);
  };

  const handleCloseModal = () => {
    if (!activeModal || modalClosing) return;

    setModalClosing(true);
    if (modalTimeoutRef.current) {
      window.clearTimeout(modalTimeoutRef.current);
    }

    modalTimeoutRef.current = window.setTimeout(() => {
      setActiveModal(null);
      setModalClosing(false);
      onModalToggle?.(true);
    }, MODAL_EXIT_MS);
  };

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.container}>
        <h2 className="text-4xl md:text-5xl font-bold font-head text-text-primary mb-12 text-center">
          Latest Projects
        </h2>

        <div className={styles.grid}>
          {projects.map((project) => {
            const accent = accentColors[project.accent] || accentColors.green;

            return (
              <article
                key={project.id}
                className={styles.projectCard}
                style={{
                  "--accent-hex": accent.hex,
                  "--accent-rgb": accent.rgb,
                }}
                onClick={(event) =>
                  handleOpenModal(project.id, event, project.accent)
                }
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleOpenModal(project.id, event, project.accent);
                  }
                }}
                aria-label={`Open ${project.title} details`}
              >
                <span className={styles.scanLine} aria-hidden="true" />
                <span
                  className={`${styles.cornerBracket} ${styles.topLeft}`}
                  aria-hidden="true"
                />
                <span
                  className={`${styles.cornerBracket} ${styles.bottomRight}`}
                  aria-hidden="true"
                />
                <span className={styles.topAccentBar} aria-hidden="true" />

                <div className={styles.thumbWrap}>
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className={styles.thumbnail}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://via.placeholder.com/1200x675/0d1117/f1f5f9?text=Project+Preview";
                    }}
                  />
                  <div className={styles.thumbGradient} />

                  <span className={styles.statusBadge}>
                    <span className={styles.statusDot} aria-hidden="true" />
                    {project.status}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.cardLabel}>
                    {project.num} / {project.category}
                  </p>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <p className={styles.cardDescription}>
                    {project.description}
                  </p>

                  <ul className={styles.tags}>
                    {project.tags.slice(0, 3).map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <footer className={styles.cardFooter}>
                    <button
                      type="button"
                      className={styles.detailsButton}
                      onClick={(event) => {
                        event.stopPropagation();

                        if (project.thumbnail) {
                          setLightboxProject(project);
                          return;
                        }

                        if (project.liveUrl) {
                          window.open(
                            project.liveUrl,
                            "_blank",
                            "noopener,noreferrer",
                          );
                        }
                      }}
                    >
                      View Project
                    </button>
                    <span className={styles.starCount}>
                      <Star size={14} /> {project.stars}
                    </span>
                  </footer>
                </div>

                {particles.map((particle) => {
                  if (particle.color.hex !== accent.hex) return null;

                  return (
                    <span
                      key={particle.id}
                      className={styles.particle}
                      style={{
                        "--x": `${particle.x}px`,
                        "--y": `${particle.y}px`,
                        "--dx": `${particle.dx}px`,
                        "--dy": `${particle.dy}px`,
                        "--size": `${particle.size}px`,
                        "--delay": `${particle.delay}s`,
                        "--particle-rgb": particle.color.rgb,
                      }}
                    />
                  );
                })}
              </article>
            );
          })}
        </div>
      </div>

      {activeProject ? (
        <div
          className={`${styles.modalOverlay} ${modalClosing ? styles.closing : styles.open}`}
          onClick={handleCloseModal}
          role="presentation"
        >
          <div
            className={styles.modalPanel}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeProject.title} modal`}
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={handleCloseModal}
              aria-label="Close project modal"
            >
              <X size={18} />
            </button>

            <header className={styles.modalHeader}>
              <img
                src={activeProject.thumbnail}
                alt={activeProject.title}
                className={styles.modalHeaderImage}
                onError={(event) => {
                  event.currentTarget.src =
                    "https://via.placeholder.com/1200x675/0d1117/f1f5f9?text=Project+Preview";
                }}
              />
              <div className={styles.modalHeaderGradient} />
            </header>

            <div className={styles.modalBody}>
              <p className={styles.modalProjectNum}>
                PROJECT {activeProject.num}
              </p>

              <div className={styles.modalCategoryRow}>
                <span
                  className={styles.modalCategory}
                  style={{
                    color:
                      accentColors[activeProject.accent]?.hex ||
                      accentColors.green.hex,
                  }}
                >
                  {activeProject.category}
                </span>
                <span className={styles.modalCategoryLine} />
              </div>

              <h3 className={styles.modalTitle}>{activeProject.title}</h3>
              <p className={styles.modalDescription}>
                {activeProject.fullDescription}
              </p>

              <div className={styles.modalDivider} />

              <div className={styles.featureGrid}>
                {splitFeatureColumns(activeProject.features).map(
                  (column, index) => (
                    <ul key={`col-${index}`} className={styles.featureList}>
                      {column.map((feature) => (
                        <li key={feature} className={styles.featureItem}>
                          <span
                            className={styles.featureDot}
                            style={{
                              background:
                                accentColors[activeProject.accent]?.hex ||
                                accentColors.green.hex,
                            }}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </div>

              <ul className={styles.modalTags}>
                {activeProject.allTags.map((tag) => (
                  <li key={tag} className={styles.modalTag}>
                    {tag}
                  </li>
                ))}
              </ul>

              <a
                href={activeProject.liveUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.liveButton}
              >
                Live Demo <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <Suspense fallback={null}>
        <ImageLightbox
          isOpen={Boolean(lightboxProject)}
          onClose={() => setLightboxProject(null)}
          image={lightboxProject?.thumbnail || ""}
          title={lightboxProject?.title || "Project preview"}
          issuer={lightboxProject?.category || "Project"}
          accent={lightboxProject?.accent || "green"}
          externalUrl={lightboxProject?.liveUrl || ""}
        />
      </Suspense>
    </section>
  );
}

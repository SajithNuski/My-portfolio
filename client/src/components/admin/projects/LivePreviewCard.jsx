import React from "react";
import styles from "./AdminProjects.module.css";

const STATUS_CLASS = {
  LIVE: styles.statusLive,
  "IN DEV": styles.statusInDev,
  ARCHIVED: styles.statusArchived,
};

export default function LivePreviewCard({ project, accentHex }) {
  return (
    <article
      className={styles.rowCard}
      style={{
        "--accent-hex": accentHex,
        "--accent-soft": `${accentHex}22`,
      }}
    >
      <img
        className={styles.thumbnail}
        src={
          project.thumbnail ||
          "https://via.placeholder.com/300x180/0d1117/f1f5f9?text=Preview"
        }
        alt={project.title || "preview"}
      />

      <div className={styles.info}>
        <h4 className={styles.projectTitle}>
          {project.title || "Project title"}
        </h4>
        <p className={styles.hint}>
          {project.shortDescription || "Short description appears here"}
        </p>
        <div className={styles.metaRow}>
          <span className={styles.categoryBadge}>
            {project.projectNumber || "01"} / {project.category || "CATEGORY"}
          </span>
          <span
            className={styles.accentDot}
            style={{ background: accentHex }}
          />
          <span
            className={`${styles.statusBadge} ${STATUS_CLASS[project.status] || styles.statusLive}`}
          >
            {project.status || "LIVE"}
          </span>
          {(project.cardTags || []).slice(0, 3).map((tag) => (
            <span key={tag} className={styles.categoryBadge}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

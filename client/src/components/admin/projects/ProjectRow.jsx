import React, { useState } from "react";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import styles from "./AdminProjects.module.css";

const STATUS_CLASS = {
  LIVE: styles.statusLive,
  "IN DEV": styles.statusInDev,
  ARCHIVED: styles.statusArchived,
};

const ACCENT_COLORS = {
  green: "#4ade80",
  blue: "#60a5fa",
  pink: "#f472b6",
  purple: "#a78bfa",
};

export default function ProjectRow({
  project,
  onToggle,
  onEdit,
  onDelete,
  toggleLoading,
  deleting,
  showDropIndicator,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const statusClass = STATUS_CLASS[project.status] || styles.statusLive;

  if (confirmDelete) {
    return (
      <>
        {showDropIndicator ? (
          <div className={styles.dropIndicator} aria-hidden="true" />
        ) : null}
        <div className={styles.confirmBar}>
          <p className={styles.confirmText}>
            Delete '{project.title}'? This cannot be undone.
          </p>
          <div className={styles.confirmActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.dangerButton}
              disabled={deleting}
              onClick={() => onDelete(project._id)}
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {showDropIndicator ? (
        <div className={styles.dropIndicator} aria-hidden="true" />
      ) : null}
      <article
        ref={setNodeRef}
        style={style}
        className={`${styles.rowCard} ${isDragging ? styles.rowCardDragging : ""} ${
          deleting ? styles.rowCardFadeOut : ""
        }`}
      >
        <button
          type="button"
          className={styles.dragHandle}
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label="Drag row"
        >
          <GripVertical size={18} />
        </button>

        <img
          className={styles.thumbnail}
          src={
            project.thumbnail ||
            "https://via.placeholder.com/120/120/0d1117/f1f5f9?text=P"
          }
          alt={project.title}
        />

        <div className={styles.info}>
          <h3 className={styles.projectTitle}>{project.title}</h3>
          <div className={styles.metaRow}>
            <span className={styles.categoryBadge}>
              {project.category || "CATEGORY"}
            </span>
            <span
              className={styles.accentDot}
              style={{
                background:
                  ACCENT_COLORS[project.accent] || ACCENT_COLORS.green,
              }}
            />
            <span className={`${styles.statusBadge} ${statusClass}`}>
              {project.status === "LIVE" ? (
                <span className={styles.statusPulse} aria-hidden="true" />
              ) : null}
              {project.status}
            </span>
          </div>
        </div>

        <div className={styles.toggleWrap}>
          <button
            type="button"
            className={`${styles.toggleButton} ${project.visible ? styles.toggleOn : ""}`}
            onClick={() => onToggle(project._id, !project.visible)}
            disabled={toggleLoading}
            aria-label="Toggle visibility"
          >
            <span className={styles.toggleKnob} />
          </button>
          {toggleLoading ? (
            <span className={styles.toggleSpinner}>•••</span>
          ) : null}
        </div>

        <button
          type="button"
          className={styles.iconButton}
          onClick={() => onEdit(project)}
        >
          <Pencil size={16} />
        </button>

        <button
          type="button"
          className={`${styles.iconButton} ${styles.deleteButton}`}
          onClick={() => setConfirmDelete(true)}
        >
          <Trash2 size={16} />
        </button>
      </article>
    </>
  );
}

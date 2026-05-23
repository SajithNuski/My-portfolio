import React from "react";
import styles from "./AdminProjects.module.css";

export default function UnsavedChangesModal({ open, onStay, onDiscard }) {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay} role="presentation">
      <div
        className={styles.modalCard}
        role="dialog"
        aria-modal="true"
        aria-label="Unsaved Changes"
      >
        <h3 className={styles.modalTitle}>Unsaved Changes</h3>
        <p className={styles.modalText}>
          You have unsaved changes. If you leave now, your changes will be lost.
        </p>
        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onStay}
          >
            Stay and Edit
          </button>
          <button
            type="button"
            className={styles.dangerButton}
            onClick={onDiscard}
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
}

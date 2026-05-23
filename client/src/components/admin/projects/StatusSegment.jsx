import React from "react";
import styles from "./AdminProjects.module.css";

const OPTIONS = ["LIVE", "IN DEV", "ARCHIVED"];

export default function StatusSegment({ value, onChange }) {
  return (
    <div className={styles.segmented}>
      {OPTIONS.map((status) => (
        <button
          key={status}
          type="button"
          className={`${styles.segmentButton} ${
            value === status ? styles.segmentButtonActive : ""
          }`}
          onClick={() => onChange(status)}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

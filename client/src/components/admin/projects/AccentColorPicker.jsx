import React from "react";
import styles from "./AdminProjects.module.css";

const OPTIONS = [
  { id: "green", label: "Green", hex: "#4ade80" },
  { id: "blue", label: "Blue", hex: "#60a5fa" },
  { id: "pink", label: "Pink", hex: "#f472b6" },
  { id: "purple", label: "Purple", hex: "#a78bfa" },
];

export default function AccentColorPicker({ value, onChange }) {
  const selected = OPTIONS.find((item) => item.id === value) || OPTIONS[0];

  return (
    <div>
      <div className={styles.accentPicker}>
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`${styles.accentButton} ${
              value === option.id ? styles.accentButtonActive : ""
            }`}
            style={{ background: option.hex }}
            aria-label={option.label}
            onClick={() => onChange(option.id)}
          />
        ))}
      </div>
      <p className={styles.hint} style={{ color: selected.hex, marginTop: 10 }}>
        {selected.label}
      </p>
    </div>
  );
}

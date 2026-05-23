import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import styles from "./AdminProjects.module.css";

export default function TagInput({
  label,
  tags,
  onAdd,
  onRemove,
  placeholder,
  accent = false,
}) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const next = draft.trim();
    if (!next) return;
    onAdd(next);
    setDraft("");
  };

  return (
    <div className={styles.field}>
      <p className={styles.fieldLabel}>{label}</p>
      <div className={styles.tagRow}>
        <input
          className={styles.input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submit();
            }
          }}
        />
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={submit}
        >
          <Plus size={14} /> Add
        </button>
      </div>

      <div className={styles.tagList}>
        {tags.map((tag) => (
          <span
            key={tag}
            className={`${styles.tagPill} ${
              accent ? styles.tagPillAccent : styles.tagPillMuted
            }`}
          >
            {tag}
            <button
              type="button"
              className={styles.tagRemove}
              aria-label={`Remove ${tag}`}
              onClick={() => onRemove(tag)}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { CheckCircle2, ExternalLink } from "lucide-react";
import TagInput from "./TagInput.jsx";
import styles from "./AdminProjects.module.css";

export default function EditorLeftColumn({
  form,
  errors,
  maxLimits,
  disabled,
  accentHex,
  accentSoft,
  accentGlow,
  liveUrlValid,
  setField,
  setFeature,
  addTag,
  removeTag,
  validateLiveUrl,
}) {
  const inputStyle = {
    "--accent-hex": accentHex,
    "--accent-soft": accentSoft,
    "--accent-glow": accentGlow,
  };

  return (
    <div className={styles.stack} style={inputStyle}>
      <section className={styles.card}>
        <p className={styles.sectionLabel}>Basic Info</p>
        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Project Number</span>
            <input
              className={styles.input}
              value={form.projectNumber}
              disabled={disabled}
              placeholder="01"
              onChange={(event) =>
                setField("projectNumber", event.target.value)
              }
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Category</span>
            <input
              className={styles.input}
              value={form.category}
              disabled={disabled}
              placeholder="FULL-STACK"
              onChange={(event) => setField("category", event.target.value)}
            />
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Title</span>
          <input
            className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
            value={form.title}
            disabled={disabled}
            maxLength={maxLimits.title}
            style={{ fontSize: 18 }}
            onChange={(event) => setField("title", event.target.value)}
          />
          <span className={styles.counter}>
            {form.title.length}/{maxLimits.title}
          </span>
        </label>
      </section>

      <section className={styles.card}>
        <p className={styles.sectionLabel}>Descriptions</p>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Short Description</span>
          <textarea
            rows={3}
            className={`${styles.textarea} ${errors.shortDescription ? styles.inputError : ""}`}
            value={form.shortDescription}
            disabled={disabled}
            maxLength={maxLimits.short}
            onChange={(event) =>
              setField("shortDescription", event.target.value)
            }
          />
          <span
            className={`${styles.counter} ${form.shortDescription.length > 100 ? styles.counterWarn : ""}`}
          >
            {form.shortDescription.length}/{maxLimits.short}
          </span>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Full Description</span>
          <textarea
            rows={6}
            className={`${styles.textarea} ${errors.fullDescription ? styles.inputError : ""}`}
            value={form.fullDescription}
            disabled={disabled}
            maxLength={maxLimits.full}
            onChange={(event) =>
              setField("fullDescription", event.target.value)
            }
          />
          <span
            className={`${styles.counter} ${form.fullDescription.length > 500 ? styles.counterWarn : ""}`}
          >
            {form.fullDescription.length}/{maxLimits.full}
          </span>
        </label>
      </section>

      <section className={styles.card}>
        <p className={styles.sectionLabel}>Links & Stats</p>
        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Live URL</span>
            <div style={{ position: "relative" }}>
              <input
                className={`${styles.input} ${errors.liveUrl ? styles.inputError : ""}`}
                value={form.liveUrl}
                disabled={disabled}
                onBlur={validateLiveUrl}
                onChange={(event) => setField("liveUrl", event.target.value)}
              />
              <span style={{ position: "absolute", right: 10, top: 10 }}>
                {form.liveUrl && liveUrlValid ? (
                  <CheckCircle2 size={16} color="#4ade80" />
                ) : (
                  <ExternalLink size={16} />
                )}
              </span>
            </div>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Stars</span>
            <input
              type="number"
              min={0}
              max={9999}
              step={1}
              className={styles.numberInput}
              value={form.stars}
              disabled={disabled}
              onChange={(event) => setField("stars", event.target.value)}
              style={{ maxWidth: 120 }}
            />
          </label>
        </div>
      </section>

      <section className={styles.card}>
        <p className={styles.sectionLabel}>Tech Tags</p>

        <TagInput
          label="Card Tags (max 3)"
          tags={form.cardTags}
          accent
          placeholder="React"
          onAdd={(tag) => addTag("cardTags", tag)}
          onRemove={(tag) => removeTag("cardTags", tag)}
        />
        {form.cardTags.length > 3 ? (
          <p className={styles.hint}>Only first 3 shown on card</p>
        ) : null}

        <div style={{ marginTop: 12 }}>
          <TagInput
            label="All Tags"
            tags={form.allTags}
            placeholder="Node.js"
            onAdd={(tag) => addTag("allTags", tag)}
            onRemove={(tag) => removeTag("allTags", tag)}
          />
        </div>
      </section>

      <section className={styles.card}>
        <p className={styles.sectionLabel}>Feature Highlights</p>
        {[0, 1, 2, 3].map((index) => (
          <label key={index} className={styles.field}>
            <span className={styles.fieldLabel}>Feature {index + 1}</span>
            <div className={styles.featureRow}>
              <span
                className={styles.featureDot}
                style={{ background: accentHex }}
              />
              <input
                className={styles.input}
                value={form.features[index] || ""}
                disabled={disabled}
                placeholder="e.g. Drag-and-drop editor"
                onChange={(event) => setFeature(index, event.target.value)}
              />
            </div>
          </label>
        ))}
      </section>
    </div>
  );
}

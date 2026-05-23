import React from "react";
import ImageUploader from "./ImageUploader.jsx";
import AccentColorPicker from "./AccentColorPicker.jsx";
import StatusSegment from "./StatusSegment.jsx";
import LivePreviewCard from "./LivePreviewCard.jsx";
import styles from "./AdminProjects.module.css";

export default function EditorRightColumn({
  form,
  disabled,
  accentHex,
  accentSoft,
  accentGlow,
  imageFile,
  imageError,
  uploadingImage,
  shakeUploadZone,
  setField,
  onSelectImage,
  onRemoveImage,
}) {
  const inputStyle = {
    "--accent-hex": accentHex,
    "--accent-soft": accentSoft,
    "--accent-glow": accentGlow,
  };

  return (
    <div className={styles.stack} style={inputStyle}>
      <section className={styles.card}>
        <p className={styles.sectionLabel}>Project Thumbnail</p>
        <ImageUploader
          thumbnail={form.thumbnail}
          imageFile={imageFile}
          uploading={uploadingImage}
          onSelect={onSelectImage}
          onRemove={onRemoveImage}
          error={imageError}
          shake={shakeUploadZone}
          accentHex={accentHex}
          accentSoft={accentSoft}
          disabled={disabled}
        />
      </section>

      <section className={styles.card}>
        <p className={styles.sectionLabel}>Settings</p>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Accent Color</span>
          <AccentColorPicker
            value={form.accent}
            onChange={(next) => setField("accent", next)}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Status</span>
          <StatusSegment
            value={form.status}
            onChange={(next) => setField("status", next)}
          />
        </div>

        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Display Order</span>
            <input
              type="number"
              className={styles.numberInput}
              value={form.displayOrder}
              disabled={disabled}
              onChange={(event) => setField("displayOrder", event.target.value)}
            />
            <span className={styles.hint}>
              Controls sort position in the list
            </span>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Show on portfolio</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                type="button"
                className={`${styles.toggleButton} ${form.visible ? styles.toggleOn : ""}`}
                onClick={() => setField("visible", !form.visible)}
                disabled={disabled}
              >
                <span className={styles.toggleKnob} />
              </button>
              <span className={styles.hint}>
                Hidden projects won't appear on your live site
              </span>
            </div>
          </label>
        </div>
      </section>

      <section className={styles.card}>
        <p className={styles.sectionLabel}>Live Preview</p>
        <div className={styles.previewWrap}>
          <div className={styles.previewScale}>
            <LivePreviewCard project={form} accentHex={accentHex} />
          </div>
        </div>
      </section>
    </div>
  );
}

import React from "react";
import EditorLeftColumn from "./EditorLeftColumn.jsx";
import EditorRightColumn from "./EditorRightColumn.jsx";
import styles from "./AdminProjects.module.css";

const ACCENT = {
  green: {
    hex: "#4ade80",
    soft: "rgba(74, 222, 128, 0.14)",
    glow: "rgba(74, 222, 128, 0.12)",
  },
  blue: {
    hex: "#60a5fa",
    soft: "rgba(96, 165, 250, 0.14)",
    glow: "rgba(96, 165, 250, 0.12)",
  },
  pink: {
    hex: "#f472b6",
    soft: "rgba(244, 114, 182, 0.14)",
    glow: "rgba(244, 114, 182, 0.12)",
  },
  purple: {
    hex: "#a78bfa",
    soft: "rgba(167, 139, 250, 0.14)",
    glow: "rgba(167, 139, 250, 0.12)",
  },
};

export default function ProjectEditor({
  mode,
  editor,
  onBack,
  onDiscard,
  onSave,
}) {
  const accent = ACCENT[editor.form.accent] || ACCENT.green;

  return (
    <div className={styles.editorShell}>
      <header className={styles.editorHeader}>
        <button type="button" className={styles.editorBack} onClick={onBack}>
          ← Projects
        </button>
        <h2 className={styles.editorTitle}>
          {mode === "add" ? "Add New Project" : "Edit Project"}
        </h2>
        <div className={styles.editorActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onDiscard}
            disabled={editor.saving}
          >
            Discard
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onSave}
            disabled={editor.saving}
          >
            {editor.saving ? "Saving..." : "Save Project"}
          </button>
        </div>
      </header>

      <div className={styles.editorGrid}>
        <EditorLeftColumn
          form={editor.form}
          errors={editor.errors}
          maxLimits={editor.maxLimits}
          disabled={editor.saving}
          accentHex={accent.hex}
          accentSoft={accent.soft}
          accentGlow={accent.glow}
          liveUrlValid={editor.liveUrlValid}
          setField={editor.setField}
          setFeature={editor.setFeature}
          addTag={editor.addTag}
          removeTag={editor.removeTag}
          validateLiveUrl={editor.validateLiveUrl}
        />

        <EditorRightColumn
          form={editor.form}
          disabled={editor.saving}
          accentHex={accent.hex}
          accentSoft={accent.soft}
          accentGlow={accent.glow}
          imageFile={editor.imageFile}
          imageError={editor.imageError}
          uploadingImage={editor.uploadingImage}
          shakeUploadZone={editor.shakeUploadZone}
          setField={editor.setField}
          onSelectImage={editor.onSelectImage}
          onRemoveImage={editor.removeImage}
        />
      </div>
    </div>
  );
}

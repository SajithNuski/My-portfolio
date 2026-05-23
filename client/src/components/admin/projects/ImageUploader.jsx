import React, { useRef } from "react";
import { Upload } from "lucide-react";
import styles from "./AdminProjects.module.css";

function formatSize(size) {
  if (!size) return "";
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export default function ImageUploader({
  thumbnail,
  imageFile,
  uploading,
  onSelect,
  onRemove,
  error,
  shake,
  accentHex,
  accentSoft,
  disabled,
}) {
  const inputRef = useRef(null);

  const handleBrowse = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFile = (file) => {
    if (disabled) return;
    onSelect(file);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => handleFile(event.target.files?.[0])}
        style={{ display: "none" }}
      />

      {thumbnail ? (
        <div className={styles.uploadPreview}>
          <img
            className={styles.uploadImage}
            src={thumbnail}
            alt="Project thumbnail preview"
          />
          {uploading ? (
            <span className={styles.uploadShimmer} aria-hidden="true" />
          ) : null}
          <div className={styles.uploadMeta}>
            {imageFile
              ? `${imageFile.name} · ${formatSize(imageFile.size)}`
              : "Stored image"}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button
              type="button"
              className={styles.linkLike}
              onClick={handleBrowse}
            >
              Replace Image
            </button>
            <button
              type="button"
              className={styles.linkLike}
              onClick={onRemove}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`${styles.uploadZone} ${styles.uploadZoneAccent} ${
            shake ? styles.uploadZoneShake : ""
          }`}
          style={{ "--accent-hex": accentHex, "--accent-bg": accentSoft }}
          onClick={handleBrowse}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            handleFile(event.dataTransfer.files?.[0]);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleBrowse();
          }}
        >
          <div>
            <Upload size={28} />
            <p style={{ margin: "8px 0 0", fontWeight: 600 }}>
              Drop image here or click to browse
            </p>
            <p className={styles.hint}>JPG, PNG or WebP · Max 5MB</p>
          </div>
        </div>
      )}

      {error ? (
        <p className={styles.hint} style={{ color: "#fb7185", marginTop: 8 }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

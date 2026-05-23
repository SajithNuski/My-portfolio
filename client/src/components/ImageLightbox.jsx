import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Maximize2, Minus, Plus, X } from "lucide-react";
import "../styles/lightbox.css";

const accentColors = {
  green: { hex: "#4ade80", rgb: "74,222,128" },
  blue: { hex: "#60a5fa", rgb: "96,165,250" },
  pink: { hex: "#f472b6", rgb: "244,114,182" },
  purple: { hex: "#a78bfa", rgb: "167,139,250" },
};

function resolveAccent(accent) {
  if (accent && typeof accent === "object" && accent.hex && accent.rgb) {
    return accent;
  }

  const accentKey = String(accent || "green")
    .trim()
    .toLowerCase();
  return accentColors[accentKey] || accentColors.green;
}

export default function ImageLightbox({
  isOpen,
  onClose,
  image,
  title,
  issuer,
  accent,
  externalUrl,
}) {
  const [zoom, setZoom] = useState(1);
  const accentColor = resolveAccent(accent);

  const zoomIn = () => setZoom((current) => Math.min(current + 0.25, 3));
  const zoomOut = () => setZoom((current) => Math.max(current - 0.25, 0.5));
  const zoomReset = () => setZoom(1);

  const handleBackdropClick = (event) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (zoom === 1) {
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handler = (event) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "+" || event.key === "=") {
        zoomIn();
      }

      if (event.key === "-") {
        zoomOut();
      }

      if (event.key === "0") {
        zoomReset();
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
    }
  }, [isOpen, image]);

  if (!isOpen || !image) {
    return null;
  }

  return createPortal(
    <div className="lightbox-backdrop" onClick={handleBackdropClick}>
      <div
        className="lightbox-panel"
        style={{ "--lb-accent": accentColor.hex }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title ? `${title} image preview` : "Image preview"}
      >
        <div className="lightbox-header">
          <div className="lightbox-meta">
            <span className="lightbox-issuer">{issuer || "Preview"}</span>
            <h3 className="lightbox-title">{title || "Image"}</h3>
          </div>

          <div className="lightbox-actions">
            {externalUrl ? (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="lightbox-ext-btn"
                style={{
                  color: accentColor.hex,
                  borderColor: `rgba(${accentColor.rgb}, 0.3)`,
                }}
              >
                <ExternalLink size={14} />
                <span>Open Link</span>
              </a>
            ) : null}

            <button
              type="button"
              className="lightbox-close"
              onClick={onClose}
              aria-label="Close image preview"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="lightbox-image-wrap">
          <img
            src={image}
            alt={title || "Preview image"}
            className="lightbox-image"
            draggable={false}
            style={{ transform: `scale(${zoom})` }}
          />

          <div className="lightbox-zoom-controls">
            <button
              type="button"
              onClick={zoomOut}
              className="zoom-btn"
              aria-label="Zoom out"
            >
              <Minus size={12} />
            </button>
            <span className="zoom-label">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={zoomIn}
              className="zoom-btn"
              aria-label="Zoom in"
            >
              <Plus size={12} />
            </button>
            <button
              type="button"
              onClick={zoomReset}
              className="zoom-btn"
              aria-label="Reset zoom"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

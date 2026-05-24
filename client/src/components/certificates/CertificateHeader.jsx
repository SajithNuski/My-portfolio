import React, { useEffect, useState } from "react";
import { Award } from "lucide-react";

export default function CertificateHeader({ certificate, accent, index }) {
  const [imageError, setImageError] = useState(false);
  const certificateImage = certificate.image || certificate.imageUrl || "";
  const hasImage = Boolean(certificateImage) && !imageError;

  useEffect(() => {
    setImageError(false);
  }, [certificateImage]);

  return (
    <header className="cert-header">
      {hasImage ? (
        <div className="cert-thumb-wrapper">
          <img
            src={certificateImage}
            alt={`${certificate.title} certificate`}
            className="cert-image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
          <div className="cert-thumb-overlay" aria-hidden="true" />
        </div>
      ) : (
        <div className="cert-fallback" aria-hidden="true">
          <span
            className="cert-fallback-glow"
            style={{
              background: `radial-gradient(circle, rgba(${accent.rgb}, 0.12) 0%, transparent 70%)`,
            }}
          />
          <Award size={48} style={{ color: `rgba(${accent.rgb}, 0.7)` }} />
        </div>
      )}

      <span className="cert-num">
        {certificate.num || String(index + 1).padStart(2, "0")}
      </span>
    </header>
  );
}

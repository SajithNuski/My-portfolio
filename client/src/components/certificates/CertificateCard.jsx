import React from "react";
import CertificateHeader from "./CertificateHeader.jsx";
import CertificateBody from "./CertificateBody.jsx";
import CertificateFooter from "./CertificateFooter.jsx";

export default function CertificateCard({
  certificate,
  accent,
  index,
  revealed,
}) {
  return (
    <article
      className={`cert-card ${revealed ? "in" : ""}`}
      style={{
        "--accent-hex": accent.hex,
        "--accent-rgb": accent.rgb,
        "--card-delay": `${index * 100}ms`,
      }}
    >
      <span className="acc" aria-hidden="true" />
      <CertificateHeader
        certificate={certificate}
        accent={accent}
        index={index}
      />
      <CertificateBody certificate={certificate} />
      <CertificateFooter certificate={certificate} accent={accent} />
      <span className="scan-line" aria-hidden="true" />
      <span className="corner corner-tl" aria-hidden="true" />
      <span className="corner corner-br" aria-hidden="true" />
    </article>
  );
}

import React from "react";
import { CalendarDays, Fingerprint } from "lucide-react";

export default function CertificateBody({ certificate }) {
  return (
    <div className="cert-body">
      <h3 className="cert-title">{certificate.title}</h3>

      <div className="cert-meta">
        <div className="cert-meta-item">
          <CalendarDays size={11} />
          <span>{certificate.completedDate}</span>
        </div>

        {certificate.credentialId ? (
          <div className="cert-meta-item cert-meta-id">
            <Fingerprint size={11} />
            <span>{certificate.credentialId}</span>
          </div>
        ) : null}
      </div>

      <div className="cert-divider" />
    </div>
  );
}

import React from "react";

export default function CertificateFooter({ certificate }) {
  const skills = Array.isArray(certificate.skills) ? certificate.skills : [];
  const visibleSkills = skills.slice(0, 3);
  const hiddenCount = Math.max(0, skills.length - visibleSkills.length);

  return (
    <footer className="cert-footer">
      <div className="ctags">
        {visibleSkills.map((skill) => (
          <span key={skill} className="ctag">
            {skill}
          </span>
        ))}
        {hiddenCount > 0 ? (
          <span className="ctag ctag-more">+{hiddenCount} more</span>
        ) : null}
      </div>

      <div className="cert-verify-row">
        <div className="cert-verified">
          <span className="sdot" aria-hidden="true" />
          VERIFIED
        </div>
      </div>
    </footer>
  );
}

import React, { useEffect, useRef, useState } from "react";
import CertificateCard from "./certificates/CertificateCard.jsx";
import { accentColors } from "../data/certificates.js";
import { fetchCertificates } from "../api/index.js";
import "../styles/certificates.css";

const accentCycle = ["green", "blue", "pink", "purple"];

function resolveAccent(accent, index) {
  const normalized = String(accent || "")
    .trim()
    .toLowerCase();
  const key = accentColors[normalized]
    ? normalized
    : accentCycle[index % accentCycle.length];

  return accentColors[key] || accentColors.green;
}

function normalizeCertificate(certificate, index) {
  const title = certificate.title || certificate.name || "Untitled Certificate";
  const accentKey = String(certificate.accent || "")
    .trim()
    .toLowerCase();
  const certificateId = certificate._id || certificate.id || "";

  return {
    id: certificateId,
    num:
      certificate.num ||
      (certificate.order != null
        ? String(certificate.order).padStart(2, "0")
        : String(index + 1).padStart(2, "0")),
    accent: accentColors[accentKey]
      ? accentKey
      : accentCycle[index % accentCycle.length],
    title,
    issuer: certificate.issuer || "",
    issuerLogo: certificate.issuerLogo || "",
    image: certificate.image || certificate.imageUrl || "",
    completedDate: certificate.completedDate || certificate.date || "",
    credentialId: certificate.credentialId || "",
    skills: Array.isArray(certificate.skills) ? certificate.skills : [],
    certificateUrl:
      certificate.certificateUrl ||
      certificate.credentialUrl ||
      certificate.pdfUrl ||
      "",
    verified: Boolean(certificate.verified),
  };
}

export default function Certificates() {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadCertificates = async () => {
      try {
        const response = await fetchCertificates();
        const list = Array.isArray(response.data) ? response.data : [];
        if (mounted) {
          setItems(
            list.map((certificate, index) =>
              normalizeCertificate(certificate, index),
            ),
          );
        }
      } catch (_error) {
        if (mounted) {
          setItems([]);
        }
      }
    };

    loadCertificates();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="certificates"
      ref={sectionRef}
      className="certificates-section"
    >
      <div className="certificates-wrap">
        <header className="cert-head">
          <h2 className="cert-heading">Certificates</h2>
        </header>

        <div className="cert-grid">
          {items.map((certificate, index) => {
            const accent = resolveAccent(certificate.accent, index);
            const cardKey =
              certificate.id ||
              `${certificate.title || "certificate"}-${index}`;

            return (
              <CertificateCard
                key={cardKey}
                certificate={certificate}
                accent={accent}
                index={index}
                revealed={revealed}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

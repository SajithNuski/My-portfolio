import React from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, FileText } from "lucide-react";

const certificateFallbackImage =
  "https://via.placeholder.com/1200x800?text=Certificate+Image";
const membershipCertificateImage = new URL(
  "../assets/Certificate (7).png",
  import.meta.url,
).href;

function resolveCertificateImage(cert) {
  const isMembershipCertificate = [cert.name, cert.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes("ms club membership");

  return (
    cert.imageUrl ||
    (isMembershipCertificate
      ? membershipCertificateImage
      : certificateFallbackImage)
  );
}

export default function CertificateModal({ certificate, onClose }) {
  if (!certificate) return null;

  const imageUrl = resolveCertificateImage(certificate);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-overlay/70 backdrop-blur-xl"
      >
        <div className="grid md:grid-cols-2">
          <div className="bg-canvas/40">
            <img
              src={imageUrl}
              alt={certificate.imageAlt || certificate.name || "Certificate"}
              className="h-64 w-full object-cover md:h-full"
            />
          </div>

          <div className="p-6 md:p-8 flex flex-col">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
              <Award className="text-accent" size={24} />
            </div>

            <h3 className="text-2xl font-bold text-text-primary">
              {certificate.name || "Certificate"}
            </h3>

            <p className="mt-4 flex-1 text-sm leading-relaxed text-text-secondary">
              {certificate.description ||
                "No additional description available for this certificate."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {certificate.credentialUrl && (
                <a
                  href={certificate.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-canvas"
                >
                  <ExternalLink size={16} /> View credential
                </a>
              )}

              {certificate.pdfUrl && (
                <a
                  href={certificate.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-canvas/30 px-4 py-2 text-sm font-semibold text-text-primary hover:border-accent/50"
                >
                  <FileText size={16} /> Open PDF
                </a>
              )}

              <button
                onClick={onClose}
                className="ml-auto inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-text-primary hover:border-accent/50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

import React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchCertificates } from "../api/index.js";
import { Award, FileText } from "lucide-react";

const certificateFallbackImage =
  "https://via.placeholder.com/1200x800?text=Certificate+Image";
const membershipCertificateImage = new URL(
  "../assets/Certificate (7).png",
  import.meta.url,
).href;

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates()
      .then((res) => {
        setCertificates(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch certificates:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold font-head text-text-primary mb-12 text-center">
          Certifications
        </h2>

        {loading ? (
          <p className="text-center text-text-secondary">
            Loading certifications...
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((cert) => {
              const CardTag = cert.credentialUrl ? motion.a : motion.div;
              const cardProps = cert.credentialUrl
                ? {
                    href: cert.credentialUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : {};
              const isMembershipCertificate =
                [cert.name, cert.issuer, cert.description]
                  .filter(Boolean)
                  .join(" ")
                  .toLowerCase()
                  .includes("ms club membership");
              const certificateImage =
                cert.imageUrl ||
                (isMembershipCertificate
                  ? membershipCertificateImage
                  : certificateFallbackImage);

              return (
              <CardTag
                key={cert._id}
                {...cardProps}
                whileHover={cert.credentialUrl ? { y: -4, scale: 1.01 } : undefined}
                transition={cert.credentialUrl ? { duration: 0.25 } : undefined}
                className="relative group overflow-hidden rounded-2xl border border-white/10 bg-overlay/40 backdrop-blur-lg hover:border-accent/50 transition"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  <div className="aspect-[4/3] bg-canvas/40 overflow-hidden">
                    <img
                      src={certificateImage}
                      alt={cert.imageAlt || cert.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                      <Award className="text-accent" size={24} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-1">
                        {cert.name}
                      </h3>
                      <p className="text-text-secondary text-sm mb-2">
                        {cert.issuer}
                      </p>
                      {cert.description && (
                        <p className="text-text-secondary text-sm mb-3">
                          {cert.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-accent text-xs font-mono">
                          View credential →
                        </p>

                        {cert.pdfUrl && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-accent/20 bg-accent/10 px-2 py-1 text-[11px] font-semibold text-accent">
                            <FileText size={12} /> PDF available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {cert.pdfUrl && (
                    <div className="px-5 pb-5">
                      <a
                        href={cert.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-canvas/40 px-4 py-2 text-sm font-medium text-text-primary transition hover:border-accent/50 hover:text-accent"
                      >
                        <FileText size={16} /> Open PDF
                      </a>
                    </div>
                  )}
                </div>
              </CardTag>
              );
            })}
          </div>
        )}

        {/* Animated HR Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-20 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
        />
      </div>
    </section>
  );
}

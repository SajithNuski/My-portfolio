import React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchCertificates } from "../api/index.js";
import { Award } from "lucide-react";

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
            {certificates.map((cert) => (
              <div key={cert._id} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-blue/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative bg-overlay/40 backdrop-blur-lg border border-white/10 rounded-lg p-6 hover:border-accent/50 transition flex items-start gap-4 hover:scale-105"
                >
                  <Award
                    className="text-accent flex-shrink-0 group-hover:scale-110 transition"
                    size={28}
                  />
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">
                      {cert.name}
                    </h3>
                    <p className="text-text-secondary text-sm">{cert.issuer}</p>
                    <p className="text-accent text-xs font-mono mt-2">
                      View credential →
                    </p>
                  </div>
                </a>
              </div>
            ))}
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

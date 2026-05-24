import React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchExperience } from "../api/index.js";
import { Briefcase } from "lucide-react";

export default function Experience() {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperience()
      .then((res) => {
        setExperience(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch experience:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold font-head text-text-primary mb-12 text-center">
          Experience
        </h2>

        {loading ? (
          <p className="text-center text-text-secondary">
            Loading experience...
          </p>
        ) : (
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp._id} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-blue/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-overlay/40 backdrop-blur-lg border border-white/10 rounded-lg p-6 hover:border-accent/50 transition group-hover:scale-105">
                  {/* Mac-style traffic light buttons in the top-left corner */}
                  <div
                    className="absolute top-3 left-3 flex items-center gap-2 z-10"
                    aria-hidden
                  >
                    <span className="w-3 h-3 rounded-full bg-red-500 border border-black/10 shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black/10 shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-green-400 border border-black/10 shadow-sm" />
                  </div>
                  <div className="flex items-start gap-4 pl-8 pt-2">
                    <Briefcase className="text-accent mt-1" size={24} />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary">
                        {exp.role}
                      </h3>
                      <p className="text-accent font-semibold">
                        {exp.company}
                        {exp.platform && ` • ${exp.platform}`}
                      </p>
                      <p className="text-text-secondary text-sm">
                        {exp.startDate} — {exp.endDate}
                      </p>
                      {exp.badge && (
                        <p className="text-accent text-sm font-mono mt-2">
                          {exp.badge}
                        </p>
                      )}
                      {exp.bullets && (
                        <ul className="mt-4 space-y-2">
                          {exp.bullets.map((bullet, idx) => (
                            <li
                              key={idx}
                              className="text-text-secondary text-sm flex items-start gap-2"
                            >
                              <span className="text-accent mt-1">▸</span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
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

import React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchExperience } from "../api/index.js";
import FiverrLogo from "../assets/fiverr-logo.svg";

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
              <motion.article
                key={exp._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="relative bg-overlay/40 backdrop-blur-md border border-white/8 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-transform duration-300 transform-gpu group-hover:scale-[1.02]">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center w-16 flex-shrink-0">
                      <motion.div
                        className="flex items-center justify-center shadow-sm"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        whileHover={{ scale: 1.06, rotate: 6 }}
                      >
                        <img
                          src={FiverrLogo}
                          alt="Fiverr"
                          className="w-12 h-12 md:w-14 md:h-14 object-contain"
                        />
                      </motion.div>
                      <div className="flex-1 w-1 mt-3 bg-gradient-to-b from-accent to-blue rounded-full opacity-60" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-xl md:text-2xl font-bold text-text-primary">
                          {exp.role}
                        </h3>
                        <div className="hidden sm:flex items-center gap-3">
                          <p className="text-text-secondary text-sm">
                            {exp.startDate} — {exp.endDate}
                          </p>
                        </div>
                      </div>

                      <div className="mt-1 flex items-center gap-3">
                        <p className="text-accent font-semibold">
                          {exp.company}
                          {exp.platform && ` • ${exp.platform}`}
                        </p>
                        {exp.badge && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-mono bg-white/3 rounded-md text-accent">
                            {exp.badge}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 sm:hidden">
                        <p className="text-text-secondary text-sm">
                          {exp.startDate} — {exp.endDate}
                        </p>
                      </div>

                      {exp.bullets && (
                        <motion.ul
                          className="mt-4 space-y-3"
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.08 } },
                          }}
                        >
                          {exp.bullets.map((bullet, idx) => (
                            <motion.li
                              key={idx}
                              className="flex items-start gap-3"
                              variants={{
                                hidden: { opacity: 0, x: -6 },
                                visible: {
                                  opacity: 1,
                                  x: 0,
                                  transition: { duration: 0.28 },
                                },
                              }}
                            >
                              <motion.span
                                className="w-2 h-2 mt-2 rounded-full bg-accent flex-shrink-0"
                                whileHover={{ scale: 1.3 }}
                              />
                              <span className="text-text-secondary text-sm">
                                {bullet}
                              </span>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
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

import React from "react";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchHero } from "../api/index.js";
import profileImg from "../assets/nuski.png";

export default function Hero() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const fiverrLogo = "https://cdn.simpleicons.org/fiverr/1DBF73";

  useEffect(() => {
    fetchHero()
      .then((res) => {
        setHero(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch hero:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-text-secondary">
        Loading...
      </div>
    );
  if (!hero) return null;

  return (
    <section className="min-h-screen flex items-center justify-center bg-transparent pt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-left md:text-left">
            {/* Greeting */}
            <p className="text-accent font-mono text-sm tracking-widest mb-4">
              {hero.greeting}
            </p>

            {/* Name */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-head text-text-primary mb-4 leading-tight">
              {hero.name}
            </h1>

            {/* Title */}
            <p className="text-xl md:text-2xl text-text-secondary font-head mb-6">
              {hero.title}
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-text-secondary mb-8 max-w-xl">
              {hero.description}
            </p>

            {/* Fiverr Highlight Card */}
            <div className="relative group mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/15 to-blue/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-overlay/40 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-accent/50 transition group-hover:scale-[1.01]">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-canvas/70 border border-white/10 flex items-center justify-center shadow-lg">
                    <img
                      src={fiverrLogo}
                      alt="Fiverr logo"
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm uppercase tracking-[0.2em]">
                      Fiverr Seller
                    </p>
                    <h3 className="text-2xl font-bold text-text-primary">
                      Level 2 Seller
                    </h3>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-canvas/30 p-4">
                  <div className="flex flex-wrap items-center gap-6">
                    {hero.stats?.map((stat, idx) => (
                      <div key={idx} className="min-w-[140px]">
                        <p className="text-text-secondary text-sm">
                          {stat.label}
                        </p>
                        <p className="text-xl font-bold text-accent mt-2">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mb-12">
              <button className="px-8 py-3 bg-accent text-canvas font-bold rounded-lg hover:bg-accent-hover transition flex items-center justify-center gap-2">
                {hero.ctaPrimaryText} <ArrowRight size={18} />
              </button>
              <button className="px-8 py-3 bg-overlay/40 backdrop-blur-lg border border-white/10 text-accent font-bold rounded-lg hover:border-accent/50 transition">
                {hero.ctaSecondaryText}
              </button>
            </div>

            {/* Social Links */}
            <div className="flex gap-6">
              {hero.socialLinks?.github && (
                <a
                  href={hero.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent transition"
                >
                  <Github size={24} />
                </a>
              )}
              {hero.socialLinks?.linkedin && (
                <a
                  href={hero.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent transition"
                >
                  <Linkedin size={24} />
                </a>
              )}
              {hero.socialLinks?.email && (
                <a
                  href={`mailto:${hero.socialLinks.email}`}
                  className="text-text-secondary hover:text-accent transition"
                >
                  <Mail size={24} />
                </a>
              )}
            </div>
          </div>

          {/* Right Column - Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            className="flex justify-center items-center group"
          >
            <div className="relative w-full max-w-xs lg:max-w-sm aspect-square transition-transform duration-500 group-hover:-rotate-1">
              {/* Animated Background Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/20 via-blue/5 to-accent/10 blur-3xl opacity-60 -z-10"></div>

              {/* Unique Green Border with Animated Corners */}
              <div className="absolute inset-0 rounded-3xl border-2 border-accent overflow-hidden">
                {/* Animated border glow effect */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "inset 0 0 20px rgba(63, 185, 80, 0.3), 0 0 30px rgba(63, 185, 80, 0.2)",
                      "inset 0 0 30px rgba(63, 185, 80, 0.5), 0 0 50px rgba(63, 185, 80, 0.3)",
                      "inset 0 0 20px rgba(63, 185, 80, 0.3), 0 0 30px rgba(63, 185, 80, 0.2)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-3xl bg-canvas/95 backdrop-blur-xl border border-accent/30"
                />
              </div>

              {/* Image Container */}
              <div className="absolute inset-1 rounded-3xl overflow-hidden">
                <img
                  src={profileImg}
                  alt="Mohamed Sajith Nuski"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                />
              </div>

              {/* Corner Accent Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-3 -right-3 w-6 h-6 border-2 border-accent rounded-lg"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-3 -left-3 w-6 h-6 border-2 border-blue/50 rounded-lg"
              />

              {/* Floating Geometric Elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 -left-8 w-8 h-8 bg-accent/20 rounded-lg border border-accent/50 backdrop-blur"
              />
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  x: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -right-6 w-6 h-6 bg-blue/20 rounded-full border border-blue/50 backdrop-blur"
              />

              {/* Shine Effect */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-1 rounded-3xl bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none"
              />
            </div>
          </motion.div>
        </div>

        {/* Animated HR Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-20 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full max-w-4xl mx-auto"
        />
      </div>
    </section>
  );
}

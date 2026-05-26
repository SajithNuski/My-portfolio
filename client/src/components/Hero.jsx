import React, { useRef } from "react";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchHero } from "../api/index.js";
import FiverrCard from "./FiverrCard.jsx";
import profileImg from "../assets/nuski1.png";

export default function Hero() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);
  const glitchTimerRef = useRef(null);

  function renderHighlightedTitle(title) {
    if (!title || typeof title !== "string") return title;

    const targets = [
      { text: "Creative Developer", className: "text-accent" },
      { text: "Digital Experience Designer", className: "text-blue" },
      { text: "Creative Designer", className: "text-pink" },
    ];

    const parts = [];
    let cursor = 0;
    while (cursor < title.length) {
      // find earliest next match
      let nextIndex = -1;
      let nextTarget = null;
      for (const t of targets) {
        const idx = title.indexOf(t.text, cursor);
        if (idx !== -1 && (nextIndex === -1 || idx < nextIndex)) {
          nextIndex = idx;
          nextTarget = t;
        }
      }

      if (nextIndex === -1) {
        parts.push(title.slice(cursor));
        break;
      }

      if (nextIndex > cursor) parts.push(title.slice(cursor, nextIndex));

      parts.push(
        React.createElement(
          "span",
          { className: nextTarget.className, key: nextIndex },
          nextTarget.text,
        ),
      );

      cursor = nextIndex + nextTarget.text.length;
    }

    return parts.map((p, i) => (typeof p === "string" ? p : p));
  }
  const viewWorkLink = "https://www.fiverr.com/s/gD055xE";
  const githubProfileLink = "https://github.com/SajithNuski";
  const linkedinProfileLink =
    "https://www.linkedin.com/in/sajith-nuski?utm_source=share_via&utm_content=profile&utm_medium=member_android";
  const emailComposeLink =
    "https://mail.google.com/mail/?view=cm&fs=1&to=sajithnuski878@gmail.com";

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

  useEffect(() => {
    return () => {
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, []);

  const triggerGlitch = () => {
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    setGlitchActive(true);
    glitchTimerRef.current = setTimeout(() => setGlitchActive(false), 420);
  };

  const stopGlitch = () => {
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    setGlitchActive(false);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-text-secondary">
        Loading...
      </div>
    );
  if (!hero) return null;

  return (
    <section className="min-h-screen flex items-center justify-center bg-transparent pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Title with highlighted roles */}
            <p className="text-xl md:text-2xl text-text-secondary font-head mb-6">
              {renderHighlightedTitle(hero.title)}
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-text-secondary mb-8 max-w-xl">
              {hero.description}
            </p>

            <div className="mb-12 flex justify-center md:justify-start">
              <FiverrCard />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mb-12">
              <button
                type="button"
                onClick={() =>
                  window.open(viewWorkLink, "_blank", "noopener,noreferrer")
                }
                className="px-8 py-3 bg-accent text-canvas font-bold rounded-lg hover:bg-accent-hover transition flex items-center justify-center gap-2"
              >
                View My Profile <ArrowRight size={18} />
              </button>
              <button className="px-8 py-3 bg-overlay/40 backdrop-blur-lg border border-white/10 text-accent font-bold rounded-lg hover:border-accent/50 transition">
                {hero.ctaSecondaryText}
              </button>
            </div>

            {/* Social Links */}
            <div className="flex gap-6">
              <a
                href={githubProfileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent transition"
              >
                <Github size={24} />
              </a>
              <a
                href={linkedinProfileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent transition"
              >
                <Linkedin size={24} />
              </a>
              <a
                href={emailComposeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent transition"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Right Column - Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center items-center group"
          >
            <div
              className="profile-container relative w-full max-w-xs lg:max-w-sm aspect-square rounded-3xl"
              style={{ "--glitch-active": glitchActive ? 1 : 0 }}
              onMouseEnter={triggerGlitch}
              onMouseLeave={stopGlitch}
            >
              <div className="profile-frame absolute inset-0 rounded-3xl" />
              <div
                className="profile-image-wrap absolute inset-1 rounded-3xl overflow-hidden"
                style={{ "--profile-image": `url(${profileImg})` }}
              >
                <div className="profile-glitch-layer" aria-hidden="true" />
                <img
                  src={profileImg}
                  alt="Mohamed Sajith Nuski"
                  className="profile-image w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animated HR Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-20 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full max-w-3xl mx-auto"
        />
      </div>
    </section>
  );
}

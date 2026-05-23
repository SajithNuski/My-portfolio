import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code, Palette, Zap, Users } from "lucide-react";

const accentColors = {
  green: { hex: "#4ade80", rgb: "74,222,128" },
  blue: { hex: "#60a5fa", rgb: "96,165,250" },
  pink: { hex: "#f472b6", rgb: "244,114,182" },
  purple: { hex: "#a78bfa", rgb: "167,139,250" },
};

export default function About() {
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      icon: Code,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and efficient code",
      accent: "green",
    },
    {
      icon: Palette,
      title: "Design Focused",
      description: "Creating beautiful and intuitive user interfaces",
      accent: "blue",
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Building fast, responsive web applications",
      accent: "pink",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Working effectively with teams and clients",
      accent: "purple",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="about" className="py-20 bg-transparent">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold font-head text-text-primary mb-4">
            About <span className="text-accent">Me</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            I'm a frontend developer passionate about creating digital
            experiences
          </p>
        </motion.div>

        {/* Main Content with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 mb-16 items-center"
        >
          {/* Text Content */}
          <div>
            <p className="text-text-secondary text-lg leading-relaxed mb-6">
              I'm Mohamed Sajith Nuski, a frontend developer and creative
              technologist based in Sri Lanka. I specialize in building modern,
              responsive web applications using React, Tailwind CSS, and other
              cutting-edge technologies.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed mb-6">
              With over 2+ years of freelancing experience, I've worked with
              clients from around the world to bring their ideas to life. I'm
              currently pursuing a degree in Industrial Information Technology
              at Uva Wellassa University while continuously honing my full-stack
              development skills.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed">
              When I'm not coding, you'll find me exploring new design trends,
              contributing to open-source projects, or sharing knowledge with
              the developer community.
            </p>
          </div>

          {/* Glass Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            {/* Glass effect background */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-blue/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Glass card */}
            <div className="relative bg-overlay/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-accent/50 transition">
              {/* Corner Text Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 z-10 text-right"
              >
                <p className="font-head text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-none tracking-tight text-accent drop-shadow-lg">
                  Developer
                </p>
                <p className="font-head text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-none tracking-tight text-accent/75 -mt-1 drop-shadow-lg">
                  Designer
                </p>
                <p className="font-head text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-none tracking-tight text-accent/50 -mt-1 drop-shadow-lg">
                  Creator
                </p>
              </motion.div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <p className="text-text-primary font-semibold">
                    Frontend Developer
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue rounded-full"></div>
                  <p className="text-text-primary font-semibold">
                    Creative Technologist
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <p className="text-text-primary font-semibold">
                    Fiverr Level 2 Seller
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                <div>
                  <p className="text-3xl font-bold text-accent">2+</p>
                  <p className="text-text-secondary text-sm">
                    Years Experience
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue">50+</p>
                  <p className="text-text-secondary text-sm">
                    Projects Completed
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Modern Diamond Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const accent = accentColors[feature.accent];
            const isActive = activeIndex === idx;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotate: 2, y: -4 }}
                onClick={() => setActiveIndex(idx)}
                className="group relative h-48 cursor-pointer"
                animate={{
                  opacity: isActive ? 1 : 0.75,
                  y: isActive ? -4 : 0,
                }}
                transition={{ duration: 0.25 }}
              >
                {/* Diamond shape background */}
                <div
                  className="absolute inset-0 rounded-2xl blur-lg opacity-0 transition-all duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle, rgba(${accent.rgb}, 0.2) 0%, transparent 70%)`,
                  }}
                ></div>

                {/* Main diamond card - rotated container */}
                <motion.div
                  className="relative w-full h-full perspective"
                  whileHover={{ rotateY: 5 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Diamond content */}
                  <div
                    className="relative bg-gradient-to-br from-overlay/50 via-canvas/40 to-overlay/50 backdrop-blur-xl rounded-2xl p-4 h-full flex flex-col items-center justify-center text-center transition-all duration-300"
                    style={{
                      border: `1px solid rgba(${accent.rgb}, ${isActive ? 0.8 : 0.25})`,
                      boxShadow: isActive
                        ? `0 0 24px rgba(${accent.rgb}, 0.2), inset 0 0 24px rgba(${accent.rgb}, 0.04)`
                        : `0 0 15px rgba(${accent.rgb}, 0.08)`,
                    }}
                  >
                    {/* Icon container with glow */}
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="mb-3 relative"
                    >
                      <div
                        className="absolute inset-0 blur-lg rounded-full w-12 h-12 -z-10"
                        style={{
                          background: `radial-gradient(circle, rgba(${accent.rgb}, 0.22) 0%, transparent 72%)`,
                        }}
                      ></div>
                      <div
                        className="w-12 h-12 rounded-full border flex items-center justify-center group-hover:shadow-lg transition"
                        style={{
                          background: `rgba(${accent.rgb}, 0.12)`,
                          borderColor: `rgba(${accent.rgb}, 0.35)`,
                          color: accent.hex,
                          boxShadow: `0 0 18px rgba(${accent.rgb}, 0.2)`,
                        }}
                      >
                        <Icon
                          className="transition"
                          style={{ color: accent.hex }}
                          size={24}
                        />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3
                      className="text-sm mb-1 transition"
                      style={{
                        color: accent.hex,
                        fontWeight: isActive ? 700 : 600,
                      }}
                    >
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary text-xs leading-tight transition line-clamp-2">
                      {feature.description}
                    </p>

                    {/* Bottom accent line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-12 rounded-full mt-6"
                      style={{
                        background: `linear-gradient(90deg, transparent, rgba(${accent.rgb}, 0.5), transparent)`,
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

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

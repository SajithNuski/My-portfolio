import React from "react";
import { motion } from "framer-motion";
import { Code, Palette, Zap, Users } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Code,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and efficient code",
    },
    {
      icon: Palette,
      title: "Design Focused",
      description: "Creating beautiful and intuitive user interfaces",
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Building fast, responsive web applications",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Working effectively with teams and clients",
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

        {/* Features Grid with Glass Effect */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                {/* Glow background */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-blue/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Glass card */}
                <div className="relative bg-overlay/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-accent/50 transition h-full">
                  <Icon className="text-accent mb-4" size={32} />
                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {feature.description}
                  </p>
                </div>
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

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Welcome() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <section className="min-h-[88vh] flex items-center justify-center bg-transparent relative overflow-hidden py-16">
      <motion.div
        className="text-center z-10 px-6 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={showContent ? "visible" : "hidden"}
      >
        {/* Welcome Text */}
        <motion.p
          variants={itemVariants}
          className="text-accent font-mono text-sm tracking-widest mb-6 uppercase"
        >
          Welcome to my portfolio
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold font-head text-text-primary mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-accent to-blue bg-clip-text text-transparent">
            Let's Create
          </span>
          <br />
          <span>Something Great</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10"
        >
          Full-stack developer crafting elegant digital experiences
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-accent text-canvas font-bold rounded-lg hover:bg-accent-hover transition text-lg shadow-lg shadow-accent/20"
          >
            Explore My Work
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate="animate"
          variants={floatingVariants}
          className="mt-16"
        >
          <p className="text-text-secondary text-sm mb-4">Scroll to continue</p>
          <ArrowDown className="mx-auto text-accent" size={28} />
        </motion.div>

        {/* Animated HR Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-20 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
}

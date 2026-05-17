import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Navbar() {
  const linkVariants = {
    rest: { y: 0 },
    hover: { y: -2 },
  };

  const underlineVariants = {
    rest: { scaleX: 0, opacity: 0 },
    hover: { scaleX: 1, opacity: 1 },
  };

  return (
    <nav className="fixed top-0 w-full bg-overlay/30 backdrop-blur-xl border-b border-white/10 z-50 hover:border-accent/30 transition">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold font-head text-accent">
          Sajith
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex gap-8">
          {[
            { href: "#about", label: "About" },
            { href: "#skills", label: "Skills" },
            { href: "#projects", label: "Projects" },
            { href: "#contact", label: "Contact" },
          ].map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial="rest"
              animate="rest"
              whileHover="hover"
              className="relative text-text-secondary hover:text-accent transition-colors font-medium"
              variants={linkVariants}
            >
              <span className="relative z-10">{item.label}</span>
              <motion.span
                className="absolute left-0 -bottom-1 h-[2px] w-full origin-left rounded-full bg-gradient-to-r from-accent via-blue to-accent"
                variants={underlineVariants}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            </motion.a>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          {[
            { href: "https://github.com", Icon: Github },
            { href: "https://linkedin.com", Icon: Linkedin },
            { href: "mailto:sajith@example.com", Icon: Mail },
          ].map(({ href, Icon }) => (
            <motion.a
              key={href}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                href.startsWith("mailto:") ? undefined : "noopener noreferrer"
              }
              whileHover={{ y: -3, scale: 1.12, rotate: -6 }}
              whileTap={{ scale: 0.95 }}
              className="text-text-secondary hover:text-accent transition-colors"
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </div>
      </div>
    </nav>
  );
}

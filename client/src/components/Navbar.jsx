import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-overlay/30 backdrop-blur-xl border-b border-white/10 z-50 hover:border-accent/30 transition">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold font-head text-accent">
          Sajith
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex gap-8">
          <a
            href="#about"
            className="text-text-secondary hover:text-accent transition"
          >
            About
          </a>
          <a
            href="#skills"
            className="text-text-secondary hover:text-accent transition"
          >
            Skills
          </a>
          <a
            href="#projects"
            className="text-text-secondary hover:text-accent transition"
          >
            Projects
          </a>
          <a
            href="#contact"
            className="text-text-secondary hover:text-accent transition"
          >
            Contact
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent transition"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent transition"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:sajith@example.com"
            className="text-text-secondary hover:text-accent transition"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </nav>
  );
}

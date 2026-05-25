import React from "react";
import AnimatedCodeBackground from "../components/AnimatedCodeBackground.jsx";
import Navbar from "../components/Navbar.jsx";
import Welcome from "../components/Welcome.jsx";
import About from "../components/About.jsx";
import Hero from "../components/Hero.jsx";
import Skills from "../components/Skills.jsx";
import Projects from "../components/Projects.jsx";
import Experience from "../components/Experience.jsx";
import Certificates from "../components/Certificates.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";
import { useState } from "react";

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(true);

  return (
    <div className="relative bg-transparent text-text-primary">
      <AnimatedCodeBackground />
      {showNavbar ? <Navbar /> : null}
      <main className="relative z-10">
        <Welcome />
        <Hero />
        <About />
        <Skills />
        <Projects onModalToggle={setShowNavbar} />
        <Experience />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

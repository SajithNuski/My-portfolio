import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const navRef = useRef(null);
  const [isShrunk, setIsShrunk] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [logoBooting, setLogoBooting] = useState(true);
  const [underlineReady, setUnderlineReady] = useState(false);

  const navItems = useMemo(
    () => [
      { href: "#about", id: "about", label: "About", index: "01" },
      { href: "#skills", id: "skills", label: "Skills", index: "02" },
      { href: "#projects", id: "projects", label: "Projects", index: "03" },
      { href: "#contact", id: "contact", label: "Contact", index: "04" },
    ],
    [],
  );

  const githubProfileLink = "https://github.com/SajithNuski";
  const linkedinProfileLink =
    "https://www.linkedin.com/in/sajith-nuski?utm_source=share_via&utm_content=profile&utm_medium=member_android";
  const emailComposeLink =
    "https://mail.google.com/mail/?view=cm&fs=1&to=sajithnuski878@gmail.com";

  const socialLinks = useMemo(
    () => [
      { href: githubProfileLink, label: "GitHub", Icon: Github },
      { href: linkedinProfileLink, label: "LinkedIn", Icon: Linkedin },
      { href: emailComposeLink, label: "Email", Icon: Mail },
    ],
    [emailComposeLink, githubProfileLink, linkedinProfileLink],
  );

  useEffect(() => {
    const onScroll = () => setIsShrunk(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveSection(visible[0].target.id);
      },
      {
        rootMargin: "-35% 0px -50% 0px",
        threshold: [0.2, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [navItems]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLogoBooting(false), 620);
    const raf = window.requestAnimationFrame(() => setUnderlineReady(true));
    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const onOutsidePointer = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", onOutsidePointer);
    document.addEventListener("touchstart", onOutsidePointer, {
      passive: true,
    });

    return () => {
      document.removeEventListener("mousedown", onOutsidePointer);
      document.removeEventListener("touchstart", onOutsidePointer);
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav
      ref={navRef}
      className={`terminal-nav ${isShrunk ? "is-shrunk" : ""}`}
      aria-label="Primary navigation"
    >
      <div className="terminal-nav__inner">
        <div className="terminal-nav__zone terminal-nav__zone--left">
          <Link to="/" className="terminal-logo" aria-label="Go to home">
            <span
              className={`terminal-logo__text ${logoBooting ? "is-booting" : ""}`}
              data-text="SAJITH"
            >
              SAJITH
            </span>
            <span className="terminal-logo__cursor" aria-hidden="true">
              |
            </span>
          </Link>
        </div>

        <div className="terminal-nav__zone terminal-nav__zone--center">
          <ul className="terminal-links has-active" role="list">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`terminal-link ${isActive ? "is-active" : ""} ${underlineReady ? "is-ready" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="terminal-link__index">{item.index}.</span>
                    <span className="terminal-link__label">{item.label}</span>
                    <span className="terminal-link__bar" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="terminal-nav__zone terminal-nav__zone--right">
          <div className="terminal-socials" aria-label="Social links">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="terminal-icon"
                aria-label={label}
              >
                <Icon size={16} />
                <span className="terminal-tooltip" role="tooltip">
                  {label}
                </span>
              </a>
            ))}
          </div>

          <button
            type="button"
            className={`terminal-hamburger ${mobileOpen ? "is-open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`terminal-mobile ${mobileOpen ? "is-open" : ""}`}>
        <ul className="terminal-mobile__links" role="list">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={closeMobile}
                  className={`terminal-mobile__link ${isActive ? "is-active" : ""}`}
                >
                  <span className="terminal-link__index">{item.index}.</span>
                  <span className="terminal-link__label">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <div className="terminal-mobile__socials">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={`mobile-${label}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-icon"
              aria-label={label}
            >
              <Icon size={16} />
              <span className="terminal-tooltip" role="tooltip">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

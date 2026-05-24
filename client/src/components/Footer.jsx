import React from "react";

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-white/10 py-8 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-text-secondary mb-2">
          © 2025 Mohamed Sajith Nuski. All rights reserved.
        </p>
        <p className="text-text-muted text-sm">
          Designed & built with React, Tailwind, and MongoDB
        </p>
      </div>
    </footer>
  );
}

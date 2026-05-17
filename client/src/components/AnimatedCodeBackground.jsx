import React, { useMemo } from "react";
import { motion } from "framer-motion";

const codeSnippets = [
  "const result = data.map(item => item.id);",
  "function App() { return <Home />; }",
  "useEffect(() => fetchData(), []);",
  "if (error) throw new Error('Oops');",
  "return <section className='hero' />;",
  "npm run build",
  "import React from 'react';",
  "setState(prev => !prev);",
  "TypeError: Cannot read properties of null",
  "ReferenceError: x is not defined",
  "SyntaxError: Unexpected token <",
  "UnhandledPromiseRejectionWarning",
  "404 NOT FOUND",
  "ERROR",
];

const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function AnimatedCodeBackground() {
  const items = useMemo(() => {
    return Array.from({ length: 26 }).map((_, index) => {
      const snippet =
        codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      const isError =
        snippet.toLowerCase().includes("error") || snippet.includes("404");
      return {
        id: index,
        text: snippet,
        top: getRandom(4, 96),
        left: getRandom(2, 98),
        rotate: getRandom(-14, 14),
        duration: getRandom(9, 18),
        delay: getRandom(0, 8),
        scale: getRandom(0.85, 1.12),
        opacity: getRandom(0.08, 0.24),
        driftX: getRandom(-18, 18),
        driftY: getRandom(-14, 14),
        isError,
      };
    });
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/95 to-canvas" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(63,185,80,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_30%)]" />

      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.9, x: 0, y: 0 }}
          animate={{
            opacity: [0, item.opacity, item.opacity * 0.8, item.opacity],
            x: [0, item.driftX, item.driftX * -0.5, 0],
            y: [0, item.driftY, item.driftY * -0.5, 0],
            rotate: [
              item.rotate,
              item.rotate + 4,
              item.rotate - 4,
              item.rotate,
            ],
            scale: [item.scale, item.scale + 0.05, item.scale],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
            color: item.isError
              ? "rgba(239, 68, 68, 0.95)"
              : "rgba(34, 197, 94, 0.9)",
            textShadow: item.isError
              ? "0 0 12px rgba(239, 68, 68, 0.35)"
              : "0 0 12px rgba(34, 197, 94, 0.28)",
            opacity: item.opacity,
          }}
          className="absolute whitespace-nowrap font-mono text-[10px] sm:text-xs md:text-sm select-none code-float"
        >
          {item.text}
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)] bg-[length:300%_100%] code-float" />
    </div>
  );
}

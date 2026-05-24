import React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchSkills } from "../api/index.js";

// Symbol mapping for categories
const getCategorySymbol = (category) => {
  const symbolMap = {
    Languages: "{ }",
    Frameworks: "◇",
    Tools: "⚙",
    Frontend: "<>",
    Backend: "⚛",
    Database: "◆",
    Design: "✎",
    Performance: "⚡",
  };
  return symbolMap[category] || "●";
};

// Logo URL mapping for skills
const getSkillLogo = (skillName) => {
  const logoMap = {
    React:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    "React.js":
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    "React Native":
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    "Next.js":
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
    Vue: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
    Angular:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg",
    Tailwind:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    "Tailwind CSS":
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    CSS: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
    CSS3: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
    HTML: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
    HTML5:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
    JavaScript:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
    "JavaScript (ES6+)":
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
    TypeScript:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    Python:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    Java: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
    Node: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    "Node.js":
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    "Node.js (learning)":
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    Express:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
    MongoDB:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
    PostgreSQL:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
    MySQL:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
    Firebase:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
    Git: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
    GitHub:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
    Docker:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
    Figma:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
    Photoshop:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg",
    "VS Code":
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
    Canva:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
    "Adobe Creative Tools":
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg",
  };
  return logoMap[skillName] || null;
};

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills()
      .then((res) => {
        setSkills(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch skills:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="skills" className="py-20 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold font-head text-text-primary mb-12 text-center">
          Skills & Expertise
        </h2>

        {loading ? (
          <p className="text-center text-text-secondary">Loading skills...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skillGroup) => (
              <div key={skillGroup._id} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-blue/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-overlay/40 backdrop-blur-lg border border-white/10 rounded-lg p-6 hover:border-accent/50 transition group-hover:scale-105 h-full">
                  <h3 className="text-xl font-bold text-accent mb-4 font-head">
                    <span className="text-accent/70 mr-2">
                      {getCategorySymbol(skillGroup.category)}
                    </span>
                    {skillGroup.category}
                  </h3>
                  <ul className="space-y-3">
                    {skillGroup.skills?.map((skill, idx) => (
                      <li
                        key={idx}
                        className="text-base font-bold flex items-center gap-3 text-text-primary"
                      >
                        {getSkillLogo(skill.name) && (
                          <img
                            src={getSkillLogo(skill.name)}
                            alt={skill.name}
                            className="w-8 h-8 object-contain flex-shrink-0"
                          />
                        )}
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

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

import mongoose from "mongoose";
import dotenv from "dotenv";
import Hero from "./models/Hero.js";
import Project from "./models/Project.js";
import Skill from "./models/Skill.js";
import Experience from "./models/Experience.js";
import Certificate from "./models/Certificate.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const seedDB = async () => {
  try {
    // Clear existing data
    await Hero.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Certificate.deleteMany({});

    // Seed Hero
    const hero = new Hero({
      greeting: "Hi, I'm",
      name: "Mohamed Sajith Nuski",
      title: "Frontend Developer & Creative Technologist",
      description:
        "I build clean, responsive web experiences — and I design them too. Pursuing a degree in Industrial Information Technology at Uva Wellassa University, while freelancing and sharpening my full-stack skills.",
      availableForWork: true,
      ctaPrimaryText: "View My Work",
      ctaSecondaryText: "Let's Talk",
      stats: [
        { label: "Years freelancing", value: "3+" },
        { label: "Fiverr Seller", value: "Lv2" },
        { label: "Certificates", value: "5+" },
        { label: "Clients served", value: "🌍" },
      ],
      socialLinks: {
        github: "https://github.com/YOUR_USERNAME",
        linkedin: "https://www.linkedin.com/in/sajith-nuski",
        fiverr: "https://www.fiverr.com/s/jj9dW3L",
        email: "sajithnuski878@gmail.com",
      },
    });
    await hero.save();
    console.log("✅ Hero seeded");

    // Seed Projects
    const projects = [
      {
        title: "SplitMate — Expense Management App",
        description:
          "A Java application to manage shared expenses among roommates with fair bill splitting.",
        bullets: [
          "Built with core Java OOP — classes, objects, inheritance, file handling",
          "Expense tracking, bill splitting, and running balance calculation",
          "Persistent data storage using Java file I/O",
        ],
        techStack: ["Java", "OOP", "File I/O"],
        githubUrl: "",
        liveUrl: "",
        featured: true,
        order: 1,
      },
      {
        title: "Yoga Class Website",
        description:
          "A fully responsive website for a yoga studio, focused on UX and mobile responsiveness.",
        bullets: [
          "Responsive layout across all screen sizes",
          "Backend integration in progress with Node.js and MySQL",
        ],
        techStack: ["HTML", "CSS", "JavaScript", "Node.js", "MySQL"],
        githubUrl: "",
        liveUrl: "",
        featured: false,
        order: 2,
      },
    ];
    await Project.insertMany(projects);
    console.log("✅ Projects seeded");

    // Seed Skills
    const skills = [
      {
        category: "Languages",
        icon: "code",
        skills: [
          { name: "JavaScript (ES6+)", primary: true },
          { name: "HTML5", primary: true },
          { name: "CSS3", primary: true },
          { name: "Java", primary: false },
          { name: "Python", primary: false },
        ],
        order: 1,
      },
      {
        category: "Frameworks",
        icon: "layers",
        skills: [
          { name: "React.js", primary: true },
          { name: "Node.js (learning)", primary: false },
        ],
        order: 2,
      },
      {
        category: "Tools",
        icon: "wrench",
        skills: [
          { name: "Git", primary: true },
          { name: "GitHub", primary: true },
          { name: "VS Code", primary: false },
          { name: "MySQL", primary: false },
          { name: "Canva", primary: false },
          { name: "Adobe Creative Tools", primary: false },
        ],
        order: 3,
      },
    ];
    await Skill.insertMany(skills);
    console.log("✅ Skills seeded");

    // Seed Experience
    const experiences = [
      {
        role: "Freelance Web Developer & Graphic Designer",
        company: "Fiverr",
        platform: "Remote",
        location: "Sri Lanka",
        startDate: "May 2023",
        endDate: "Present",
        current: true,
        bullets: [
          "Delivered web design and graphic design solutions to international clients",
          "Built and customized websites based on client briefs and requirements",
          "Designed branding materials, posters, and marketing content for businesses",
          "Managed full project lifecycle from onboarding through revisions to delivery",
          "Achieved Level 2 Seller status through consistent client satisfaction",
        ],
        badge: "Level 2 Seller",
        order: 1,
      },
    ];
    await Experience.insertMany(experiences);
    console.log("✅ Experience seeded");

    // Seed Certificates
    const certificates = [
      {
        name: "MS Club Membership Certificate",
        issuer: "MS Club · Uva Wellassa University",
        description:
          "Membership certificate awarded for active participation in MS Club activities and innovation initiatives.",
        icon: "🎓",
        imageAlt: "MS Club membership certificate for Mohamed Sajith Nuski",
        pdfUrl: "",
        credentialUrl: "",
        order: 1,
      },
      {
        name: "Web Design for Beginners",
        issuer: "University of Moratuwa",
        icon: "🎓",
        order: 2,
      },
      {
        name: "Web Development",
        issuer: "University of Leeds",
        icon: "🎓",
        order: 3,
      },
      {
        name: "Mastering the GitHub Student Developer Pack",
        issuer: "Microsoft Student Ambassadors · Imagine Cup",
        icon: "🎓",
        order: 4,
      },
      {
        name: "Python Development & Programming Fundamentals",
        issuer: "Udemy",
        icon: "🎓",
        order: 5,
      },
      {
        name: "Fundamentals of Digital Marketing",
        issuer: "Google",
        icon: "🎓",
        order: 6,
      },
    ];
    await Certificate.insertMany(certificates);
    console.log("✅ Certificates seeded");

    console.log("🎉 Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

connectDB().then(() => seedDB());

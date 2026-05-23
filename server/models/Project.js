import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectNumber: { type: String, default: "01" },
  title: { type: String, required: true },
  category: { type: String, default: "FULL-STACK" },
  accent: {
    type: String,
    enum: ["green", "blue", "pink", "purple"],
    default: "green",
  },
  status: {
    type: String,
    enum: ["LIVE", "IN DEV", "ARCHIVED"],
    default: "LIVE",
  },
  shortDescription: String,
  fullDescription: String,
  cardTags: [String],
  allTags: [String],
  features: [String],
  stars: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  thumbnail: String,
  description: String,
  longDescription: String,
  type: String,
  platform: String,
  country: String,
  bullets: [String],
  techStack: [String],
  githubUrl: String,
  liveUrl: String,
  imageUrl: String,
  imageAlt: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Project", projectSchema);

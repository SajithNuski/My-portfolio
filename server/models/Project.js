import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
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

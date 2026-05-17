import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  platform: String,
  location: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  bullets: [String],
  badge: String,
  order: Number,
});

export default mongoose.model("Experience", experienceSchema);

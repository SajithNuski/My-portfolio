import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
  greeting: String,
  name: String,
  title: String,
  description: String,
  availableForWork: Boolean,
  ctaPrimaryText: String,
  ctaSecondaryText: String,
  stats: [
    {
      label: String,
      value: String,
    },
  ],
  socialLinks: {
    github: String,
    linkedin: String,
    fiverr: String,
    email: String,
  },
});

export default mongoose.model("Hero", heroSchema);

import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  // legacy/title
  name: String,
  title: String,
  // issuer and optional logo
  issuer: String,
  issuerLogo: String,
  // descriptions
  description: String,
  icon: String,
  // image fields (legacy and new)
  imageUrl: String,
  image: String,
  imageAlt: String,
  // credential / verification
  pdfUrl: String,
  credentialUrl: String,
  certificateUrl: String,
  credentialId: String,
  completedDate: String,
  verified: { type: Boolean, default: false },
  // metadata
  skills: [String],
  accent: String,
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
});

export default mongoose.model("Certificate", certificateSchema);

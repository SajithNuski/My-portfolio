import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  name: String,
  issuer: String,
  description: String,
  icon: String,
  imageUrl: String,
  imageAlt: String,
  pdfUrl: String,
  credentialUrl: String,
  order: Number,
});

export default mongoose.model("Certificate", certificateSchema);

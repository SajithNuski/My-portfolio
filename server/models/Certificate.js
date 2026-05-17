import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  name: String,
  issuer: String,
  icon: String,
  credentialUrl: String,
  order: Number,
});

export default mongoose.model("Certificate", certificateSchema);

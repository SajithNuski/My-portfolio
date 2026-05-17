import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  category: String,
  icon: String,
  skills: [
    {
      name: String,
      primary: Boolean,
    },
  ],
  order: Number,
});

export default mongoose.model("Skill", skillSchema);

import Experience from "../models/Experience.js";

export const getExperience = async (req, res) => {
  try {
    const experience = await Experience.find().sort({ order: 1 });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createExperience = async (req, res) => {
  try {
    const experience = new Experience(req.body);
    await experience.save();
    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: "Experience deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

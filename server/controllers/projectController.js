import Project from "../models/Project.js";

const normalizeProjectPayload = (payload = {}) => {
  const normalized = { ...payload };
  const accent = String(normalized.accent || "green")
    .trim()
    .toLowerCase();

  normalized.accent = ["green", "blue", "pink", "purple"].includes(accent)
    ? accent
    : "green";

  if (normalized.status) {
    const status = String(normalized.status).trim().toUpperCase();
    normalized.status = ["LIVE", "IN DEV", "ARCHIVED"].includes(status)
      ? status
      : "LIVE";
  }

  if (normalized.shortDescription && !normalized.description) {
    normalized.description = normalized.shortDescription;
  }
  if (normalized.description && !normalized.shortDescription) {
    normalized.shortDescription = normalized.description;
  }

  if (normalized.fullDescription && !normalized.longDescription) {
    normalized.longDescription = normalized.fullDescription;
  }
  if (normalized.longDescription && !normalized.fullDescription) {
    normalized.fullDescription = normalized.longDescription;
  }

  if (normalized.thumbnail && !normalized.imageUrl) {
    normalized.imageUrl = normalized.thumbnail;
  }
  if (normalized.imageUrl && !normalized.thumbnail) {
    normalized.thumbnail = normalized.imageUrl;
  }

  if (
    typeof normalized.visible === "boolean" &&
    typeof normalized.featured !== "boolean"
  ) {
    normalized.featured = normalized.visible;
  }
  if (
    typeof normalized.featured === "boolean" &&
    typeof normalized.visible !== "boolean"
  ) {
    normalized.visible = normalized.featured;
  }

  if (
    !Array.isArray(normalized.features) &&
    Array.isArray(normalized.bullets)
  ) {
    normalized.features = normalized.bullets;
  }
  if (
    !Array.isArray(normalized.bullets) &&
    Array.isArray(normalized.features)
  ) {
    normalized.bullets = normalized.features;
  }

  if (
    !Array.isArray(normalized.allTags) &&
    Array.isArray(normalized.techStack)
  ) {
    normalized.allTags = normalized.techStack;
  }
  if (
    !Array.isArray(normalized.techStack) &&
    Array.isArray(normalized.allTags)
  ) {
    normalized.techStack = normalized.allTags;
  }

  if (
    !Array.isArray(normalized.cardTags) &&
    Array.isArray(normalized.allTags)
  ) {
    normalized.cardTags = normalized.allTags.slice(0, 3);
  }

  return normalized;
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const project = new Project(normalizeProjectPayload(req.body));
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      normalizeProjectPayload(req.body),
      {
        new: true,
      },
    );
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleProjectVisibility = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const nextVisible =
      typeof req.body?.visible === "boolean"
        ? req.body.visible
        : !Boolean(project.visible);

    project.visible = nextVisible;
    project.featured = nextVisible;

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderProjects = async (req, res) => {
  try {
    const items = Array.isArray(req.body)
      ? req.body
      : Array.isArray(req.body?.items)
        ? req.body.items
        : [];

    const ops = items
      .filter((entry) => entry?.id)
      .map((entry, index) => ({
        updateOne: {
          filter: { _id: entry.id },
          update: { $set: { order: Number(entry.order ?? index) } },
        },
      }));

    if (ops.length > 0) {
      await Project.bulkWrite(ops);
    }

    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadProjectImageFile = (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No image file uploaded" });
    return;
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/projects/${req.file.filename}`;
  res.status(201).json({ imageUrl });
};

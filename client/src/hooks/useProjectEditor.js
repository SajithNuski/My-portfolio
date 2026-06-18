import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createProject,
  updateProject,
  uploadProjectImage,
} from "../api/index.js";

const DEFAULT_PROJECT = {
  _id: "",
  projectNumber: "01",
  title: "",
  category: "FULL-STACK",
  accent: "green",
  status: "LIVE",
  shortDescription: "",
  fullDescription: "",
  liveUrl: "",
  stars: 0,
  cardTags: [],
  allTags: [],
  features: ["", "", "", ""],
  thumbnail: "",
  displayOrder: 0,
  visible: true,
};

const MAX_TITLE = 60;
const MAX_SHORT = 120;
const MAX_FULL = 600;

function toEditorState(project) {
  const base = { ...DEFAULT_PROJECT, ...(project || {}) };
  const normalizedAccent = String(base.accent || "green")
    .trim()
    .toLowerCase();

  return {
    ...base,
    displayOrder: Number(base.displayOrder ?? base.order ?? 0),
    shortDescription: base.shortDescription || base.description || "",
    fullDescription: base.fullDescription || base.longDescription || "",
    cardTags: Array.isArray(base.cardTags) ? base.cardTags : [],
    allTags: Array.isArray(base.allTags)
      ? base.allTags
      : Array.isArray(base.techStack)
        ? base.techStack
        : [],
    features: Array.isArray(base.features)
      ? [...base.features, "", "", "", ""].slice(0, 4)
      : ["", "", "", ""],
    thumbnail: base.thumbnail || base.imageUrl || "",
    visible:
      typeof base.visible === "boolean" ? base.visible : Boolean(base.featured),
    accent: ["green", "blue", "pink", "purple"].includes(normalizedAccent)
      ? normalizedAccent
      : "green",
    stars: Number(base.stars || 0),
  };
}

function isValidUrl(value) {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_err) {
    return false;
  }
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default function useProjectEditor({ initialProject, onSaved }) {
  const [form, setForm] = useState(toEditorState(initialProject));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [shakeUploadZone, setShakeUploadZone] = useState(false);
  const [liveUrlValid, setLiveUrlValid] = useState(true);
  const firstErrorRef = useRef(null);

  const originalRef = useRef(JSON.stringify(toEditorState(initialProject)));

  useEffect(() => {
    const normalized = toEditorState(initialProject);
    setForm(normalized);
    setErrors({});
    setSaving(false);
    setUploadingImage(false);
    setImageFile(null);
    setImageError("");
    setLiveUrlValid(true);
    originalRef.current = JSON.stringify(normalized);
  }, [initialProject]);

  const isDirty = useMemo(
    () => JSON.stringify(form) !== originalRef.current || Boolean(imageFile),
    [form, imageFile],
  );

  const setField = useCallback((key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }, []);

  const setFeature = useCallback((index, value) => {
    setForm((current) => {
      const next = [...current.features];
      next[index] = value;
      return { ...current, features: next };
    });
  }, []);

  const addTag = useCallback((field, tag) => {
    const clean = String(tag || "").trim();
    if (!clean) return;

    setForm((current) => {
      if (current[field].includes(clean)) {
        return current;
      }
      return { ...current, [field]: [...current[field], clean] };
    });
  }, []);

  const removeTag = useCallback((field, tag) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((item) => item !== tag),
    }));
  }, []);

  const validate = useCallback(() => {
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (form.title.length > MAX_TITLE)
      nextErrors.title = `Max ${MAX_TITLE} characters`;

    if (!form.shortDescription.trim()) {
      nextErrors.shortDescription = "Short description is required";
    }
    if (form.shortDescription.length > MAX_SHORT) {
      nextErrors.shortDescription = `Max ${MAX_SHORT} characters`;
    }

    if (!form.fullDescription.trim()) {
      nextErrors.fullDescription = "Full description is required";
    }
    if (form.fullDescription.length > MAX_FULL) {
      nextErrors.fullDescription = `Max ${MAX_FULL} characters`;
    }

    if (!isValidUrl(form.liveUrl)) {
      nextErrors.liveUrl = "Please provide a valid URL";
    }

    setErrors(nextErrors);
    firstErrorRef.current = Object.keys(nextErrors)[0] || null;
    return Object.keys(nextErrors).length === 0;
  }, [form]);

  const validateLiveUrl = useCallback(() => {
    const valid = isValidUrl(form.liveUrl);
    setLiveUrlValid(valid);
    if (!valid) {
      setErrors((current) => ({
        ...current,
        liveUrl: "Please provide a valid URL",
      }));
    }
  }, [form.liveUrl]);

  const onSelectImage = useCallback(
    (file) => {
      if (!file) return;

      if (!file.type?.startsWith("image/")) {
        setImageError("Only image files are accepted");
        setShakeUploadZone(true);
        window.setTimeout(() => setShakeUploadZone(false), 450);
        window.setTimeout(() => setImageError(""), 3000);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setImageError("File too large (max 5MB)");
        setShakeUploadZone(true);
        window.setTimeout(() => setShakeUploadZone(false), 450);
        window.setTimeout(() => setImageError(""), 3000);
        return;
      }

      setImageError("");
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setField("thumbnail", preview);
    },
    [setField],
  );

  const removeImage = useCallback(() => {
    setImageFile(null);
    setField("thumbnail", "");
  }, [setField]);

  const save = useCallback(async () => {
    if (!validate()) {
      return { ok: false, firstError: firstErrorRef.current };
    }

    setSaving(true);

    try {
      let thumbnailUrl = form.thumbnail;
      if (imageFile) {
        setUploadingImage(true);
        thumbnailUrl = await fileToBase64(imageFile);
      }

      const payload = {
        projectNumber: form.projectNumber || "01",
        title: form.title.trim(),
        category: form.category.trim(),
        accent: String(form.accent || "green")
          .trim()
          .toLowerCase(),
        status: form.status,
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim(),
        description: form.shortDescription.trim(),
        longDescription: form.fullDescription.trim(),
        liveUrl: form.liveUrl.trim(),
        stars: Number(form.stars || 0),
        order: Number(form.displayOrder || 0),
        displayOrder: Number(form.displayOrder || 0),
        visible: Boolean(form.visible),
        featured: Boolean(form.visible),
        cardTags: form.cardTags || [],
        allTags: form.allTags || [],
        features: (form.features || []).map((item) => item.trim()).filter(Boolean),
        techStack: form.allTags || [],
        bullets: (form.features || []).map((item) => item.trim()).filter(Boolean),
        thumbnail: thumbnailUrl || "",
        imageUrl: thumbnailUrl || "",
      };

      const response = form._id
        ? await updateProject(form._id, payload)
        : await createProject(payload);

      const normalized = toEditorState(response.data);
      setForm(normalized);
      originalRef.current = JSON.stringify(normalized);
      setImageFile(null);
      setUploadingImage(false);
      setLiveUrlValid(true);

      if (onSaved) {
        onSaved(response.data, !form._id);
      }

      return { ok: true, data: response.data, isNew: !form._id };
    } catch (err) {
      setUploadingImage(false);
      if (err.response?.status === 413) {
        setImageError("File too large (max 5MB)");
      }
      return {
        ok: false,
        message: err.response?.data?.message || "Failed to save project",
      };
    } finally {
      setSaving(false);
    }
  }, [form, imageFile, onSaved, validate]);

  return {
    form,
    errors,
    saving,
    uploadingImage,
    imageFile,
    imageError,
    shakeUploadZone,
    isDirty,
    liveUrlValid,
    maxLimits: { title: MAX_TITLE, short: MAX_SHORT, full: MAX_FULL },
    setField,
    setFeature,
    addTag,
    removeTag,
    save,
    validateLiveUrl,
    onSelectImage,
    removeImage,
  };
}

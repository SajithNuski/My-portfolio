import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createCertificate,
  updateCertificate,
  uploadCertificateImage,
} from "../api/index.js";

const ACCENTS = ["green", "blue", "pink", "purple"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_LOGO_SIZE = 2 * 1024 * 1024;

const EMPTY_CERTIFICATE = {
  _id: "",
  num: "01",
  title: "",
  name: "",
  description: "",
  icon: "",
  imageUrl: "",
  image: "",
  imageAlt: "",
  pdfUrl: "",
  credentialUrl: "",
  certificateUrl: "",
  credentialId: "",
  completedDate: "",
  skills: [],
  verified: true,
  accent: "green",
  order: 0,
  visible: true,
};

function normalizeSkills(value) {
  return Array.isArray(value)
    ? value
    : String(value || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
}

function normalizeCertificate(certificate) {
  const base = { ...EMPTY_CERTIFICATE, ...(certificate || {}) };
  const title = String(base.title || base.name || "").trim();
  const accentKey = String(base.accent || "green")
    .trim()
    .toLowerCase();

  return {
    ...base,
    title,
    name: base.name || title,
    description: base.description || "",
    icon: base.icon || "",
    imageUrl: base.imageUrl || base.image || "",
    image: base.image || base.imageUrl || "",
    imageAlt: base.imageAlt || "",
    pdfUrl: base.pdfUrl || "",
    credentialUrl: base.credentialUrl || "",
    certificateUrl:
      base.certificateUrl || base.credentialUrl || base.pdfUrl || "",
    credentialId: base.credentialId || "",
    completedDate: base.completedDate || "",
    skills: normalizeSkills(base.skills),
    verified: typeof base.verified === "boolean" ? base.verified : true,
    accent: ACCENTS.includes(accentKey) ? accentKey : "green",
    order: Number(base.order || 0),
    visible: typeof base.visible === "boolean" ? base.visible : true,
  };
}

function isValidHttpUrl(value) {
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

function getOriginalSnapshot(certificate) {
  const normalized = normalizeCertificate(certificate);
  return JSON.stringify(normalized);
}

export default function useCertificateEditor({ initialCertificate, onSaved }) {
  const [form, setForm] = useState(() =>
    normalizeCertificate(initialCertificate),
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageMode, setImageMode] = useState("file");
  const [draftSkill, setDraftSkill] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [urlState, setUrlState] = useState({
    certificateUrl: true,
    credentialUrl: true,
    pdfUrl: true,
  });
  const originalRef = useRef(getOriginalSnapshot(initialCertificate));

  useEffect(() => {
    const normalized = normalizeCertificate(initialCertificate);
    setForm(normalized);
    setErrors({});
    setSaving(false);
    setImageFile(null);
    setImagePreview("");
    setImageMode(normalized.imageUrl ? "url" : "file");
    setDraftSkill("");
    setUrlState({ certificateUrl: true, credentialUrl: true, pdfUrl: true });
    originalRef.current = getOriginalSnapshot(normalized);
  }, [initialCertificate]);

  const isDirty = useMemo(() => {
    const current = getOriginalSnapshot(form);
    return current !== originalRef.current || Boolean(imageFile);
  }, [form, imageFile]);

  const setField = useCallback((key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }, []);

  const addSkill = useCallback((skill) => {
    const clean = String(skill || "").trim();
    if (!clean) return;
    setForm((current) => {
      if (current.skills.includes(clean)) return current;
      return { ...current, skills: [...current.skills, clean] };
    });
    setDraftSkill("");
  }, []);

  const removeSkill = useCallback((skill) => {
    setForm((current) => ({
      ...current,
      skills: current.skills.filter((item) => item !== skill),
    }));
  }, []);

  const validate = useCallback(() => {
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (form.title.length > 80) nextErrors.title = "Max 80 characters";
    if (!form.description.trim())
      nextErrors.description = "Description is required";
    if (form.description.length > 200)
      nextErrors.description = "Max 200 characters";

    if (
      form.completedDate &&
      !/^[A-Za-z]+ \d{4}$/.test(form.completedDate.trim())
    ) {
      nextErrors.completedDate = "Format: Mon YYYY";
    }

    if (!isValidHttpUrl(form.certificateUrl)) {
      nextErrors.certificateUrl = "Enter a valid URL";
    }
    if (!isValidHttpUrl(form.credentialUrl)) {
      nextErrors.credentialUrl = "Enter a valid URL";
    }
    if (!isValidHttpUrl(form.pdfUrl)) {
      nextErrors.pdfUrl = "Enter a valid URL";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form]);

  const validateUrlField = useCallback(
    (field) => {
      setUrlState((current) => ({
        ...current,
        [field]: isValidHttpUrl(form[field]),
      }));
    },
    [form],
  );

  const handleImageFile = useCallback((file) => {
    if (!file) return { ok: false };
    if (!file.type?.startsWith("image/")) {
      return {
        ok: false,
        message: "Only image files accepted",
        sizeError: false,
      };
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return {
        ok: false,
        message: "File too large · Max 5MB",
        sizeError: true,
      };
    }

    const preview = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(preview);
    setImageMode("file");
    setForm((current) => ({ ...current, imageUrl: preview, image: preview }));
    return { ok: true };
  }, []);

  const clearImage = useCallback(() => {
    setImageFile(null);
    setImagePreview("");
    setForm((current) => ({ ...current, imageUrl: "", image: "" }));
  }, []);

  const reset = useCallback(() => {
    const normalized = normalizeCertificate(initialCertificate);
    setForm(normalized);
    setErrors({});
    setImageFile(null);
    setImagePreview("");
    setDraftSkill("");
    setUrlState({ certificateUrl: true, credentialUrl: true, pdfUrl: true });
    originalRef.current = getOriginalSnapshot(normalized);
  }, [initialCertificate]);

  const makeDuplicateDraft = useCallback(() => {
    const copy = normalizeCertificate({
      ...form,
      _id: "",
      id: "",
      order: Number(form.order || 0) + 1,
      title: `Copy of ${form.title || "Untitled Certificate"}`,
      name: `Copy of ${form.name || form.title || "Untitled Certificate"}`,
    });
    originalRef.current = getOriginalSnapshot({});
    setForm(copy);
    setImageFile(null);
    setImagePreview("");
    setDraftSkill("");
    return copy;
  }, [form]);

  const save = useCallback(async () => {
    if (!validate()) {
      return { ok: false, message: "Validation failed" };
    }

    setSaving(true);
    try {
      let imageUrl = form.imageUrl || form.image || "";

      if (imageFile) {
        imageUrl = await fileToBase64(imageFile);
      }

      const { _id, id, issuer, issuerLogo, ...restForm } = form;
      const payload = {
        ...restForm,
        title: String(form.title || form.name || "").trim(),
        name: String(form.name || form.title || "").trim(),
        description: String(form.description || "").trim(),
        icon: String(form.icon || "").trim(),
        imageUrl,
        image: imageUrl,
        imageAlt: String(form.imageAlt || "").trim(),
        pdfUrl: String(form.pdfUrl || "").trim(),
        credentialUrl: String(form.credentialUrl || "").trim(),
        certificateUrl: String(
          form.certificateUrl || form.credentialUrl || form.pdfUrl || "",
        ).trim(),
        credentialId: String(form.credentialId || "").trim(),
        completedDate: String(form.completedDate || "").trim(),
        skills: normalizeSkills(form.skills),
        accent: String(form.accent || "green")
          .trim()
          .toLowerCase(),
        order: Number(form.order || 0),
        visible: Boolean(form.visible),
        verified: Boolean(form.verified),
      };

      const recordId = _id || id || "";
      const response = recordId
        ? await updateCertificate(recordId, payload)
        : await createCertificate(payload);

      const normalized = normalizeCertificate(response.data);
      setForm(normalized);
      setImageFile(null);
      setImagePreview("");
      setSaving(false);
      setLastSavedAt(new Date().toLocaleString());
      originalRef.current = getOriginalSnapshot(normalized);

      if (onSaved) {
        onSaved(normalized, !recordId);
      }

      return { ok: true, data: normalized, isNew: !recordId };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Failed to save certificate",
      };
    } finally {
      setSaving(false);
    }
  }, [form, imageFile, onSaved, validate]);

  return {
    form,
    setForm,
    setField,
    errors,
    saving,
    isDirty,
    imageFile,
    imagePreview: imagePreview || form.imageUrl || form.image || "",
    imageMode,
    setImageMode,
    draftSkill,
    setDraftSkill,
    addSkill,
    removeSkill,
    handleImageFile,
    clearImage,
    validateUrlField,
    reset,
    save,
    makeDuplicateDraft,
    lastSavedAt,
    urlState,
  };
}

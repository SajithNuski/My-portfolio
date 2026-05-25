import mongoose from "mongoose";
import Certificate from "../models/Certificate.js";

const normalizePublicBaseUrl = (baseUrl = "") => {
  const value = String(baseUrl || "").trim();
  if (!value) return "";
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
};

const withPublicUploadUrl = (value, baseUrl) => {
  if (typeof value !== "string") return value;
  const publicBaseUrl = normalizePublicBaseUrl(baseUrl);
  if (!publicBaseUrl) return value;
  return value.replace(
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/uploads\//i,
    `${publicBaseUrl}/uploads/`,
  );
};

const mapCertificatePublicUrls = (certificate, baseUrl) => {
  const doc =
    certificate && typeof certificate.toObject === "function"
      ? certificate.toObject()
      : certificate;
  if (!doc) return doc;

  const imageUrl = withPublicUploadUrl(doc.imageUrl, baseUrl);
  const image = withPublicUploadUrl(doc.image, baseUrl);

  return {
    ...doc,
    imageUrl,
    image,
  };
};

const isValidCertificateId = (id) => mongoose.isValidObjectId(id);

const normalizeCertificatePayload = (payload = {}) => {
  const skills = Array.isArray(payload.skills)
    ? payload.skills
    : String(payload.skills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

  const title = String(payload.title || payload.name || "").trim();
  const issuer = String(payload.issuer || "").trim();
  const imageUrl = String(payload.imageUrl || payload.image || "").trim();
  const certificateUrl = String(
    payload.certificateUrl || payload.credentialUrl || payload.pdfUrl || "",
  ).trim();
  const { _id, id, ...safePayload } = payload;

  return {
    ...safePayload,
    name: String(payload.name || title).trim(),
    title,
    issuer,
    issuerLogo: String(payload.issuerLogo || "").trim(),
    description: String(payload.description || "").trim(),
    icon: String(payload.icon || "").trim(),
    imageUrl,
    image: imageUrl,
    imageAlt: String(payload.imageAlt || "").trim(),
    pdfUrl: String(payload.pdfUrl || "").trim(),
    credentialUrl: String(payload.credentialUrl || "").trim(),
    certificateUrl,
    credentialId: String(payload.credentialId || "").trim(),
    completedDate: String(payload.completedDate || "").trim(),
    verified:
      payload.verified === true ||
      payload.verified === "true" ||
      payload.verified === 1,
    skills,
    accent: String(payload.accent || "green")
      .trim()
      .toLowerCase(),
    order: Number(payload.order ?? 0),
    visible:
      payload.visible === undefined
        ? true
        : payload.visible === true ||
          payload.visible === "true" ||
          payload.visible === 1,
  };
};

export const getCertificates = async (req, res) => {
  try {
    const includeHidden =
      req.query.all === "true" || req.query.includeHidden === "true";
    const filter = includeHidden ? {} : { visible: { $ne: false } };
    const certificates = await Certificate.find(filter).sort({
      order: 1,
      createdAt: 1,
    });
    const publicBaseUrl =
      process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
    res.json(
      certificates.map((certificate) =>
        mapCertificatePublicUrls(certificate, publicBaseUrl),
      ),
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCertificate = async (req, res) => {
  try {
    const certificate = new Certificate(normalizeCertificatePayload(req.body));
    await certificate.save();
    const publicBaseUrl =
      process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
    res.status(201).json(mapCertificatePublicUrls(certificate, publicBaseUrl));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    if (!isValidCertificateId(req.params.id)) {
      return res.status(400).json({ message: "Invalid certificate id" });
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      normalizeCertificatePayload(req.body),
      { new: true },
    );
    const publicBaseUrl =
      process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
    res.json(mapCertificatePublicUrls(certificate, publicBaseUrl));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleCertificateVisibility = async (req, res) => {
  try {
    if (!isValidCertificateId(req.params.id)) {
      return res.status(400).json({ message: "Invalid certificate id" });
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { visible: Boolean(req.body.visible) },
      { new: true },
    );

    const publicBaseUrl =
      process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
    res.json(mapCertificatePublicUrls(certificate, publicBaseUrl));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderCertificates = async (req, res) => {
  try {
    const { items = [] } = req.body;
    const validItems = items.filter((item) => isValidCertificateId(item.id));

    await Promise.all(
      validItems.map((item) =>
        Certificate.findByIdAndUpdate(item.id, {
          order: Number(item.order || 0),
        }),
      ),
    );

    const certificates = await Certificate.find().sort({
      order: 1,
      createdAt: 1,
    });
    const publicBaseUrl =
      process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
    res.json(
      certificates.map((certificate) =>
        mapCertificatePublicUrls(certificate, publicBaseUrl),
      ),
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    if (!isValidCertificateId(req.params.id)) {
      return res.status(400).json({ message: "Invalid certificate id" });
    }

    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: "Certificate deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadCertificateImageFile = (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No image file uploaded" });
    return;
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/certificates/${req.file.filename}`;
  res.status(201).json({ imageUrl });
};

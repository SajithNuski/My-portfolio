import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteCertificate,
  fetchCertificates,
  reorderCertificates,
  toggleCertificateVisibility,
} from "../api/index.js";

const ACCENTS = ["green", "blue", "pink", "purple"];

function normalizeCertificate(certificate, index = 0) {
  const title = String(
    certificate.title || certificate.name || "Untitled Certificate",
  ).trim();
  const accentKey = String(certificate.accent || "")
    .trim()
    .toLowerCase();
  const skills = Array.isArray(certificate.skills)
    ? certificate.skills
    : String(certificate.skills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

  return {
    ...certificate,
    _id: certificate._id || certificate.id || "",
    id: certificate._id || certificate.id || "",
    num:
      certificate.num ||
      (certificate.order != null
        ? String(certificate.order).padStart(2, "0")
        : String(index + 1).padStart(2, "0")),
    title,
    name: certificate.name || title,
    imageUrl: certificate.imageUrl || certificate.image || "",
    image: certificate.image || certificate.imageUrl || "",
    imageAlt: certificate.imageAlt || "",
    description: certificate.description || "",
    icon: certificate.icon || "",
    pdfUrl: certificate.pdfUrl || "",
    credentialUrl: certificate.credentialUrl || "",
    certificateUrl:
      certificate.certificateUrl ||
      certificate.credentialUrl ||
      certificate.pdfUrl ||
      "",
    credentialId: certificate.credentialId || "",
    completedDate: certificate.completedDate || "",
    skills,
    verified: Boolean(certificate.verified),
    accent: ACCENTS.includes(accentKey)
      ? accentKey
      : ACCENTS[index % ACCENTS.length],
    order: Number(certificate.order || index),
    visible:
      typeof certificate.visible === "boolean" ? certificate.visible : true,
  };
}

export function normalizeCertificateRecord(certificate, index = 0) {
  return normalizeCertificate(certificate, index);
}

export default function useCertificateList() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [reordering, setReordering] = useState(false);
  const [toggleLoadingById, setToggleLoadingById] = useState({});

  const loadCertificates = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchCertificates({ all: true });
      const list = Array.isArray(response.data) ? response.data : [];
      setCertificates(
        list.map((certificate, index) =>
          normalizeCertificate(certificate, index),
        ),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load certificates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  const sortedCertificates = useMemo(
    () =>
      [...certificates].sort(
        (left, right) => Number(left.order || 0) - Number(right.order || 0),
      ),
    [certificates],
  );

  const upsertCertificate = useCallback((certificate) => {
    const normalized = normalizeCertificate(certificate);
    if (!normalized._id) {
      return normalized;
    }
    setCertificates((current) => {
      const existingIndex = current.findIndex(
        (item) => item._id === normalized._id,
      );
      if (existingIndex === -1) {
        return [normalized, ...current];
      }
      const next = [...current];
      next[existingIndex] = normalized;
      return next;
    });
    return normalized;
  }, []);

  const removeCertificate = useCallback(async (certificateId) => {
    if (!certificateId) return;
    setDeletingId(certificateId);
    try {
      await deleteCertificate(certificateId);
      setCertificates((current) =>
        current.filter((item) => item._id !== certificateId),
      );
    } finally {
      setDeletingId("");
    }
  }, []);

  const toggleVisibility = useCallback(
    async (certificateId, nextVisible) => {
      if (!certificateId) return;
      setToggleLoadingById((current) => ({
        ...current,
        [certificateId]: true,
      }));
      setCertificates((current) =>
        current.map((item) =>
          item._id === certificateId ? { ...item, visible: nextVisible } : item,
        ),
      );

      try {
        const response = await toggleCertificateVisibility(
          certificateId,
          nextVisible,
        );
        upsertCertificate(response.data);
      } catch (err) {
        await loadCertificates();
        throw err;
      } finally {
        setToggleLoadingById((current) => ({
          ...current,
          [certificateId]: false,
        }));
      }
    },
    [loadCertificates, upsertCertificate],
  );

  const persistReorder = useCallback(
    async (orderedCertificates) => {
      const normalized = orderedCertificates
        .map((certificate, index) => ({
          ...certificate,
          order: index,
        }))
        .filter((certificate) => certificate._id);

      setReordering(true);
      setCertificates(normalized);

      try {
        const response = await reorderCertificates(
          normalized.map((certificate) => ({
            id: certificate._id,
            order: certificate.order,
          })),
        );
        const list = Array.isArray(response.data) ? response.data : normalized;
        setCertificates(
          list.map((certificate, index) =>
            normalizeCertificate(certificate, index),
          ),
        );
      } catch (err) {
        await loadCertificates();
        throw err;
      } finally {
        setReordering(false);
      }
    },
    [loadCertificates],
  );

  return {
    certificates: sortedCertificates,
    loading,
    error,
    deletingId,
    reordering,
    toggleLoadingById,
    loadCertificates,
    upsertCertificate,
    removeCertificate,
    toggleVisibility,
    persistReorder,
    setCertificates,
  };
}

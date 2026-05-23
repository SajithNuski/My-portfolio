import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteProject,
  fetchProjects,
  reorderProjects,
  toggleProjectVisibility,
  updateProject,
} from "../api/index.js";

function normalizeProject(project) {
  const normalizedAccent = String(project.accent || "green")
    .trim()
    .toLowerCase();

  const allTags = Array.isArray(project.allTags)
    ? project.allTags
    : Array.isArray(project.techStack)
      ? project.techStack
      : [];

  const cardTags = Array.isArray(project.cardTags)
    ? project.cardTags
    : allTags.slice(0, 3);

  const features = Array.isArray(project.features)
    ? project.features
    : Array.isArray(project.bullets)
      ? project.bullets
      : ["", "", "", ""];

  return {
    ...project,
    visible:
      typeof project.visible === "boolean"
        ? project.visible
        : Boolean(project.featured),
    thumbnail: project.thumbnail || project.imageUrl || "",
    shortDescription: project.shortDescription || project.description || "",
    fullDescription: project.fullDescription || project.longDescription || "",
    cardTags,
    allTags,
    features: [...features, "", "", "", ""].slice(0, 4),
    projectNumber: project.projectNumber || "01",
    category: project.category || project.type || "FULL-STACK",
    accent: ["green", "blue", "pink", "purple"].includes(normalizedAccent)
      ? normalizedAccent
      : "green",
    status: project.status || "LIVE",
    stars: Number(project.stars || 0),
    order: Number(project.order || 0),
  };
}

export default function useProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggleLoadingById, setToggleLoadingById] = useState({});
  const [deletingId, setDeletingId] = useState("");
  const [reordering, setReordering] = useState(false);

  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) => Number(a.order || 0) - Number(b.order || 0)),
    [projects],
  );

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchProjects();
      const normalized = (response.data || []).map(normalizeProject);
      setProjects(normalized);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const setProjectList = useCallback((nextList) => {
    setProjects(nextList.map(normalizeProject));
  }, []);

  const upsertProject = useCallback((project) => {
    const normalized = normalizeProject(project);
    setProjects((current) => {
      const idx = current.findIndex((item) => item._id === normalized._id);
      if (idx === -1) {
        return [normalized, ...current];
      }
      const next = [...current];
      next[idx] = normalized;
      return next;
    });
  }, []);

  const toggleVisibility = useCallback(
    async (projectId, nextVisible) => {
      const previous = projects;

      setToggleLoadingById((current) => ({ ...current, [projectId]: true }));
      setProjects((current) =>
        current.map((item) =>
          item._id === projectId
            ? { ...item, visible: nextVisible, featured: nextVisible }
            : item,
        ),
      );

      try {
        const response = await toggleProjectVisibility(projectId, nextVisible);
        upsertProject(response.data);
      } catch (_err) {
        try {
          const response = await updateProject(projectId, {
            visible: nextVisible,
            featured: nextVisible,
          });
          upsertProject(response.data);
        } catch (err) {
          setProjects(previous);
          throw err;
        }
      } finally {
        setToggleLoadingById((current) => ({ ...current, [projectId]: false }));
      }
    },
    [projects, upsertProject],
  );

  const removeProject = useCallback(async (projectId) => {
    setDeletingId(projectId);
    try {
      await deleteProject(projectId);
      setProjects((current) =>
        current.filter((item) => item._id !== projectId),
      );
    } finally {
      setDeletingId("");
    }
  }, []);

  const persistReorder = useCallback(
    async (orderedProjects) => {
      const previous = projects;
      const normalized = orderedProjects.map((item, index) => ({
        ...item,
        order: index,
      }));

      setReordering(true);
      setProjects(normalized);

      try {
        await reorderProjects(
          normalized.map((item) => ({
            id: item._id,
            order: item.order,
          })),
        );
      } catch (err) {
        setProjects(previous);
        throw err;
      } finally {
        setReordering(false);
      }
    },
    [projects],
  );

  return {
    projects: sortedProjects,
    loading,
    error,
    deletingId,
    reordering,
    toggleLoadingById,
    loadProjects,
    setProjectList,
    upsertProject,
    toggleVisibility,
    removeProject,
    persistReorder,
  };
}

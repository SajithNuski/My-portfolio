import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectList from "../../components/admin/projects/ProjectList.jsx";
import ProjectEditor from "../../components/admin/projects/ProjectEditor.jsx";
import UnsavedChangesModal from "../../components/admin/projects/UnsavedChangesModal.jsx";
import useProjectList from "../../hooks/useProjectList.js";
import useProjectEditor from "../../hooks/useProjectEditor.js";
import styles from "../../components/admin/projects/AdminProjects.module.css";

const EMPTY_EDITOR_PROJECT = {
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
  visible: true,
  displayOrder: 0,
};

export default function AdminProjects() {
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const [editingProject, setEditingProject] = useState(EMPTY_EDITOR_PROJECT);
  const [editorMode, setEditorMode] = useState("add");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [pendingLeave, setPendingLeave] = useState(null);

  const list = useProjectList();
  const visibleCount = useMemo(
    () => list.projects.filter((item) => item.visible).length,
    [list.projects],
  );

  const editor = useProjectEditor({
    initialProject: editingProject,
    onSaved: (savedProject, isNew) => {
      list.upsertProject(savedProject);
      setNotice("Project saved successfully ✓");
      setError("");
      if (isNew) {
        setView("list");
      }
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("sajith_token");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    if (view !== "editor" || !editor.isDirty) return;

    const onPopState = () => {
      setShowUnsaved(true);
      setPendingLeave(() => () => navigate(-1));
      window.history.pushState(null, "", window.location.href);
    };

    // Keep the user on the editor route and show a custom modal on browser back.
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [view, editor.isDirty, navigate]);

  useEffect(() => {
    if (!showUnsaved) {
      setPendingLeave(null);
    }
  }, [showUnsaved]);

  useEffect(() => {
    const onBeforeUnload = (event) => {
      if (view !== "editor" || !editor.isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [view, editor.isDirty]);

  const openAddEditor = () => {
    setEditorMode("add");
    setEditingProject(EMPTY_EDITOR_PROJECT);
    setView("editor");
    setNotice("");
    setError("");
  };

  const openEditEditor = (project) => {
    setEditorMode("edit");
    setEditingProject(project);
    setView("editor");
    setNotice("");
    setError("");
  };

  const attemptBackToList = () => {
    if (!editor.isDirty) {
      setView("list");
      return;
    }

    setShowUnsaved(true);
    setPendingLeave(() => () => {
      setView("list");
      setShowUnsaved(false);
    });
  };

  const handleDiscard = () => {
    setEditingProject(
      editorMode === "add" ? EMPTY_EDITOR_PROJECT : editingProject,
    );
    setView("list");
    setShowUnsaved(false);
  };

  const handleSave = async () => {
    const result = await editor.save();
    if (!result.ok) {
      setError(
        result.message || "Validation failed. Please check required fields.",
      );
      return;
    }

    setError("");
  };

  const handleToggle = async (id, nextVisible) => {
    setError("");
    try {
      await list.toggleVisibility(id, nextVisible);
      setNotice("Visibility updated");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update visibility");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await list.removeProject(id);
      setNotice("Project deleted");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  const handleReorder = async (reordered) => {
    setError("");
    try {
      await list.persistReorder(reordered);
      setNotice("Project order updated");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reorder projects");
    }
  };

  return (
    <div className={styles.adminProjects}>
      {error ? (
        <div className={`${styles.message} ${styles.errorMessage}`}>
          {error}
        </div>
      ) : null}
      {notice ? <div className={styles.message}>{notice}</div> : null}

      {view === "list" ? (
        <>
          <header className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h1>Projects</h1>
              <p className={styles.subtitle}>
                {list.projects.length} projects · {visibleCount} visible
              </p>
            </div>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={openAddEditor}
            >
              + Add New Project
            </button>
          </header>

          <ProjectList
            projects={list.projects}
            loading={list.loading}
            deletingId={list.deletingId}
            toggleLoadingById={list.toggleLoadingById}
            onToggle={handleToggle}
            onEdit={openEditEditor}
            onDelete={handleDelete}
            onReorder={handleReorder}
            onAdd={openAddEditor}
          />
        </>
      ) : (
        <ProjectEditor
          mode={editorMode}
          editor={editor}
          onBack={attemptBackToList}
          onDiscard={handleDiscard}
          onSave={handleSave}
        />
      )}

      <UnsavedChangesModal
        open={showUnsaved}
        onStay={() => {
          setShowUnsaved(false);
        }}
        onDiscard={() => {
          if (pendingLeave) {
            pendingLeave();
          }
          setShowUnsaved(false);
        }}
      />
    </div>
  );
}

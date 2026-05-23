import React, { useMemo, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LayoutGrid } from "lucide-react";
import ProjectRow from "./ProjectRow.jsx";
import styles from "./AdminProjects.module.css";

export default function ProjectList({
  projects,
  loading,
  deletingId,
  toggleLoadingById,
  onToggle,
  onEdit,
  onDelete,
  onReorder,
  onAdd,
}) {
  const [activeId, setActiveId] = useState("");
  const [overId, setOverId] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const itemIds = useMemo(
    () => projects.map((project) => project._id),
    [projects],
  );

  if (loading) {
    return (
      <div className={styles.listWrapper}>
        <div className={styles.skeletonRow} />
        <div className={styles.skeletonRow} />
        <div className={styles.skeletonRow} />
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <LayoutGrid size={42} />
        </div>
        <h3 className={styles.emptyTitle}>No projects yet</h3>
        <p className={styles.emptySubtitle}>
          Add your first project to get started
        </p>
        <button type="button" className={styles.primaryButton} onClick={onAdd}>
          + Add New Project
        </button>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        setActiveId(String(event.active.id));
      }}
      onDragOver={(event) => {
        setOverId(String(event.over?.id || ""));
      }}
      onDragEnd={(event) => {
        const { active, over } = event;
        setActiveId("");
        setOverId("");

        if (!over || active.id === over.id) return;

        const oldIndex = projects.findIndex((item) => item._id === active.id);
        const newIndex = projects.findIndex((item) => item._id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(projects, oldIndex, newIndex);
        onReorder(reordered);
      }}
      onDragCancel={() => {
        setActiveId("");
        setOverId("");
      }}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div className={styles.listWrapper}>
          {projects.map((project) => (
            <ProjectRow
              key={project._id}
              project={project}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              toggleLoading={Boolean(toggleLoadingById[project._id])}
              deleting={deletingId === project._id}
              showDropIndicator={
                activeId && overId === project._id && activeId !== project._id
              }
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

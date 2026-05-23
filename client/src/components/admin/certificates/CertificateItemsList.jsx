import React, { useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, RotateCw } from "lucide-react";
import CertificateItemCard from "./CertificateItemCard.jsx";

export default function CertificateItemsList({
  certificates,
  loading,
  reordering,
  deletingId,
  toggleLoadingById,
  onSelect,
  onDelete,
  onToggle,
  onReorder,
  onAdd,
  activeId,
}) {
  const [dragActive, setDragActive] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const visibleCount = useMemo(
    () => certificates.filter((item) => item.visible).length,
    [certificates],
  );

  const handleDragStart = () => setDragActive(true);
  const handleDragEnd = (event) => {
    setDragActive(false);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = certificates.findIndex((item) => item._id === active.id);
    const newIndex = certificates.findIndex((item) => item._id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(certificates, oldIndex, newIndex).map(
      (item, index) => ({
        ...item,
        order: index,
      }),
    );
    onReorder(reordered);
  };

  return (
    <aside className="flex h-full min-h-[calc(100vh-128px)] w-full flex-col overflow-hidden rounded-3xl border border-white/8 bg-[#0d1117]/95 shadow-2xl shadow-black/25 backdrop-blur-xl">
      <div className="border-b border-white/7 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-white/35">
              Certificates
            </p>
            <p className="mt-1 text-[11px] text-white/30">
              {certificates.length} total · {visibleCount} visible
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-[#4ade80] px-3.5 py-2 text-sm font-semibold text-[#0d1117] shadow-lg shadow-emerald-500/10"
          >
            <Plus size={16} /> New
          </button>
        </div>
        {dragActive || reordering ? (
          <p className="mt-3 inline-flex items-center gap-2 text-[11px] text-white/35">
            <RotateCw size={12} className="animate-spin" /> Reordering...
          </p>
        ) : null}
      </div>

      <div className="flex-1 overflow-auto px-3 py-3">
        {loading ? (
          <div className="space-y-3 px-2 py-4 text-sm text-white/35">
            Loading certificates...
          </div>
        ) : certificates.length ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={certificates.map((item) => item._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {certificates.map((certificate) => (
                  <CertificateItemCard
                    key={certificate._id}
                    certificate={certificate}
                    active={activeId === certificate._id}
                    onSelect={onSelect}
                    onDelete={onDelete}
                    onToggle={onToggle}
                    deleting={deletingId === certificate._id}
                    toggling={toggleLoadingById[certificate._id]}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center text-sm text-white/35">
            No certificates yet. Add one to get started.
          </div>
        )}
      </div>
    </aside>
  );
}

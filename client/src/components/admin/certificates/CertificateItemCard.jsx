import React, { useState } from "react";
import { Award, GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ACCENT_HEX = {
  green: "#4ade80",
  blue: "#60a5fa",
  pink: "#f472b6",
  purple: "#a78bfa",
};

export default function CertificateItemCard({
  certificate,
  active,
  onSelect,
  onDelete,
  onToggle,
  deleting,
  toggling,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: certificate._id });

  const accentHex = ACCENT_HEX[certificate.accent] || ACCENT_HEX.green;
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async () => {
    if (confirmDelete) {
      await onDelete(certificate._id);
      setConfirmDelete(false);
      return;
    }
    setConfirmDelete(true);
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl border bg-[#0d1117] transition-all duration-200 ${
        active
          ? "border-[#4ade80] bg-[rgba(74,222,128,0.06)]"
          : "border-white/8 hover:border-white/12 hover:bg-white/[0.04]"
      } ${isDragging ? "scale-[1.01] shadow-2xl shadow-black/30" : ""}`}
    >
      {confirmDelete ? (
        <div className="absolute inset-0 z-20 rounded-2xl border border-rose-500/30 bg-[#0d1117]/95 p-4 backdrop-blur-sm">
          <p className="text-sm font-semibold text-white">Delete?</p>
          <p className="mt-1 text-xs text-white/45">
            This will remove the certificate permanently.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg border border-rose-500/50 px-3 py-2 text-xs font-semibold text-rose-300"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/70"
            >
              No
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => onSelect(certificate)}
        className="flex w-full items-start gap-3 p-3 text-left"
      >
        <div className="list-thumb shrink-0 border border-white/10 bg-[#111827]">
          {certificate.imageUrl || certificate.image ? (
            <img
              src={certificate.imageUrl || certificate.image}
              alt={certificate.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="grid h-full w-full place-items-center"
              style={{ background: `${accentHex}14` }}
            >
              <Award size={18} color={accentHex} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`line-clamp-2 text-[13px] font-semibold leading-5 ${active ? "text-[#4ade80]" : "text-[#f1f5f9]"}`}
          >
            {certificate.title || certificate.name || "Untitled Certificate"}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2 pl-1 pt-0.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: accentHex }}
            aria-hidden="true"
          />
          <span
            className={`h-2.5 w-2.5 rounded-full ${certificate.visible ? "bg-emerald-400" : "bg-white/25"}`}
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggle(certificate._id, !certificate.visible);
            }}
            disabled={Boolean(toggling)}
            className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold text-white/45 opacity-0 transition group-hover:opacity-100"
          >
            {certificate.visible ? "Hide" : "Show"}
          </button>
        </div>
      </button>

      <div className="flex items-center justify-between border-t border-white/5 px-3 py-2">
        <button
          type="button"
          className="mx-auto flex items-center gap-2 text-[11px] tracking-[0.18em] text-white/15"
          {...attributes}
          {...listeners}
          ref={setActivatorNodeRef}
          aria-label="Drag to reorder"
        >
          <GripVertical size={14} />
          <span>DRAG</span>
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleDelete();
          }}
          disabled={Boolean(deleting)}
          className="absolute right-3 top-3 rounded-md p-1 text-rose-400/60 opacity-0 transition hover:text-rose-300 group-hover:opacity-100"
          aria-label="Delete certificate"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}

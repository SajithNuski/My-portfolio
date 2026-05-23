import React from "react";

export default function UnsavedChangesModal({ open, onStay, onDiscard }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d1117] p-6 shadow-2xl shadow-black/40">
        <h3 className="text-xl font-bold text-white">Unsaved Changes</h3>
        <p className="mt-2 text-sm text-white/45">
          You have unsaved changes that will be lost.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onStay}
            className="rounded-xl border border-[#4ade80]/40 px-4 py-2 text-sm font-semibold text-[#4ade80]"
          >
            Keep Editing
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="rounded-xl border border-rose-500/40 px-4 py-2 text-sm font-semibold text-rose-300"
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
}

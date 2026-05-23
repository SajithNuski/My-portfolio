import React from "react";
import { RotateCcw, Save } from "lucide-react";

export default function StickyActionBar({
  dirty,
  lastSavedAt,
  saving,
  savedFlash,
  onReset,
  onSave,
}) {
  return (
    <div className="sticky bottom-0 z-10 border-t border-white/7 bg-[#0d1420]/96 px-5 py-3 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 text-[11px] font-mono tracking-[0.08em]">
          {savedFlash ? (
            <span className="text-emerald-400">Saved ✓</span>
          ) : dirty ? (
            <span className="inline-flex items-center gap-2 text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              Unsaved changes
            </span>
          ) : (
            <span className="text-white/35">
              Last saved: {lastSavedAt || "—"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/75 hover:border-white/20"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#4ade80] px-4 py-2 text-sm font-semibold text-[#0d1117] disabled:opacity-60"
          >
            <Save size={14} className={saving ? "animate-spin" : ""} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

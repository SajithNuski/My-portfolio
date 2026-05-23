import React from "react";
import { AlertCircle, Check } from "lucide-react";

export default function ToastManager({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex max-w-[340px] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 rounded-2xl border bg-[#0d1117] px-4 py-3 shadow-2xl shadow-black/30 ${
            toast.type === "error"
              ? "border-rose-500/50"
              : "border-emerald-500/50"
          }`}
        >
          <span className="mt-0.5">
            {toast.type === "error" ? (
              <AlertCircle size={16} className="text-rose-400" />
            ) : (
              <Check size={16} className="text-emerald-400" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-sm text-white">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

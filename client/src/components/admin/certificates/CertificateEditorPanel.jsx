import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Link2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Check,
  Copy,
  Award,
} from "lucide-react";
import CertificateCard from "../../../components/certificates/CertificateCard.jsx";
import StickyActionBar from "./StickyActionBar.jsx";
import { accentColors } from "../../../data/certificates.js";

const ACCENT_OPTIONS = ["green", "blue", "pink", "purple"];

function SectionCard({ label, title, helper, children }) {
  return (
    <section className="rounded-2xl border border-white/7 bg-white/[0.03] p-4 md:p-[18px]">
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/30">
          {label}
        </p>
        {title ? (
          <h3 className="mt-1 text-[15px] font-semibold text-white">{title}</h3>
        ) : null}
        {helper ? <p className="mt-1 text-xs text-white/35">{helper}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Field({ label, helper, error, children, counter }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-[12px] font-medium text-white/55">{label}</span>
        {counter ? (
          <span className="text-[10px] font-mono text-white/30">{counter}</span>
        ) : null}
      </div>
      {children}
      {helper ? (
        <p className="mt-1.5 text-[11px] text-white/35">{helper}</p>
      ) : null}
      {error ? (
        <p className="mt-1.5 text-[11px] text-rose-300">{error}</p>
      ) : null}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={`${props.className || ""} w-full rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2.5 text-[14px] text-[#f1f5f9] placeholder:text-white/20 outline-none transition focus:border-[#4ade80] focus:shadow-[0_0_0_3px_rgba(74,222,128,0.1)]`}
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`${props.className || ""} w-full rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2.5 text-[14px] text-[#f1f5f9] placeholder:text-white/20 outline-none transition focus:border-[#4ade80] focus:shadow-[0_0_0_3px_rgba(74,222,128,0.1)]`}
    />
  );
}

function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/7 bg-black/10 px-3 py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description ? (
          <p className="mt-0.5 text-[11px] text-white/35">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-[#4ade80]" : "bg-white/15"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-lg transition ${checked ? "left-5" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

function IconPreview({ value }) {
  return (
    <div className="grid h-14 w-14 place-items-center rounded-xl border border-white/8 bg-white/[0.04] text-[24px] text-white/70">
      {value || <Award size={22} />}
    </div>
  );
}

function ImageDropZone({
  label,
  helper,
  mode,
  onModeChange,
  preview,
  file,
  onFile,
  onClear,
  alt,
  onAltChange,
  url,
  onUrlChange,
  urlLabel,
  fileLabel,
  fileHelper,
  fileModeLabel,
  urlModeLabel,
  compact = false,
  previewFit = "cover",
  maxHeight = 180,
  error,
  accentHex,
  accentRgb,
  icon,
}) {
  const [dragHover, setDragHover] = useState(false);
  const [inputKey, setInputKey] = useState(0);

  const handleFile = (selected) => {
    if (!selected) return;
    const result = onFile(selected);
    if (!result?.ok) {
      setInputKey((current) => current + 1);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          {helper ? (
            <p className="mt-0.5 text-[11px] text-white/35">{helper}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onModeChange(mode === "file" ? "url" : "file")}
          className="text-[11px] font-medium text-[#4ade80] transition hover:text-white"
        >
          {mode === "file" ? urlModeLabel : fileModeLabel}
        </button>
      </div>

      {mode === "file" ? (
        <div
          className={`group rounded-2xl border-2 border-dashed px-4 py-4 transition ${
            dragHover
              ? "border-[#4ade80] bg-[rgba(74,222,128,0.04)]"
              : "border-white/10 bg-white/[0.03]"
          }`}
          style={preview ? { minHeight: maxHeight } : { minHeight: maxHeight }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragHover(true);
          }}
          onDragLeave={() => setDragHover(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragHover(false);
            handleFile(event.dataTransfer.files?.[0]);
          }}
        >
          {preview ? (
            <div className="space-y-3">
              <img
                src={preview}
                alt={alt || fileLabel || label}
                className="h-[180px] w-full rounded-xl object-cover"
                style={{ maxHeight, objectFit: previewFit }}
              />
              <div className="flex items-center justify-between gap-3 text-[11px] text-white/45">
                <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
                  <span className="font-mono">
                    {file?.name || "Saved image"}
                  </span>
                  {file?.size ? (
                    <span>· {(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onModeChange("url")}
                    className="text-[#4ade80]"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={onClear}
                    className="text-rose-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label className="flex h-full min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl text-center">
              <input
                key={inputKey}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[rgba(74,222,128,0.08)] text-[#4ade80]">
                {icon}
              </span>
              <p className="mt-3 text-sm font-semibold text-white/90">
                Drop certificate image or click to browse
              </p>
              <p className="mt-1 text-[11px] text-white/35">
                JPG, PNG, WebP · Max 5MB
              </p>
            </label>
          )}
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-white/7 bg-white/[0.03] p-4">
          <div className="space-y-3">
            <TextInput
              value={url}
              onChange={(event) => onUrlChange(event.target.value)}
              placeholder={fileHelper}
            />
            {preview ? (
              <img
                src={preview}
                alt={alt || fileLabel || label}
                className="h-[180px] w-full rounded-xl object-cover"
                style={{ maxHeight, objectFit: previewFit }}
              />
            ) : null}
            {onAltChange ? (
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-white/45">
                  Image Alt Text
                </p>
                <TextInput
                  value={alt || ""}
                  onChange={(event) => onAltChange(event.target.value)}
                  placeholder="Certificate image description"
                />
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-3 text-[11px] text-white/45">
              <span className="truncate font-mono">
                {url ? "Using URL source" : "No image set"}
              </span>
              <button
                type="button"
                onClick={() => onModeChange("file")}
                className="text-[#4ade80]"
              >
                Use file upload instead
              </button>
            </div>
          </div>
        </div>
      )}

      {error ? <p className="text-[11px] text-rose-300">{error}</p> : null}
    </div>
  );
}

function CircleAccentPicker({ value, onChange }) {
  const selected = accentColors[value] || accentColors.green;

  return (
    <div className="flex flex-wrap items-end gap-3">
      {ACCENT_OPTIONS.map((accent) => {
        const selectedState = value === accent;
        return (
          <button
            key={accent}
            type="button"
            onClick={() => onChange(accent)}
            className={`flex flex-col items-center gap-2 transition ${selectedState ? "scale-110" : "hover:scale-105"}`}
          >
            <span
              className={`h-11 w-11 rounded-full border-2 transition ${selectedState ? "border-white" : "border-white/10"}`}
              style={{ background: accentColors[accent]?.hex || selected.hex }}
            />
            <span
              className={`text-[11px] capitalize ${selectedState ? "text-white" : "text-white/35"}`}
            >
              {accent}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function normalizeUrl(url) {
  return String(url || "").trim();
}

export default function CertificateEditorPanel({
  certificate,
  editor,
  onDelete,
  onDuplicate,
  onSave,
  savedFlash,
}) {
  const [helpOpen, setHelpOpen] = useState(false);
  const previewAccent = accentColors[editor.form.accent] || accentColors.green;
  const savedPreviewCertificate = useMemo(
    () => ({
      ...editor.form,
      title: editor.form.title || editor.form.name || "Certificate title",
      completedDate: editor.form.completedDate || "Jan 2024",
      certificateUrl:
        editor.form.certificateUrl ||
        editor.form.credentialUrl ||
        editor.form.pdfUrl ||
        "",
      image:
        editor.imagePreview || editor.form.imageUrl || editor.form.image || "",
    }),
    [editor.form, editor.imagePreview],
  );

  const submit = async () => {
    const result = await onSave();
    return result;
  };

  return (
    <div className="flex min-h-[calc(100vh-128px)] flex-1 flex-col overflow-hidden rounded-3xl border border-white/8 bg-[#0d1117]/95 shadow-2xl shadow-black/25 backdrop-blur-xl">
      <header className="border-b border-white/7 px-5 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-bold text-white">Editor</h2>
            <p className="mt-1 text-[12px] text-white/40">
              Editing:{" "}
              {certificate?._id
                ? certificate.title ||
                  certificate.name ||
                  "Untitled Certificate"
                : "New Certificate"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {certificate?._id ? (
              <button
                type="button"
                onClick={() => onDelete(certificate._id)}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 px-3 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/10"
              >
                <Trash2 size={14} /> Delete
              </button>
            ) : null}
            <button
              type="button"
              onClick={onDuplicate}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white/70 hover:border-white/20"
            >
              <Copy size={14} /> Duplicate
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-5 py-5">
        <div className="space-y-3">
          <SectionCard
            label="Basic Info"
            helper="Core certificate identity and copy shown on the card."
          >
            <div className="grid gap-4 md:grid-cols-[80px_minmax(0,1fr)]">
              <Field label="Certificate Number" error={editor.errors.num}>
                <TextInput
                  value={editor.form.num || ""}
                  onChange={(event) =>
                    editor.setField("num", event.target.value)
                  }
                  placeholder="01"
                  maxLength={2}
                  style={{ width: 80 }}
                />
              </Field>
              <Field
                label="Title"
                error={editor.errors.title}
                counter={`${(editor.form.title || "").length}/80`}
              >
                <TextInput
                  value={editor.form.title || ""}
                  onChange={(event) =>
                    editor.setField("title", event.target.value)
                  }
                  placeholder="Meta Front-End Developer"
                  maxLength={80}
                  style={{ fontSize: 18 }}
                />
              </Field>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Name / Display Name" error={editor.errors.name}>
                <TextInput
                  value={editor.form.name || ""}
                  onChange={(event) =>
                    editor.setField("name", event.target.value)
                  }
                  placeholder="Same as title or custom display name"
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field
                label="Description"
                error={editor.errors.description}
                helper="Short summary visible in the editor and stored in the database."
                counter={`${(editor.form.description || "").length}/200`}
              >
                <TextArea
                  rows={3}
                  value={editor.form.description || ""}
                  onChange={(event) =>
                    editor.setField("description", event.target.value)
                  }
                  placeholder="Short description about the certificate"
                  maxLength={200}
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            label="Date & Credential"
            helper="Verification details and external links."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Completed Date"
                error={editor.errors.completedDate}
                helper="Format: Mon YYYY"
              >
                <TextInput
                  value={editor.form.completedDate || ""}
                  onChange={(event) =>
                    editor.setField("completedDate", event.target.value)
                  }
                  placeholder="Jan 2024"
                />
              </Field>
              <Field label="Credential ID" helper="Shown truncated on card">
                <TextInput
                  value={editor.form.credentialId || ""}
                  onChange={(event) =>
                    editor.setField("credentialId", event.target.value)
                  }
                  placeholder="ABC-123-XYZ"
                />
              </Field>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field
                label="Certificate URL"
                error={editor.errors.certificateUrl}
              >
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <TextInput
                      value={editor.form.certificateUrl || ""}
                      onChange={(event) =>
                        editor.setField("certificateUrl", event.target.value)
                      }
                      onBlur={() => editor.validateUrlField("certificateUrl")}
                      placeholder="https://..."
                      className="pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {editor.form.certificateUrl &&
                      editor.urlState.certificateUrl ? (
                        <Check size={15} className="text-emerald-400" />
                      ) : editor.form.certificateUrl ? (
                        <AlertCircle size={15} className="text-rose-400" />
                      ) : (
                        <Link2 size={15} className="text-white/25" />
                      )}
                    </span>
                  </div>
                  {editor.form.certificateUrl ? (
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          editor.form.certificateUrl,
                          "_blank",
                          "noreferrer",
                        )
                      }
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.04] text-white/70 hover:border-[#4ade80]/50"
                    >
                      <ExternalLink size={15} />
                    </button>
                  ) : null}
                </div>
              </Field>
              <Field label="Credential URL" error={editor.errors.credentialUrl}>
                <TextInput
                  value={editor.form.credentialUrl || ""}
                  onChange={(event) =>
                    editor.setField("credentialUrl", event.target.value)
                  }
                  onBlur={() => editor.validateUrlField("credentialUrl")}
                  placeholder="https://..."
                />
              </Field>
              <Field
                label="PDF URL"
                error={editor.errors.pdfUrl}
                helper="Direct PDF link if available"
              >
                <TextInput
                  value={editor.form.pdfUrl || ""}
                  onChange={(event) =>
                    editor.setField("pdfUrl", event.target.value)
                  }
                  onBlur={() => editor.validateUrlField("pdfUrl")}
                  placeholder="https://... or /certificates/file.pdf"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            label="Appearance & Settings"
            helper="Accent colors, visibility, verification and display order."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <Field label="Accent Color">
                  <CircleAccentPicker
                    value={editor.form.accent || "green"}
                    onChange={(next) => editor.setField("accent", next)}
                  />
                </Field>
                <Field label="Order" helper="Sort order in certificates list">
                  <TextInput
                    type="number"
                    value={editor.form.order ?? 0}
                    onChange={(event) =>
                      editor.setField("order", Number(event.target.value))
                    }
                    style={{ width: 100 }}
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <ToggleSwitch
                  checked={Boolean(editor.form.visible)}
                  onChange={(next) => editor.setField("visible", next)}
                  label="Show on portfolio"
                  description="Hidden certificates won't appear on your live site"
                />
                <ToggleSwitch
                  checked={Boolean(editor.form.verified)}
                  onChange={(next) => editor.setField("verified", next)}
                  label="Mark as Verified"
                  description="Shows a pulsing VERIFIED badge on the card"
                />
                <Field
                  label="Icon"
                  helper="Emoji or icon text used in fallbacks"
                >
                  <div className="flex items-center gap-3">
                    <TextInput
                      value={editor.form.icon || ""}
                      onChange={(event) =>
                        editor.setField("icon", event.target.value)
                      }
                      placeholder="🎓"
                    />
                    <IconPreview value={editor.form.icon} />
                  </div>
                </Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            label="Skills · max 3 shown on card"
            helper="All skills are saved, but only the first three appear in the public card."
          >
            <div className="flex gap-2">
              <TextInput
                value={editor.draftSkill}
                onChange={(event) => editor.setDraftSkill(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    editor.addSkill(editor.draftSkill);
                  }
                }}
                placeholder="React"
              />
              <button
                type="button"
                onClick={() => editor.addSkill(editor.draftSkill)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#4ade80] px-4 py-2 text-sm font-semibold text-[#0d1117]"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(editor.form.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(74,222,128,0.1)] px-3 py-1 text-[11px] font-mono text-[#4ade80]"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => editor.removeSkill(skill)}
                    className="text-white/45 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
              {!(editor.form.skills || []).length ? (
                <span className="text-[11px] text-white/35">
                  Add the skills shown on the public card.
                </span>
              ) : null}
            </div>
            {(editor.form.skills || []).length > 3 ? (
              <p className="mt-2 text-[11px] text-amber-300">
                Only first 3 skills shown on card
              </p>
            ) : null}
          </SectionCard>

          <SectionCard
            label="Images"
            helper="Upload the certificate image for the public card."
          >
            <div className="grid gap-5">
              <ImageDropZone
                label="Certificate Image"
                helper="Screenshot or scan of your certificate"
                mode={editor.imageMode}
                onModeChange={editor.setImageMode}
                preview={editor.imagePreview}
                file={editor.imageFile}
                onFile={editor.handleImageFile}
                onClear={editor.clearImage}
                alt={editor.form.imageAlt}
                onAltChange={(next) => editor.setField("imageAlt", next)}
                url={editor.form.imageUrl || editor.form.image || ""}
                onUrlChange={(next) => editor.setField("imageUrl", next)}
                urlLabel="Image URL"
                fileLabel="Certificate Image"
                fileHelper="Paste a direct image URL"
                fileModeLabel="Use URL instead ↓"
                urlModeLabel="Use file upload instead ↑"
                previewFit="cover"
                maxHeight={180}
                error={editor.errors.imageUrl || editor.errors.image}
                accentHex={previewAccent.hex}
                accentRgb={previewAccent.rgb}
                icon={<Upload size={18} />}
              />
            </div>
          </SectionCard>

          <SectionCard
            label="Live Preview"
            helper="Updates in real time as you edit."
          >
            <div className="rounded-[14px] border border-white/5 bg-white/[0.02] p-5 overflow-hidden">
              <div className="mx-auto max-w-[340px] origin-top scale-[0.75]">
                <CertificateCard
                  certificate={savedPreviewCertificate}
                  accent={previewAccent}
                  index={0}
                  revealed
                />
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[10px] text-white/30">
              Live preview — not clickable
            </p>
          </SectionCard>

          <div className="pb-2">
            <button
              type="button"
              onClick={() => setHelpOpen((current) => !current)}
              className="text-[12px] text-white/35 transition hover:text-white/65"
            >
              ? Quick Help
            </button>
            {helpOpen ? (
              <div className="mt-3 rounded-2xl border border-white/7 bg-white/[0.03] p-4 text-sm text-white/40">
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Drag the certificates in the sidebar to change their display
                    order.
                  </li>
                  <li>
                    Use the visibility toggle to hide certificates from the live
                    site without deleting them.
                  </li>
                  <li>
                    The live preview updates as you edit and the save bar shows
                    whether you have unsaved changes.
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <StickyActionBar
        dirty={editor.isDirty}
        lastSavedAt={editor.lastSavedAt}
        saving={editor.saving}
        savedFlash={savedFlash}
        onReset={editor.reset}
        onSave={submit}
      />
    </div>
  );
}

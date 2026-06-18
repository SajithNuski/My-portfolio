import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import {
  createCertificate,
  createExperience,
  createProject,
  createSkill,
  fetchCertificates,
  fetchExperience,
  fetchHero,
  fetchProjects,
  fetchSkills,
  getMessages,
  markMessageRead,
  updateCertificate,
  updateExperience,
  updateHero,
  updateProject,
  updateSkill,
  deleteCertificate,
  deleteExperience,
  deleteProject,
  deleteSkill,
  uploadCertificateImage,
  uploadProjectImage,
} from "../../api/index.js";

const sectionConfig = {
  hero: {
    title: "Edit Hero",
    type: "single",
    fetcher: fetchHero,
    updater: updateHero,
    template: {
      greeting: "Hi, I'm",
      name: "Mohamed Sajith Nuski",
      title: "Frontend Developer & Creative Technologist",
      description: "",
      availableForWork: true,
      ctaPrimaryText: "View My Work",
      ctaSecondaryText: "Let's Talk",
      stats: [
        { label: "Years freelancing", value: "3+" },
        { label: "Fiverr Seller", value: "Lv2" },
      ],
      socialLinks: {
        github: "",
        linkedin: "",
        fiverr: "",
        email: "",
      },
    },
  },
  projects: {
    title: "Manage Projects",
    type: "list",
    fetcher: fetchProjects,
    creator: createProject,
    updater: updateProject,
    remover: deleteProject,
    template: {
      title: "",
      description: "",
      longDescription: "",
      type: "Website",
      platform: "",
      country: "",
      bullets: [""],
      techStack: [""],
      githubUrl: "",
      liveUrl: "",
      imageUrl: "",
      imageAlt: "",
      featured: false,
      order: 0,
    },
  },
  skills: {
    title: "Update Skills",
    type: "list",
    fetcher: fetchSkills,
    creator: createSkill,
    updater: updateSkill,
    remover: deleteSkill,
    template: {
      category: "",
      icon: "",
      skills: [{ name: "", primary: false }],
      order: 0,
    },
  },
  experience: {
    title: "Edit Experience",
    type: "list",
    fetcher: fetchExperience,
    creator: createExperience,
    updater: updateExperience,
    remover: deleteExperience,
    template: {
      role: "",
      company: "",
      platform: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""],
      badge: "",
      order: 0,
    },
  },
  certificates: {
    title: "Manage Certificates",
    type: "list",
    fetcher: fetchCertificates,
    creator: createCertificate,
    updater: updateCertificate,
    remover: deleteCertificate,
    template: {
      name: "",
      title: "",
      description: "",
      icon: "",
      imageUrl: "",
      image: "",
      imageAlt: "",
      pdfUrl: "",
      credentialUrl: "",
      certificateUrl: "",
      credentialId: "",
      completedDate: "",
      skills: [],
      verified: false,
      accent: "green",
      order: 0,
    },
  },
  messages: {
    title: "View Messages",
    type: "messages",
    fetcher: getMessages,
  },
};

const prettyPrint = (value) => JSON.stringify(value ?? {}, null, 2);

function toEditorText(item) {
  return prettyPrint(item);
}

function parseEditorText(text) {
  return JSON.parse(text);
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default function AdminSectionManager() {
  const { section } = useParams();
  const navigate = useNavigate();
  const config = sectionConfig[section];
  const isCertificateSection = section === "certificates";
  const isProjectSection = section === "projects";

  const [items, setItems] = useState([]);
  const [singleRecord, setSingleRecord] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [editorText, setEditorText] = useState("");
  const [certificateForm, setCertificateForm] = useState(
    sectionConfig.certificates.template,
  );
  const [certificateUploading, setCertificateUploading] = useState(false);
  const [certificateLocalPreview, setCertificateLocalPreview] = useState(null);
  const certificateFileInputRef = useRef(null);
  const [projectUploading, setProjectUploading] = useState(false);
  const [projectLocalPreview, setProjectLocalPreview] = useState(null);
  const projectFileInputRef = useRef(null);
  const [projectForm, setProjectForm] = useState(
    sectionConfig.projects.template,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const selectedItem = useMemo(() => {
    if (config?.type === "single") {
      return singleRecord;
    }
    return items.find((item) => item._id === selectedId) || null;
  }, [config?.type, items, selectedId, singleRecord]);

  useEffect(() => {
    const token = localStorage.getItem("sajith_token");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    if (!config) return;

    const loadSection = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await config.fetcher();
        if (config.type === "single") {
          setSingleRecord(response.data);
          setEditorText(toEditorText(response.data || config.template));
          setSelectedId(null);
        } else if (isCertificateSection) {
          const list = response.data || [];
          setItems(list);
          const first = list[0] || null;
          if (first) {
            setSelectedId(first._id);
            setCertificateForm(first);
            setEditorText(toEditorText(first));
          } else {
            setSelectedId(null);
            setCertificateForm(config.template);
            setEditorText(toEditorText(config.template));
          }
        } else if (isProjectSection) {
          const list = response.data || [];
          setItems(list);
          const first = list[0] || null;
          if (first) {
            setSelectedId(first._id);
            setProjectForm(first);
            setEditorText(toEditorText(first));
          } else {
            setSelectedId(null);
            setProjectForm(config.template);
            setEditorText(toEditorText(config.template));
          }
        } else {
          setItems(response.data || []);
          if ((response.data || []).length > 0) {
            setSelectedId(response.data[0]._id);
            setEditorText(toEditorText(response.data[0]));
          } else {
            setSelectedId(null);
            setEditorText(toEditorText(config.template));
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load section");
      } finally {
        setLoading(false);
      }
    };

    loadSection();
  }, [config, section]);

  useEffect(() => {
    if (config?.type !== "list") return;
    if (!selectedId) return;
    const item = items.find((entry) => entry._id === selectedId);
    if (item) {
      setEditorText(toEditorText(item));
      if (isCertificateSection) {
        setCertificateForm(item);
      } else if (isProjectSection) {
        setProjectForm(item);
      }
    }
  }, [config?.type, items, selectedId, isCertificateSection, isProjectSection]);

  const handleSelectItem = (item) => {
    setSelectedId(item._id);
    if (isCertificateSection) {
      setCertificateForm(item);
    } else if (isProjectSection) {
      setProjectForm(item);
    } else {
      setEditorText(toEditorText(item));
    }
    setNotice("");
    setError("");
  };

  const handleNewItem = () => {
    if (!config || config.type !== "list") return;
    setSelectedId(null);
    if (isCertificateSection) {
      setCertificateForm(config.template);
    } else if (isProjectSection) {
      setProjectForm(config.template);
    } else {
      setEditorText(toEditorText(config.template));
    }
    setNotice("Creating a new item");
    setError("");
  };

  const refreshSection = async () => {
    if (!config) return;
    setLoading(true);
    try {
      const response = await config.fetcher();
      if (config.type === "single") {
        setSingleRecord(response.data);
        setEditorText(toEditorText(response.data || config.template));
      } else if (isCertificateSection) {
        setItems(response.data || []);
        const next = selectedId
          ? (response.data || []).find((item) => item._id === selectedId)
          : response.data?.[0];
        if (next) {
          setSelectedId(next._id);
          setCertificateForm(next);
          setEditorText(toEditorText(next));
        } else {
          setSelectedId(null);
          setCertificateForm(config.template);
          setEditorText(toEditorText(config.template));
        }
      } else if (isProjectSection) {
        setItems(response.data || []);
        const next = selectedId
          ? (response.data || []).find((item) => item._id === selectedId)
          : response.data?.[0];
        if (next) {
          setSelectedId(next._id);
          setProjectForm(next);
          setEditorText(toEditorText(next));
        } else {
          setSelectedId(null);
          setProjectForm(config.template);
          setEditorText(toEditorText(config.template));
        }
      } else {
        setItems(response.data || []);
        const next = selectedId
          ? (response.data || []).find((item) => item._id === selectedId)
          : response.data?.[0];
        if (next) {
          setSelectedId(next._id);
          setEditorText(toEditorText(next));
        } else {
          setSelectedId(null);
          setEditorText(toEditorText(config.template));
        }
      }
      setNotice("Refreshed");
    } catch (err) {
      setError(err.response?.data?.message || "Refresh failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = isCertificateSection
        ? (() => {
            const { issuer, issuerLogo, ...rest } = certificateForm;
            return rest;
          })()
        : isProjectSection
          ? projectForm
          : parseEditorText(editorText);

      if (config.type === "single") {
        const response = await config.updater(payload);
        setSingleRecord(response.data);
        setEditorText(toEditorText(response.data));
        setNotice("Hero updated successfully");
      } else if (isCertificateSection && selectedId) {
        const response = await config.updater(selectedId, payload);
        const updatedList = items.map((item) =>
          item._id === selectedId ? response.data : item,
        );
        setItems(updatedList);
        setSelectedId(response.data._id);
        setCertificateForm(response.data);
        setEditorText(toEditorText(response.data));
        setNotice("Certificate updated successfully");
      } else if (isCertificateSection) {
        const response = await config.creator(payload);
        const created = response.data;
        const updatedList = [created, ...items];
        setItems(updatedList);
        setSelectedId(created._id);
        setCertificateForm(created);
        setEditorText(toEditorText(created));
        setNotice("Certificate created successfully");
      } else if (isProjectSection && selectedId) {
        const response = await config.updater(selectedId, payload);
        const updatedList = items.map((item) =>
          item._id === selectedId ? response.data : item,
        );
        setItems(updatedList);
        setSelectedId(response.data._id);
        setProjectForm(response.data);
        setEditorText(toEditorText(response.data));
        setNotice("Project updated successfully");
      } else if (isProjectSection) {
        const response = await config.creator(payload);
        const created = response.data;
        const updatedList = [created, ...items];
        setItems(updatedList);
        setSelectedId(created._id);
        setProjectForm(created);
        setEditorText(toEditorText(created));
        setNotice("Project created successfully");
      } else if (selectedId) {
        const response = await config.updater(selectedId, payload);
        const updatedList = items.map((item) =>
          item._id === selectedId ? response.data : item,
        );
        setItems(updatedList);
        setSelectedId(response.data._id);
        setEditorText(toEditorText(response.data));
        setNotice("Item updated successfully");
      } else {
        const response = await config.creator(payload);
        const created = response.data;
        const updatedList = [created, ...items];
        setItems(updatedList);
        setSelectedId(created._id);
        setEditorText(toEditorText(created));
        setNotice("Item created successfully");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Save failed. Check your JSON formatting.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!config?.remover) return;

    const confirmDelete = window.confirm("Delete this item?");
    if (!confirmDelete) return;

    setSaving(true);
    try {
      await config.remover(itemId);
      const nextList = items.filter((item) => item._id !== itemId);
      setItems(nextList);
      const nextSelected = nextList[0] || null;
      if (nextSelected) {
        setSelectedId(nextSelected._id);
        if (isCertificateSection) {
          setCertificateForm(nextSelected);
        } else {
          setEditorText(toEditorText(nextSelected));
        }
      } else {
        setSelectedId(null);
        if (isCertificateSection) {
          setCertificateForm(config.template);
        } else {
          setEditorText(toEditorText(config.template));
        }
      }
      setNotice("Item deleted successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  const handleProjectImageUpload = async (file) => {
    if (!file) return;
    const token = localStorage.getItem("sajith_token");
    if (!token) {
      setError("Please log in as admin to upload images.");
      return;
    }
    setProjectUploading(true);
    setError("");
    try {
      const base64Url = await fileToBase64(file);
      setProjectForm((prev) => ({ ...prev, imageUrl: base64Url }));
      setNotice("Image uploaded successfully");
    } catch (err) {
      console.error("Project upload failed:", err);
      setError(err.message || "Upload failed");
    } finally {
      setProjectUploading(false);
    }
  };

  const handleCertificateImageUpload = async (file) => {
    if (!file) return;
    const token = localStorage.getItem("sajith_token");
    if (!token) {
      setError("Please log in as admin to upload images.");
      return;
    }

    setCertificateUploading(true);
    setError("");

    try {
      const base64Url = await fileToBase64(file);
      setCertificateForm((prev) => ({ ...prev, imageUrl: base64Url }));
      setNotice("Image uploaded successfully");
    } catch (err) {
      console.error("Certificate upload failed:", err);
      setError(err.message || "Upload failed");
    } finally {
      setCertificateUploading(false);
    }
  };

  const handleMarkRead = async (messageId) => {
    try {
      await markMessageRead(messageId);
      const response = await config.fetcher();
      setItems(response.data || []);
      setNotice("Message marked as read");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark message as read");
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-canvas text-text-primary px-6 py-20">
        <div className="max-w-3xl mx-auto bg-overlay/40 border border-white/10 rounded-2xl p-8">
          <h1 className="text-3xl font-bold font-head mb-4">
            Unknown admin section
          </h1>
          <p className="text-text-secondary mb-6">
            The section you requested does not exist.
          </p>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-canvas font-semibold"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      <nav className="border-b border-white/10 bg-overlay/30 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">
              Admin Panel
            </p>
            <h1 className="text-2xl font-bold font-head text-accent">
              {config.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:border-accent/50"
            >
              <ArrowLeft size={16} /> Dashboard
            </button>
            <button
              onClick={refreshSection}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:border-accent/50"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[320px_1fr] gap-8">
        <aside className="space-y-4">
          <div className="bg-overlay/40 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Items</h2>
              {config.type === "list" && (
                <button
                  onClick={handleNewItem}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-canvas"
                >
                  <Plus size={16} /> New
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-text-secondary text-sm">Loading...</p>
            ) : config.type === "messages" ? (
              <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
                {items.map((message) => (
                  <div
                    key={message._id}
                    className={`rounded-xl border p-4 ${
                      message.read
                        ? "border-white/10 bg-canvas/30"
                        : "border-accent/30 bg-accent/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold">{message.name}</h3>
                      <span className="text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                        {message.read ? "Read" : "Unread"}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">
                      {message.email}
                    </p>
                    <p className="text-sm mb-3 line-clamp-3">
                      {message.message}
                    </p>
                    {!message.read && (
                      <button
                        onClick={() => handleMarkRead(message._id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-canvas"
                      >
                        <CheckCircle2 size={14} /> Mark as read
                      </button>
                    )}
                  </div>
                ))}
                {!items.length && (
                  <p className="text-sm text-text-secondary">
                    No messages yet.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
                {(items || []).map((item) => (
                  <button
                    key={item._id}
                    onClick={() => handleSelectItem(item)}
                    className={`w-full text-left rounded-xl border p-4 transition ${
                      selectedId === item._id
                        ? "border-accent bg-accent/10"
                        : "border-white/10 bg-canvas/20 hover:border-accent/40"
                    }`}
                  >
                    <p className="font-semibold">
                      {item.name ||
                        item.title ||
                        item.category ||
                        item.role ||
                        "Untitled"}
                    </p>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                      {item.description || item.company || item.category || ""}
                    </p>
                  </button>
                ))}
                {!items.length && (
                  <p className="text-sm text-text-secondary">
                    No items yet. Create one to start.
                  </p>
                )}
              </div>
            )}
          </div>
        </aside>

        <main className="space-y-6">
          <div className="bg-overlay/40 border border-white/10 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold">Editor</h2>
                <p className="text-sm text-text-secondary">
                  Edit the selected item as JSON. Save to update the live
                  portfolio.
                </p>
              </div>
              {selectedItem && config.type === "list" && (
                <button
                  onClick={() => handleDelete(selectedItem._id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={16} /> Delete
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
            {notice && (
              <div className="mb-4 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
                {notice}
              </div>
            )}

            {isCertificateSection ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">Name</span>
                    <input
                      type="text"
                      value={certificateForm.name || ""}
                      onChange={(e) =>
                        setCertificateForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="Certificate name"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">Title</span>
                    <input
                      type="text"
                      value={
                        certificateForm.title || certificateForm.name || ""
                      }
                      onChange={(e) =>
                        setCertificateForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="Display title for the certificate"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">
                      Completed Date
                    </span>
                    <input
                      type="text"
                      value={certificateForm.completedDate || ""}
                      onChange={(e) =>
                        setCertificateForm((prev) => ({
                          ...prev,
                          completedDate: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="Jan 2024"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">
                      Credential ID
                    </span>
                    <input
                      type="text"
                      value={certificateForm.credentialId || ""}
                      onChange={(e) =>
                        setCertificateForm((prev) => ({
                          ...prev,
                          credentialId: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="ABC-123-XYZ"
                    />
                  </label>
                </div>

                <label className="space-y-2 block">
                  <span className="block text-sm font-semibold">
                    Description
                  </span>
                  <textarea
                    value={certificateForm.description || ""}
                    onChange={(e) =>
                      setCertificateForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                    placeholder="Short description about the certificate"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">Icon</span>
                    <input
                      type="text"
                      value={certificateForm.icon || ""}
                      onChange={(e) =>
                        setCertificateForm((prev) => ({
                          ...prev,
                          icon: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="🎓"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">
                      Skills (comma separated)
                    </span>
                    <input
                      type="text"
                      value={(certificateForm.skills || []).join(", ")}
                      onChange={(e) =>
                        setCertificateForm((prev) => ({
                          ...prev,
                          skills: String(e.target.value || "")
                            .split(",")
                            .map((skill) => skill.trim())
                            .filter(Boolean),
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="React, HTML/CSS, UX Design"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">
                      Image URL
                    </span>
                    <input
                      type="text"
                      value={
                        certificateForm.imageUrl || certificateForm.image || ""
                      }
                      onChange={(e) =>
                        setCertificateForm((prev) => ({
                          ...prev,
                          imageUrl: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="/certificates/your-file.png or https://..."
                    />
                    <p className="text-xs text-text-secondary">
                      For local files, place them in{" "}
                      <span className="font-semibold">
                        client/public/certificates
                      </span>{" "}
                      or use the upload button.
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        ref={certificateFileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCertificateImageUpload(file);
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => certificateFileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:border-accent/50"
                      >
                        Choose file
                      </button>
                      {certificateUploading ? (
                        <span className="text-sm text-text-secondary">
                          Uploading...
                        </span>
                      ) : null}
                    </div>
                  </label>
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">
                      Image Alt Text
                    </span>
                    <input
                      type="text"
                      value={certificateForm.imageAlt || ""}
                      onChange={(e) =>
                        setCertificateForm((prev) => ({
                          ...prev,
                          imageAlt: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="Certificate image description"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">
                      Certificate URL
                    </span>
                    <input
                      type="text"
                      value={
                        certificateForm.certificateUrl ||
                        certificateForm.credentialUrl ||
                        ""
                      }
                      onChange={(e) =>
                        setCertificateForm((prev) => ({
                          ...prev,
                          certificateUrl: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="https://..."
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">
                      Verified
                    </span>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!certificateForm.verified}
                        onChange={(e) =>
                          setCertificateForm((prev) => ({
                            ...prev,
                            verified: e.target.checked,
                          }))
                        }
                        className="w-5 h-5"
                      />
                      <span className="text-text-secondary">
                        Mark as verified
                      </span>
                    </div>
                  </label>
                </div>

                <div className="grid md:grid-cols-[180px_1fr] gap-4 items-start">
                  <div className="rounded-2xl border border-white/10 bg-canvas/30 overflow-hidden">
                    <div className="aspect-[4/3] bg-canvas/50">
                      <img
                        src={
                          certificateLocalPreview ||
                          certificateForm.imageUrl ||
                          certificateForm.image ||
                          "https://via.placeholder.com/1200x800?text=Certificate+Preview"
                        }
                        alt={
                          certificateForm.imageAlt ||
                          certificateForm.name ||
                          "Certificate preview"
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-canvas/20 p-4 text-sm text-text-secondary">
                    <p className="font-semibold text-text-primary mb-2">
                      Quick tips
                    </p>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>
                        Use the form to save certificate details and upload an
                        image.
                      </li>
                      <li>
                        For local files, put them in{" "}
                        <span className="font-semibold">
                          client/public/certificates
                        </span>
                        .
                      </li>
                      <li>
                        You can also paste a direct image URL from any host.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-canvas disabled:opacity-60"
                  >
                    <Save size={16} /> {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() =>
                      setCertificateForm(selectedItem || config.template)
                    }
                    className="rounded-lg border border-white/10 px-4 py-2 font-semibold hover:border-accent/50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : isProjectSection ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">Title</span>
                    <input
                      type="text"
                      value={projectForm.title || ""}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="Project title"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">Type</span>
                    <input
                      type="text"
                      value={projectForm.type || ""}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="Website, App, Dashboard"
                    />
                  </label>
                </div>

                <label className="space-y-2 block">
                  <span className="block text-sm font-semibold">
                    Description
                  </span>
                  <textarea
                    value={projectForm.description || ""}
                    onChange={(e) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                    placeholder="Short description about the project"
                  />
                </label>

                <label className="space-y-2 block">
                  <span className="block text-sm font-semibold">
                    Long Description
                  </span>
                  <textarea
                    value={projectForm.longDescription || ""}
                    onChange={(e) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        longDescription: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                    placeholder="Full description shown in the project overlay"
                  />
                </label>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">
                      Platform
                    </span>
                    <input
                      type="text"
                      value={projectForm.platform || ""}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          platform: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="WordPress, MERN, Flutter"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">Country</span>
                    <input
                      type="text"
                      value={projectForm.country || ""}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="USA, Sri Lanka, Remote"
                    />
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">
                      GitHub URL
                    </span>
                    <input
                      type="text"
                      value={projectForm.githubUrl || ""}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          githubUrl: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="https://github.com/..."
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">
                      Live URL
                    </span>
                    <input
                      type="text"
                      value={projectForm.liveUrl || ""}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          liveUrl: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="https://..."
                    />
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">
                      Languages / Tech Stack (comma separated)
                    </span>
                    <input
                      type="text"
                      value={(projectForm.techStack || []).join(", ")}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          techStack: e.target.value
                            .split(",")
                            .map((s) => s.trim()),
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="React, Node.js, Tailwind"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">
                      Featured
                    </span>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!projectForm.featured}
                        onChange={(e) =>
                          setProjectForm((prev) => ({
                            ...prev,
                            featured: e.target.checked,
                          }))
                        }
                        className="w-5 h-5"
                      />
                      <span className="text-text-secondary">
                        Show as featured
                      </span>
                    </div>
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">
                      Image URL
                    </span>
                    <input
                      type="text"
                      value={projectForm.imageUrl || ""}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          imageUrl: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="/projects/your-file.png or https://..."
                    />
                    <p className="text-xs text-text-secondary">
                      For local files, place them in{" "}
                      <span className="font-semibold">
                        server/uploads/projects
                      </span>{" "}
                      by using the upload button or use a full image URL.
                    </p>
                  </label>

                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">
                      Image Alt Text
                    </span>
                    <input
                      type="text"
                      value={projectForm.imageAlt || ""}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          imageAlt: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                      placeholder="Image description"
                    />
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold">Order</span>
                    <input
                      type="number"
                      value={projectForm.order ?? 0}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          order: Number(e.target.value),
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-canvas/30 px-4 py-3 outline-none focus:border-accent/50"
                    />
                  </label>
                </div>

                <div className="grid md:grid-cols-[180px_1fr] gap-4 items-start">
                  <div className="rounded-2xl border border-white/10 bg-canvas/30 overflow-hidden">
                    <div className="aspect-[4/3] bg-canvas/50">
                      <img
                        src={
                          projectLocalPreview ||
                          projectForm.imageUrl ||
                          "https://via.placeholder.com/1200x800?text=Project+Preview"
                        }
                        alt={
                          projectForm.imageAlt ||
                          projectForm.title ||
                          "Project preview"
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-canvas/20 p-4 text-sm text-text-secondary">
                    <p className="font-semibold text-text-primary mb-2">
                      Quick tips
                    </p>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>
                        Use the upload button to store project images on the
                        server.
                      </li>
                      <li>
                        For local files, the server stores them in{" "}
                        <span className="font-semibold">
                          server/uploads/projects
                        </span>
                        .
                      </li>
                      <li>
                        You can also paste a full image URL from any image host.
                      </li>
                    </ul>
                    <div className="mt-3 flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        ref={projectFileInputRef}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleProjectImageUpload(f);
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => projectFileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:border-accent/50"
                      >
                        Choose file
                      </button>
                      {projectUploading && (
                        <span className="text-sm text-text-secondary">
                          Uploading...
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-canvas disabled:opacity-60"
                  >
                    <Save size={16} /> {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() =>
                      setProjectForm(selectedItem || config.template)
                    }
                    className="rounded-lg border border-white/10 px-4 py-2 font-semibold hover:border-accent/50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <>
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  rows={config.type === "single" ? 24 : 20}
                  className="w-full rounded-2xl border border-white/10 bg-canvas/30 p-4 font-mono text-sm text-text-primary outline-none focus:border-accent/50"
                  spellCheck={false}
                />

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-canvas disabled:opacity-60"
                  >
                    <Save size={16} /> {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() =>
                      setEditorText(
                        toEditorText(selectedItem || config.template),
                      )
                    }
                    className="rounded-lg border border-white/10 px-4 py-2 font-semibold hover:border-accent/50"
                  >
                    Reset
                  </button>
                </div>
              </>
            )}
          </div>

          {config.type !== "messages" && (
            <div className="bg-overlay/40 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">How this works</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                This editor saves the JSON directly to your portfolio data. Use
                it to edit any field, including nested arrays like stats,
                bullets, skills, techStack, or socialLinks.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

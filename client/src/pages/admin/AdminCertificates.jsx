import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Menu, RefreshCw } from "lucide-react";
import useCertificateEditor from "../../hooks/useCertificateEditor.js";
import useCertificateList, {
  normalizeCertificateRecord,
} from "../../hooks/useCertificateList.js";
import CertificateItemsList from "../../components/admin/certificates/CertificateItemsList.jsx";
import CertificateEditorPanel from "../../components/admin/certificates/CertificateEditorPanel.jsx";
import UnsavedChangesModal from "../../components/admin/certificates/UnsavedChangesModal.jsx";
import ToastManager from "../../components/admin/certificates/ToastManager.jsx";
import "../../styles/certificates-admin.css";

function createBlankCertificate() {
  return normalizeCertificateRecord({
    _id: "",
    num: "01",
    title: "",
    name: "",
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
    verified: true,
    accent: "green",
    order: 0,
    visible: true,
  });
}

export default function AdminCertificates() {
  const navigate = useNavigate();
  const list = useCertificateList();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(
    createBlankCertificate(),
  );
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [notice, setNotice] = useState("");
  const pendingSelectionRef = useRef(null);
  const draftModeRef = useRef(false);

  const editor = useCertificateEditor({
    initialCertificate: selectedCertificate,
    onSaved: (savedCertificate, isNew) => {
      list.upsertCertificate(savedCertificate);
      setSelectedCertificate(savedCertificate);
      setNotice(
        isNew
          ? "Certificate created successfully"
          : "Certificate saved successfully",
      );
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
      pushToast("success", "Certificate saved successfully");
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("sajith_token");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    if (!list.certificates.length) return;
    if (!selectedCertificate._id && !draftModeRef.current) {
      setSelectedCertificate(list.certificates[0]);
      return;
    }

    const current = list.certificates.find(
      (item) => item._id === selectedCertificate._id,
    );
    if (current) {
      setSelectedCertificate(current);
    }
  }, [list.certificates, selectedCertificate._id]);

  useEffect(() => {
    const onBeforeUnload = (event) => {
      if (!editor.isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [editor.isDirty]);

  useEffect(() => {
    const onPopState = () => {
      if (!editor.isDirty) {
        navigate("/admin");
        return;
      }

      pendingSelectionRef.current = () => navigate("/admin");
      setShowUnsaved(true);
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [editor.isDirty, navigate]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!list.error) return;
    pushToast("error", list.error);
  }, [list.error]);

  function pushToast(type, message) {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, type, message }].slice(-4));
    window.setTimeout(
      () => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      },
      type === "error" ? 5000 : 3000,
    );
  }

  const requestSelection = (certificate) => {
    if (editor.isDirty && certificate._id !== selectedCertificate._id) {
      pendingSelectionRef.current = () => {
        draftModeRef.current = false;
        setSelectedCertificate(certificate);
        setSidebarOpen(false);
      };
      setShowUnsaved(true);
      return;
    }

    draftModeRef.current = false;
    setSelectedCertificate(certificate);
    setSidebarOpen(false);
  };

  const requestNew = () => {
    const next = createBlankCertificate();
    next.title = "";
    next.name = "";
    next.order = list.certificates.length;

    if (editor.isDirty) {
      pendingSelectionRef.current = () => {
        draftModeRef.current = true;
        setSelectedCertificate(next);
        setSidebarOpen(false);
      };
      setShowUnsaved(true);
      return;
    }

    draftModeRef.current = true;
    setSelectedCertificate(next);
    setSidebarOpen(false);
  };

  const requestBack = () => {
    if (editor.isDirty) {
      pendingSelectionRef.current = () => navigate("/admin");
      setShowUnsaved(true);
      return;
    }
    navigate("/admin");
  };

  const handleSave = async () => {
    const result = await editor.save();
    if (!result.ok) {
      pushToast("error", result.message || "Validation failed");
      return;
    }

    draftModeRef.current = false;
    setSelectedCertificate(result.data);
    list.upsertCertificate(result.data);
    setNotice("Certificate saved successfully");
    pushToast("success", "Certificate saved successfully");
    if (result.isNew) {
      setSidebarOpen(false);
    }
  };

  const handleDelete = async (certificateId) => {
    try {
      await list.removeCertificate(certificateId);
      pushToast("success", "Certificate deleted");
      const next =
        list.certificates.find((item) => item._id !== certificateId) ||
        createBlankCertificate();
      draftModeRef.current = !next._id;
      setSelectedCertificate(next._id ? next : createBlankCertificate());
    } catch (error) {
      pushToast(
        "error",
        error.response?.data?.message || "Failed to delete certificate",
      );
    }
  };

  const handleToggleVisibility = async (certificateId, nextVisible) => {
    try {
      await list.toggleVisibility(certificateId, nextVisible);
      pushToast("success", "Visibility updated");
      if (selectedCertificate._id === certificateId) {
        setSelectedCertificate((current) => ({
          ...current,
          visible: nextVisible,
        }));
      }
    } catch (error) {
      pushToast(
        "error",
        error.response?.data?.message || "Failed to update visibility",
      );
    }
  };

  const handleReorder = async (reordered) => {
    try {
      await list.persistReorder(reordered);
      pushToast("success", "Certificate order updated");
    } catch (error) {
      pushToast(
        "error",
        error.response?.data?.message || "Failed to reorder certificates",
      );
    }
  };

  const handleDuplicate = () => {
    const draft = editor.makeDuplicateDraft();
    draftModeRef.current = true;
    setSelectedCertificate(draft);
    setSidebarOpen(false);
  };

  const handleRefresh = async () => {
    try {
      await list.loadCertificates();
      pushToast("success", "Certificates refreshed");
    } catch (error) {
      pushToast(
        "error",
        error.response?.data?.message || "Failed to refresh certificates",
      );
    }
  };

  const openLive = () => {
    window.open(
      `${window.location.origin}/#certificates`,
      "_blank",
      "noreferrer",
    );
  };

  const hiddenSidebarClass = sidebarOpen ? "block" : "hidden lg:block";

  return (
    <div className="certificates-admin-shell min-h-screen bg-[#060b13] text-white">
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[#060b13]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={requestBack}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-white/75 hover:border-[#4ade80]/40 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="hidden text-[11px] text-white/35 md:block">
              <div className="font-mono uppercase tracking-[0.18em]">
                Admin Panel / Certificates
              </div>
              <h1 className="mt-1 text-[24px] font-bold text-[#4ade80]">
                Manage Certificates
              </h1>
            </div>
            <div className="md:hidden">
              <h1 className="text-[18px] font-bold text-[#4ade80]">
                Manage Certificates
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen((current) => !current)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/75 lg:hidden"
            >
              <Menu size={16} /> Certificates
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/75 hover:border-[#4ade80]/40"
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <button
              type="button"
              onClick={openLive}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/70 hover:border-white/20"
            >
              <ExternalLink size={16} /> View Live
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-5 px-4 py-5 md:px-6 lg:grid lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className={`${hiddenSidebarClass} lg:block`}>
          <CertificateItemsList
            certificates={list.certificates}
            loading={list.loading}
            reordering={list.reordering}
            deletingId={list.deletingId}
            toggleLoadingById={list.toggleLoadingById}
            activeId={selectedCertificate._id}
            onSelect={requestSelection}
            onDelete={handleDelete}
            onToggle={handleToggleVisibility}
            onReorder={handleReorder}
            onAdd={requestNew}
          />
        </div>

        <CertificateEditorPanel
          certificate={selectedCertificate}
          editor={editor}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onSave={handleSave}
          savedFlash={savedFlash}
        />
      </div>

      <UnsavedChangesModal
        open={showUnsaved}
        onStay={() => setShowUnsaved(false)}
        onDiscard={() => {
          setShowUnsaved(false);
          if (pendingSelectionRef.current) {
            pendingSelectionRef.current();
            pendingSelectionRef.current = null;
          }
        }}
      />

      <ToastManager toasts={toasts} />

      {notice ? (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-[9997] -translate-x-1/2 rounded-full border border-[#4ade80]/30 bg-[#0d1117]/90 px-4 py-2 text-sm text-[#4ade80] shadow-2xl shadow-black/30">
          {notice}
        </div>
      ) : null}
    </div>
  );
}

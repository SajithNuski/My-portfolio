import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("sajith_token");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("sajith_token");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-canvas">
      <nav className="bg-overlay border-b border-border px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-head text-accent">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-text-primary mb-8">
          Manage Your Portfolio
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Cards */}
          {[
            { title: "Edit Hero", icon: "🎯" },
            { title: "Manage Projects", icon: "📁" },
            { title: "Update Skills", icon: "🛠️" },
            { title: "Edit Experience", icon: "💼" },
            { title: "Manage Certificates", icon: "🏆" },
            { title: "View Messages", icon: "💬" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-overlay border border-border rounded-lg p-6 hover:border-accent transition cursor-pointer text-center"
            >
              <p className="text-4xl mb-3">{item.icon}</p>
              <h3 className="text-lg font-bold text-text-primary">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

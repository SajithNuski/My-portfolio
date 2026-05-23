import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminSectionManager from "./pages/admin/AdminSectionManager.jsx";
import AdminProjects from "./pages/admin/AdminProjects.jsx";
import AdminCertificates from "./pages/admin/AdminCertificates.jsx";
import ProjectDetails from "./pages/ProjectDetails.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="relative min-h-screen bg-canvas overflow-hidden">
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route
                path="/admin/manage/certificates"
                element={<AdminCertificates />}
              />
              <Route
                path="/admin/manage/:section"
                element={<AdminSectionManager />}
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

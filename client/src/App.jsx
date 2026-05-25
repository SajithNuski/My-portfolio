import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home.jsx";

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminSectionManager = lazy(() =>
  import("./pages/admin/AdminSectionManager.jsx"),
);
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects.jsx"));
const AdminCertificates = lazy(() =>
  import("./pages/admin/AdminCertificates.jsx"),
);
const ProjectDetails = lazy(() => import("./pages/ProjectDetails.jsx"));

function RouteFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-text-secondary">
      Loading...
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="relative min-h-screen bg-canvas overflow-hidden">
          <div className="relative z-10">
            <Suspense fallback={<RouteFallback />}>
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
            </Suspense>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sajith_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Public endpoints
export const fetchHero = () => api.get("/hero");
export const fetchProjects = () => api.get("/projects");
export const fetchSkills = () => api.get("/skills");
export const fetchExperience = () => api.get("/experience");
export const fetchCertificates = () => api.get("/certificates");
export const sendMessage = (data) => api.post("/contact", data);

// Auth endpoints
export const loginAdmin = (credentials) => api.post("/auth/login", credentials);
export const registerAdmin = (credentials) =>
  api.post("/auth/register", credentials);

// Admin endpoints (protected)
export const updateHero = (data) => api.put("/hero", data);
export const createProject = (data) => api.post("/projects", data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const createSkill = (data) => api.post("/skills", data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);

export const createExperience = (data) => api.post("/experience", data);
export const updateExperience = (id, data) =>
  api.put(`/experience/${id}`, data);
export const deleteExperience = (id) => api.delete(`/experience/${id}`);

export const createCertificate = (data) => api.post("/certificates", data);
export const updateCertificate = (id, data) =>
  api.put(`/certificates/${id}`, data);
export const deleteCertificate = (id) => api.delete(`/certificates/${id}`);

export const getMessages = () => api.get("/contact");
export const markMessageRead = (id) => api.put(`/contact/${id}/read`);

export default api;

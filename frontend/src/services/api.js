import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT if in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for session expiration
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject({ ...error, customMessage: message });
  }
);

// Auth Services
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me')
};

// Profile Services
export const profileService = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data)
};

// Scheme Services
export const schemeService = {
  getSchemes: (params) => api.get('/schemes', { params }),
  getSchemeBySlug: (slug) => api.get(`/schemes/${slug}`),
  getCategories: () => api.get('/schemes/categories'),
  getDepartments: () => api.get('/schemes/departments')
};

// Eligibility Engine Services
export const eligibilityService = {
  checkEligibility: (profileData) => api.post('/eligibility/check', { profile: profileData }),
  getCheckHistory: () => api.get('/eligibility/history')
};

// Career Services
export const careerService = {
  getCareers: (params) => api.get('/careers', { params }),
  getCareerBySlug: (slug) => api.get(`/careers/${slug}`),
  recommendCareers: (profileData) => api.post('/careers/recommend', { profile: profileData })
};

// Admin Services
export const adminService = {
  getAnalytics: () => api.get('/admin/analytics'),
  verifyScheme: (id, status) => api.post(`/admin/schemes/${id}/verify`, { status }),
  getAuditLogs: (limit) => api.get('/admin/audit-logs', { params: { limit } })
};

export default api;

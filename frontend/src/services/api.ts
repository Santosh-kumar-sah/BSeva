import axios, { AxiosResponse } from 'axios';
import { 
  User, 
  CitizenProfile, 
  Scheme, 
  Department, 
  SchemeCategory, 
  EligibilityCheckResponse, 
  CareerPath, 
  AnalyticsData, 
  AuditLog,
  AiResponse,
  AiSuggestion
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject({ ...error, customMessage: message });
  }
);

// Auth Services
export const authService = {
  login: (data: { identifier: string; password: string }): Promise<{ success: boolean; token: string; user: User }> => 
    api.post('/auth/login', data),
  register: (data: { fullName: string; phone: string; password: string; email?: string }): Promise<{ success: boolean; token: string; user: User }> => 
    api.post('/auth/register', data),
  logout: (): Promise<{ success: boolean; message: string }> => 
    api.post('/auth/logout'),
  getMe: (): Promise<{ success: boolean; user: User; profile: CitizenProfile | null }> => 
    api.get('/auth/me')
};

// Profile Services
export const profileService = {
  getProfile: (): Promise<{ success: boolean; profile: CitizenProfile }> => 
    api.get('/profile'),
  updateProfile: (data: Partial<CitizenProfile>): Promise<{ success: boolean; message: string; profile: CitizenProfile }> => 
    api.put('/profile', data)
};

// Scheme Services
export const schemeService = {
  getSchemes: (params?: Record<string, any>): Promise<{ success: boolean; total: number; page: number; limit: number; totalPages: number; schemes: Scheme[] }> => 
    api.get('/schemes', { params }),
  getSchemeBySlug: (slug: string): Promise<{ success: boolean; scheme: Scheme }> => 
    api.get(`/schemes/${slug}`),
  getCategories: (): Promise<{ success: boolean; count: number; categories: SchemeCategory[] }> => 
    api.get('/schemes/categories'),
  getDepartments: (): Promise<{ success: boolean; count: number; departments: Department[] }> => 
    api.get('/schemes/departments')
};

// Eligibility Engine Services
export const eligibilityService = {
  checkEligibility: (profileData: Partial<CitizenProfile>): Promise<EligibilityCheckResponse> => 
    api.post('/eligibility/check', { profile: profileData }),
  getCheckHistory: (): Promise<{ success: boolean; count: number; history: any[] }> => 
    api.get('/eligibility/history')
};

// Career Services
export const careerService = {
  getCareers: (params?: Record<string, any>): Promise<{ success: boolean; total: number; careers: CareerPath[] }> => 
    api.get('/careers', { params }),
  getCareerBySlug: (slug: string): Promise<{ success: boolean; career: CareerPath }> => 
    api.get(`/careers/${slug}`),
  recommendCareers: (profileData: Partial<CitizenProfile>): Promise<{ success: boolean; totalCareers: number; recommendations: CareerPath[] }> => 
    api.post('/careers/recommend', { profile: profileData })
};

// AI Assistant Services
export const aiService = {
  chat: (data: { query: string; language?: string; profile?: Partial<CitizenProfile> | null }): Promise<AiResponse> => 
    api.post('/ai/chat', data),
  getSuggestions: (lang: string = 'hi'): Promise<{ success: boolean; language: string; suggestions: AiSuggestion[] }> => 
    api.get('/ai/suggest', { params: { lang } })
};

// Admin Services
export const adminService = {
  getAnalytics: (): Promise<{ success: boolean } & AnalyticsData> => 
    api.get('/admin/analytics'),
  verifyScheme: (id: string, status: string): Promise<{ success: boolean; message: string; scheme: Scheme }> => 
    api.post(`/admin/schemes/${id}/verify`, { status }),
  getAuditLogs: (limit?: number): Promise<{ success: boolean; count: number; auditLogs: AuditLog[] }> => 
    api.get('/admin/audit-logs', { params: { limit } })
};

export default api;

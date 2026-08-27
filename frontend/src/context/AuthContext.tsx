import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, profileService } from '../services/api';
import { User, CitizenProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: CitizenProfile | null;
  loading: boolean;
  language: 'hi' | 'en';
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; token?: string; user?: User }>;
  register: (fullName: string, phone: string, password: string, email?: string) => Promise<{ success: boolean; token?: string; user?: User }>;
  logout: () => Promise<void>;
  saveProfile: (profileData: Partial<CitizenProfile>) => Promise<{ success: boolean; profile?: CitizenProfile }>;
  toggleLanguage: () => void;
  setLanguage: (lang: 'hi' | 'en') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success) {
            setUser(res.user);
            setProfile(res.profile);
          }
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await authService.login({ identifier, password });
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      setUser(res.user);
      try {
        const meRes = await authService.getMe();
        if (meRes.success) setProfile(meRes.profile);
      } catch (e) {}
    }
    return res;
  };

  const register = async (fullName: string, phone: string, password: string, email?: string) => {
    const res = await authService.register({ fullName, phone, password, email });
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {}
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  };

  const saveProfile = async (profileData: Partial<CitizenProfile>) => {
    const res = await profileService.updateProfile(profileData);
    if (res.success) {
      setProfile(res.profile);
    }
    return res;
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'hi' ? 'en' : 'hi'));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        language,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
        login,
        register,
        logout,
        saveProfile,
        toggleLanguage,
        setLanguage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, profileService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('hi'); // 'hi' | 'en'

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

  const login = async (identifier, password) => {
    const res = await authService.login({ identifier, password });
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      setUser(res.user);
      // Fetch fresh profile
      try {
        const meRes = await authService.getMe();
        if (meRes.success) setProfile(meRes.profile);
      } catch (e) {}
    }
    return res;
  };

  const register = async (fullName, phone, password, email) => {
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

  const saveProfile = async (profileData) => {
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Scheme } from '../types';

export type ApplicationStatus = 'BOOKMARKED' | 'PREPARING_DOCS' | 'APPLIED' | 'APPROVED';

export interface SavedSchemeItem {
  scheme: Scheme;
  status: ApplicationStatus;
  savedAt: string;
  applicationRefNumber?: string;
  notes?: string;
}

interface SavedSchemesContextType {
  savedItems: SavedSchemeItem[];
  saveScheme: (scheme: Scheme, status?: ApplicationStatus) => void;
  removeScheme: (schemeId: string) => void;
  isSaved: (schemeId: string) => boolean;
  getSavedItem: (schemeId: string) => SavedSchemeItem | undefined;
  updateStatus: (schemeId: string, status: ApplicationStatus) => void;
  updateNotes: (schemeId: string, notes: string, applicationRefNumber?: string) => void;
  savedCount: number;
}

const SavedSchemesContext = createContext<SavedSchemesContextType | undefined>(undefined);

const STORAGE_KEY = 'bihar_saved_schemes_v1';

export function SavedSchemesProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedSchemeItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse saved schemes from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
    } catch (e) {
      console.error('Failed to sync saved schemes to localStorage', e);
    }
  }, [savedItems]);

  const isSaved = (schemeId: string) => {
    return savedItems.some((item) => item.scheme.id === schemeId);
  };

  const getSavedItem = (schemeId: string) => {
    return savedItems.find((item) => item.scheme.id === schemeId);
  };

  const saveScheme = (scheme: Scheme, status: ApplicationStatus = 'BOOKMARKED') => {
    setSavedItems((prev) => {
      if (prev.some((item) => item.scheme.id === scheme.id)) {
        return prev;
      }
      const newItem: SavedSchemeItem = {
        scheme,
        status,
        savedAt: new Date().toISOString(),
        notes: '',
        applicationRefNumber: ''
      };
      return [newItem, ...prev];
    });
  };

  const removeScheme = (schemeId: string) => {
    setSavedItems((prev) => prev.filter((item) => item.scheme.id !== schemeId));
  };

  const updateStatus = (schemeId: string, status: ApplicationStatus) => {
    setSavedItems((prev) =>
      prev.map((item) =>
        item.scheme.id === schemeId ? { ...item, status } : item
      )
    );
  };

  const updateNotes = (schemeId: string, notes: string, applicationRefNumber?: string) => {
    setSavedItems((prev) =>
      prev.map((item) =>
        item.scheme.id === schemeId
          ? {
              ...item,
              notes,
              applicationRefNumber: applicationRefNumber !== undefined ? applicationRefNumber : item.applicationRefNumber
            }
          : item
      )
    );
  };

  return (
    <SavedSchemesContext.Provider
      value={{
        savedItems,
        saveScheme,
        removeScheme,
        isSaved,
        getSavedItem,
        updateStatus,
        updateNotes,
        savedCount: savedItems.length
      }}
    >
      {children}
    </SavedSchemesContext.Provider>
  );
}

export function useSavedSchemes() {
  const context = useContext(SavedSchemesContext);
  if (!context) {
    throw new Error('useSavedSchemes must be used within a SavedSchemesProvider');
  }
  return context;
}

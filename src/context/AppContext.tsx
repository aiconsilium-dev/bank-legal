import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, FormData, ClaimCalculation } from '../types';
import { storage } from '../utils/storage';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentCaseId: string | null;
  setCurrentCaseId: (id: string | null) => void;
  formData: Partial<FormData>;
  setFormData: (data: Partial<FormData>) => void;
  claimCalc: ClaimCalculation | null;
  setClaimCalc: (calc: ClaimCalculation | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => storage.getUser());
  const [currentCaseId, setCurrentCaseIdState] = useState<string | null>(() => storage.getCurrentCase());
  const [formData, setFormDataState] = useState<Partial<FormData>>(() => storage.getCurrentForm() || {});
  const [claimCalc, setClaimCalc] = useState<ClaimCalculation | null>(null);

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) storage.setUser(u);
    else storage.clearUser();
  };

  const setCurrentCaseId = (id: string | null) => {
    setCurrentCaseIdState(id);
    if (id) storage.setCurrentCase(id);
  };

  const setFormData = (data: Partial<FormData>) => {
    setFormDataState(data);
    storage.setCurrentForm(data as Record<string, string>);
  };

  useEffect(() => {
    // sync from storage on mount
  }, []);

  return (
    <AppContext.Provider value={{
      user, setUser,
      currentCaseId, setCurrentCaseId,
      formData, setFormData,
      claimCalc, setClaimCalc
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

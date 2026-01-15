'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: 'id' | 'en';
  setLanguage: (value: 'id' | 'en') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <AppContext.Provider value={{ darkMode, setDarkMode, language, setLanguage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
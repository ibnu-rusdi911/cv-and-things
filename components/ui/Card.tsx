'use client';

import React, { ReactNode } from 'react';
import { useApp } from '@/lib/contexts/AppContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card = ({ children, className = '', hover = false, onClick }: CardProps) => {
  const { darkMode } = useApp();
  
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-lg border transition-all duration-300 ${hover ? 'cursor-pointer' : ''} ${className}`}
      style={{
        backgroundColor: darkMode ? '#191919' : '#F3EED9',
        borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.borderColor = darkMode ? '#B6861F' : '#C9A227';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.borderColor = darkMode ? '#2a2a2a' : '#ddd4b8';
        }
      }}
    >
      {children}
    </div>
  );
};
'use client';

import React from 'react';
import { useApp } from '@/lib/contexts/AppContext';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent';
}

export const Badge = ({ children, variant = 'default' }: BadgeProps) => {
  const { darkMode } = useApp();

  const getStyles = () => {
    if (variant === 'accent') {
      return {
        backgroundColor: darkMode ? 'rgba(182, 134, 31, 0.2)' : 'rgba(201, 162, 39, 0.2)',
        color: darkMode ? '#B6861F' : '#C9A227'
      };
    }
    return {
      backgroundColor: darkMode ? '#252525' : '#e8e1ca',
      color: darkMode ? '#c4c4c4' : '#5a5a5a'
    };
  };

  return (
    <span
      className="px-3 py-1 text-sm rounded-full inline-block"
      style={getStyles()}
    >
      {children}
    </span>
  );
};
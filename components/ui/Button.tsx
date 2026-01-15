'use client';

import React, { ReactNode } from 'react';
import { useApp } from '@/lib/contexts/AppContext';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export const Button = ({ 
  children, 
  onClick, 
  variant = 'secondary', 
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps) => {
  const { darkMode } = useApp();

  const getStyles = () => {
    if (variant === 'primary') {
      return {
        backgroundColor: darkMode ? '#B6861F' : '#C9A227',
        color: '#FEFAF3'
      };
    }
    return {
      backgroundColor: darkMode ? '#252525' : '#e8e1ca',
      color: darkMode ? '#c4c4c4' : '#5a5a5a'
    };
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={getStyles()}
    >
      {children}
    </button>
  );
};
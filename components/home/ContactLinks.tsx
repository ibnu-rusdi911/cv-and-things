'use client';

import React from 'react';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';
import { useApp } from '@/lib/contexts/AppContext';

export const ContactLinks = () => {
  const { darkMode } = useApp();

  const linkStyle = { color: darkMode ? '#a8a8a8' : '#5a5a5a' };
  const hoverColor = darkMode ? '#B6861F' : '#C9A227';

  return (
    <div className="flex flex-wrap gap-4 mb-12">
      <a 
        href="mailto:choirulanamnasrudin@gmail.com" 
        className="inline-flex items-center gap-2 transition-colors" 
        style={linkStyle}
        onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
        onMouseLeave={(e) => e.currentTarget.style.color = linkStyle.color}
      >
        <Mail className="w-4 h-4" />
        <span className="text-sm">choirulanamnasrudin@gmail.com</span>
      </a>
      <a 
        href="#" 
        className="inline-flex items-center gap-2 transition-colors" 
        style={linkStyle}
        onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
        onMouseLeave={(e) => e.currentTarget.style.color = linkStyle.color}
      >
        <Phone className="w-4 h-4" />
        <span className="text-sm">On request</span>
      </a>
      <a 
        href="https://www.toiletman.xyz" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center gap-2 transition-colors" 
        style={linkStyle}
        onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
        onMouseLeave={(e) => e.currentTarget.style.color = linkStyle.color}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">toiletman.xyz</span>
      </a>
      <div className="inline-flex items-center gap-2" style={linkStyle}>
        <MapPin className="w-4 h-4" />
        <span className="text-sm">Jakarta, ID</span>
      </div>
    </div>
  );
};
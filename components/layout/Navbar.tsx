'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Home, Wrench, Menu, X } from 'lucide-react';
import { useApp } from '@/lib/contexts/AppContext';

export const Navbar = () => {
  const { darkMode, setDarkMode, language, setLanguage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/home') return pathname === '/home' || pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b shadow-lg" style={{ 
        backgroundColor: darkMode ? 'rgba(25, 25, 25, 0.95)' : 'rgba(243, 238, 217, 0.95)',
        borderColor: darkMode ? '#B6861F' : '#C9A227',
        boxShadow: darkMode ? '0 4px 6px -1px rgba(182, 134, 31, 0.1)' : '0 4px 6px -1px rgba(201, 162, 39, 0.1)'
      }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link 
              href="/home"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-bold cursor-pointer hover:scale-105 transition-transform" 
              style={{ color: darkMode ? '#B6861F' : '#C9A227' }}
            >
              CAN
            </Link>
            
            <div className="hidden md:flex gap-2">
              <Link
                href="/home"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                style={{ 
                  color: isActive('/home') ? '#FEFAF3' : (darkMode ? '#c4c4c4' : '#5a5a5a'),
                  backgroundColor: isActive('/home') ? (darkMode ? '#B6861F' : '#C9A227') : 'transparent'
                }}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/tools"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                style={{ 
                  color: isActive('/tools') ? '#FEFAF3' : (darkMode ? '#c4c4c4' : '#5a5a5a'),
                  backgroundColor: isActive('/tools') ? (darkMode ? '#B6861F' : '#C9A227') : 'transparent'
                }}
              >
                <Wrench className="w-4 h-4" />
                Tools
              </Link>
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ 
                color: darkMode ? '#c4c4c4' : '#5a5a5a',
                backgroundColor: darkMode ? '#252525' : '#e8e1ca'
              }}
            >
              {language === 'id' ? '🇬🇧' : '🇮🇩'}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg transition-all"
              style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}
            >
              {darkMode ? <Sun className="w-5 h-5" style={{ color: '#B6861F' }} /> : <Moon className="w-5 h-5" style={{ color: '#3A3A3A' }} />}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-all"
              style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}
            >
              {mobileMenuOpen ? 
                <X className="w-5 h-5" style={{ color: darkMode ? '#B6861F' : '#C9A227' }} /> : 
                <Menu className="w-5 h-5" style={{ color: darkMode ? '#B6861F' : '#C9A227' }} />
              }
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 backdrop-blur-sm"
          style={{ backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="absolute top-20 left-4 right-4 rounded-lg border shadow-2xl p-4"
            style={{ 
              backgroundColor: darkMode ? '#191919' : '#F3EED9',
              borderColor: darkMode ? '#B6861F' : '#C9A227'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <Link
                href="/home"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3"
                style={{ 
                  color: isActive('/home') ? '#FEFAF3' : (darkMode ? '#c4c4c4' : '#5a5a5a'),
                  backgroundColor: isActive('/home') ? (darkMode ? '#B6861F' : '#C9A227') : 'transparent'
                }}
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
              <Link
                href="/tools"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center gap-3"
                style={{ 
                  color: isActive('/tools') ? '#FEFAF3' : (darkMode ? '#c4c4c4' : '#5a5a5a'),
                  backgroundColor: isActive('/tools') ? (darkMode ? '#B6861F' : '#C9A227') : 'transparent'
                }}
              >
                <Wrench className="w-5 h-5" />
                Tools
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
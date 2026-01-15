'use client';

import { useApp } from '@/lib/contexts/AppContext';
import { Hero } from '@/components/home/Hero';
import { ContactLinks } from '@/components/home/ContactLinks';
import { Skills } from '@/components/home/Skills';
import { Projects } from '@/components/home/Projects';

export default function HomePage() {
  const { darkMode } = useApp();

  return (
    <div 
      className="min-h-screen transition-colors duration-300" 
      style={{ backgroundColor: darkMode ? '#101010' : '#FEFAF3' }}
    >
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero Section - Nama, Title, About */}
        <Hero />
        
        {/* Contact Links - Email, Phone, Website, Location */}
        <ContactLinks />
        
        {/* Skills Section - Programming, Databases, Others */}
        <Skills />
        
        {/* Projects Section - masuk-ptn.com, yuk-belajar.com, MasukPTN App */}
        {/* <Projects /> */}
        
        {/* Footer */}
        <footer 
          className="pt-8 border-t text-center" 
          style={{ borderColor: darkMode ? '#2a2a2a' : '#e5dcc5' }}
        >
          <p 
            className="text-sm" 
            style={{ color: darkMode ? '#808080' : '#8a8a8a' }}
          >
            © {new Date().getFullYear()} Choirul Anam Nasrudin. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
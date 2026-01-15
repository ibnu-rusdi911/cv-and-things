'use client';

import React from 'react';
import { useApp } from '@/lib/contexts/AppContext';

const content = {
  id: {
    name: "Choirul Anam Nasrudin",
    title: "Full Stack Developer",
    about: "Membangun solusi digital yang memudahkan akses pendidikan dan informasi. Berpengalaman mengembangkan platform edukasi dengan jutaan pengguna, dari web hingga mobile app. Passionate dalam menciptakan produk yang memberikan impact nyata bagi masyarakat.",
    aboutTitle: "Tentang Saya"
  },
  en: {
    name: "Choirul Anam Nasrudin",
    title: "Full Stack Developer",
    about: "Building digital solutions that facilitate access to education and information. Experienced in developing educational platforms serving millions of users, from web to mobile apps. Passionate about creating products that make real impact for society.",
    aboutTitle: "About Me"
  }
};

export const Hero = () => {
  const { darkMode, language } = useApp();
  const t = content[language];

  return (
    <section className="mb-24">
      <div className="mb-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
          {t.name}
        </h1>
        <p className="text-xl md:text-2xl mb-8" style={{ color: darkMode ? '#B6861F' : '#C9A227' }}>
          {t.title}
        </p>
      </div>
      
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
          {t.aboutTitle}
        </h2>
        <p className="leading-relaxed text-lg" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
          {t.about}
        </p>
      </div>
    </section>
  );
};
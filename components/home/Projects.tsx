'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useApp } from '@/lib/contexts/AppContext';
import { projects } from '@/lib/constants/projects';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const content = {
  id: {
    title: "Projek Unggulan",
    subtitle: "Beberapa projek yang telah saya kembangkan, dari platform edukasi hingga aplikasi mobile"
  },
  en: {
    title: "Featured Projects",
    subtitle: "Some projects I've developed, from educational platforms to mobile applications"
  }
};

export const Projects = () => {
  const { darkMode, language } = useApp();
  const t = content[language];
  const projectList = projects[language];

  return (
    <section className="mb-24">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
          {t.title}
        </h2>
        <p style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>{t.subtitle}</p>
      </div>
      
      <div className="space-y-8">
        {projectList.map((project, idx) => (
          <Card key={idx} hover>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                  {project.name}
                </h3>
                <p className="text-sm uppercase tracking-wide" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                  {project.type}
                </p>
              </div>
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-colors"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#232323' : '#e8e1ca'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ExternalLink className="w-5 h-5" style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }} />
              </a>
            </div>
            
            <p className="leading-relaxed mb-4" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
              {project.desc}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, i) => (
                <Badge key={i} variant="accent">{tech}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
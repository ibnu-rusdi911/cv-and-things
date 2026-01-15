'use client';

import React from 'react';
import { useApp } from '@/lib/contexts/AppContext';
import { skills } from '@/lib/constants/skills';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const title = {
  id: "Keahlian Teknis",
  en: "Technical Skills"
};

export const Skills = () => {
  const { darkMode, language } = useApp();

  return (
    <section className="mb-24">
      <h2 className="text-3xl font-bold mb-8" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
        {title[language]}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skills.map((skill, idx) => (
          <Card key={idx}>
            <h3 className="font-semibold mb-3" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
              {skill.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skill.items.map((item, i) => (
                <Badge key={i}>{item}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
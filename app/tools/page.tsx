'use client';

import { useApp } from '@/lib/contexts/AppContext';
import { toolsList } from '@/lib/constants/tools';
import { ToolCard } from '@/components/tools/ToolCard';

const content = {
  id: {
    title: "Developer Tools",
    subtitle: "Kumpulan tools sederhana yang berguna untuk produktivitas"
  },
  en: {
    title: "Developer Tools",
    subtitle: "Collection of simple tools for productivity"
  }
};

export default function ToolsPage() {
  const { darkMode, language } = useApp();
  const t = content[language];
  const tools = toolsList[language];

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: darkMode ? '#101010' : '#FEFAF3' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
            {t.title}
          </h1>
          <p style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </div>
    </div>
  );
}
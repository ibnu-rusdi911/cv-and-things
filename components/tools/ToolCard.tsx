'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { useApp } from '@/lib/contexts/AppContext';
import { Card } from '@/components/ui/Card';

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  available: boolean;
}

export const ToolCard = ({ id, name, description, icon: Icon, available }: ToolCardProps) => {
  const { darkMode } = useApp();
  const accentColor = darkMode ? '#B6861F' : '#C9A227';

  const CardContent = (
    <Card hover={available} className={available ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}>
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}>
          <Icon className="w-6 h-6" style={{ color: accentColor }} />
        </div>
        {!available && (
          <span className="px-2 py-1 text-xs rounded-full" style={{
            backgroundColor: darkMode ? '#252525' : '#e8e1ca',
            color: darkMode ? '#808080' : '#8a8a8a'
          }}>
            Coming Soon
          </span>
        )}
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
        {name}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>
        {description}
      </p>
    </Card>
  );

  if (!available) {
    return CardContent;
  }

  return (
    <Link href={`/tools/${id}`}>
      {CardContent}
    </Link>
  );
};
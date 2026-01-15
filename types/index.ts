// types/index.ts

export interface Project {
    name: string;
    type: string;
    desc: string;
    tech: string[];
    link: string;
  }
  
  export interface Skill {
    category: string;
    items: string[];
  }
  
  export interface Tool {
    id: string;
    name: string;
    description: string;
    icon: any; // LucideIcon type
    available: boolean;
  }
  
  export type Language = 'id' | 'en';
  
  export interface LocalizedContent<T> {
    id: T;
    en: T;
  }
  
// lib/hooks/useTheme.ts

import { useApp } from '@/lib/contexts/AppContext';
import { colors } from '@/lib/utils/styles';

export function useTheme() {
  const { darkMode } = useApp();
  
  const theme = darkMode ? colors.dark : colors.light;
  
  return {
    darkMode,
    colors: theme,
    isDark: darkMode,
    isLight: !darkMode
  };
}


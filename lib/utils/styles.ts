// lib/utils/styles.ts

export const colors = {
    light: {
      primary: '#C9A227',
      background: '#FEFAF3',
      surface: '#F3EED9',
      text: '#3A3A3A',
      textSecondary: '#5a5a5a',
      border: '#ddd4b8',
      hover: '#e8e1ca'
    },
    dark: {
      primary: '#B6861F',
      background: '#101010',
      surface: '#191919',
      text: '#E6E6E6',
      textSecondary: '#c4c4c4',
      border: '#2a2a2a',
      hover: '#252525'
    }
  };
  
  export const getColor = (darkMode: boolean, colorKey: keyof typeof colors.light) => {
    return darkMode ? colors.dark[colorKey] : colors.light[colorKey];
  };
  
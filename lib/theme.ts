// Theme Configuration - Change colors here
export const theme = {
  colors: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5', 
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c', // Main primary (Orange)
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    secondary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca', 
      300: '#fca5a5',
      400: '#f87171', // Main secondary (Red)
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    accent: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24', // Main accent (Yellow)
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    }
  },
  gradients: {
    primary: 'from-orange-400 to-red-400',
    secondary: 'from-red-400 to-yellow-400', 
    accent: 'from-yellow-400 to-orange-400',
    hero: 'from-orange-400 via-red-400 to-yellow-400'
  }
}

// CSS Custom Properties for easy theme switching
export const cssVariables = `
  :root {
    --color-primary: ${theme.colors.primary[400]};
    --color-secondary: ${theme.colors.secondary[400]};
    --color-accent: ${theme.colors.accent[400]};
  }
`
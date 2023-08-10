/**
 * Material UI theme
 * See for details: https://material-ui.com/customization/default-theme/?expand-path=$.palette
 * Martial Color tool: https://material.io/resources/color
 */

import { createTheme, ThemeProvider, StyledEngineProvider, CssBaseline } from '@mui/material';

const USE_DARK_MODE = true;

/**
 * Material UI theme "front" colors, "back" colors are different for Light and Dark modes
 */
const BREAKPOINTS = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      hp: 960, // just for one case :p
      lg: 1200,
      hd: 1250, // just for one case :p
      xl: 1536,
    },
  },
};

const FRONT_COLORS = {
  primary: {
    // main: '#81c784', // Green 300
    main: '#23B3FF',
    contrastText: '#000000',
  },
  secondary: {
    main: '#ffb74d', // Orange 300
    contrastText: '#000',
  },
  info: {
    main: '#0277bd', // Light Blue 800
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#2e7d32', // Green 800
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#f9a825', // Yellow 800
    // contrastText: '#000000',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#c62828', // Red 800
    contrastText: '#FFFFFF',
  },
};

/**
 * Material UI theme config for "Light Mode"
 */
const LIGHT_THEME = {
  palette: {
    mode: 'light',
    background: {
      paper: '#f5f5f5', // Gray 100 - Background of "Paper" based component
      default: '#FFFFFF',
    },
    text: {
      color: 'black',
    },
    ...FRONT_COLORS,
  },
  ...BREAKPOINTS,
};

/**
 * Material UI theme config for "Dark Mode"
 */
const DARK_THEME = {
  palette: {
    mode: 'dark',
    background: {
      paper: '#292929', // Gray 800 - Background of "Paper" based component
      default: '#000814',
    },
    text: {
      color: 'white',
    },
    ...FRONT_COLORS,
  },
  ...BREAKPOINTS,
};


const AppThemeProvider = ({ children }) => {

  
  const theme = USE_DARK_MODE ? createTheme(DARK_THEME) : createTheme(LIGHT_THEME);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline /* Material UI Styles */ />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export { AppThemeProvider, LIGHT_THEME, DARK_THEME };

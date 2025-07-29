import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// Global Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue (MUI default blue but customizable)
    },
    secondary: {
      main: '#2e7d32', // Green (success vibe)
    },
    background: {
      default: '#f9f9f9', // subtle gray for app background
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: 80,
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 6,
          padding: '4px 12px',
        },
      },
      defaultProps: {
        size: 'small',
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
)

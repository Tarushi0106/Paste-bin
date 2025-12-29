
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Container, createTheme } from '@mui/material';
import './styles.css';


import Home from './components/Home';
import CreatePaste from './components/CreatePaste';
import ViewPaste from './components/ViewPaste';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#0ea5e9',
    },
    success: {
      main: '#10b981',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const Navigation = () => {
  return (
    <Box sx={{ 
      py: 2, 
      mb: 4,
      borderBottom: 1,
      borderColor: 'divider',
      background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)'
    }}>
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box component="h1" sx={{ 
            m: 0,
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.8rem',
            fontWeight: 700,
          }}>
            PasteBin Pro
          </Box>
          <Box display="flex" gap={2}>
            <a href="/" className="nav-link">Home</a>
            <a href="/create" className="nav-link">Create</a>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Navigation />
          <Container maxWidth="xl" sx={{ py: 2 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreatePaste />} />
              <Route path="/paste/:id" element={<ViewPaste />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
          
          {/* Footer */}
          <Box component="footer" sx={{ 
            mt: 8, 
            pt: 3, 
            pb: 2,
            borderTop: 1, 
            borderColor: 'divider',
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '0.875rem'
          }}>
            <Container maxWidth="xl">
              <p>© {new Date().getFullYear()} PasteBin Pro. All rights reserved.</p>
              <p>Secure code sharing platform for professionals.</p>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TranslationHistory from './pages/TranslationHistory';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';

function App() {
  const { theme } = useTheme();
  const { isAuthenticated, loading } = useAuth();

  // Create MUI theme
  const muiTheme = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: '#8A2BE2', // Purple
      },
      secondary: {
        main: '#00CED1', // Teal
      },
      error: {
        main: '#FF4560', // Red
      },
      warning: {
        main: '#FEB019', // Amber
      },
      success: {
        main: '#00E396', // Green
      },
      background: {
        default: theme === 'dark' ? '#1A1A2E' : '#F5F5F7',
        paper: theme === 'dark' ? '#242438' : '#FFFFFF',
      },
      text: {
        primary: theme === 'dark' ? '#E0E0E0' : '#333333',
        secondary: theme === 'dark' ? '#A0A0A0' : '#6B6B6B',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) return <div>Loading...</div>;
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
  };

  // Public only route component (for login/signup - redirects to home if logged in)
  const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) return <div>Loading...</div>;
    return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
  };

  // Update document title
  useEffect(() => {
    document.title = 'English to Telugu Translator';
  }, []);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Routes>
        {/* Public only routes */}
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><Layout><TranslationHistory /></Layout></ProtectedRoute>} />
        
        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MuiThemeProvider>
  );
}

export default App;
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Container,
  Grid,
  useMediaQuery,
  useTheme as useMuiTheme,
  Fade,
  Zoom,
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent
} from '@mui/material';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Github, Twitter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface LoginError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailDomain, setEmailDomain] = useState('@gmail.com');
  const [emailLocalPart, setEmailLocalPart] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const commonDomains = [
    '@gmail.com',
    '@yahoo.com',
    '@outlook.com',
    '@hotmail.com',
    '@icloud.com'
  ];

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailLocalPart(e.target.value);
    setEmail(e.target.value + emailDomain);
  };

  const handleDomainChange = (event: SelectChangeEvent) => {
    const newDomain = event.target.value;
    setEmailDomain(newDomain);
    setEmail(emailLocalPart + newDomain);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      console.error('Login error:', err);
      const error = err as LoginError;
      setError(error.response?.data?.message || error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: { xs: 2, sm: 3 },
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)'
          : 'linear-gradient(135deg, #F5F5F7 0%, #E8EAF6 100%)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left side - Hero Section */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box sx={{ pr: { md: 4 } }}>
                <Typography 
                  variant={isMobile ? "h4" : "h3"} 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #8A2BE2, #00CED1)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    mb: 2
                  }}
                >
                  Welcome Back!
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 3,
                    lineHeight: 1.6
                  }}
                >
                  Sign in to continue your journey with TeluguTranslate. Your gateway to seamless English-Telugu translation.
                </Typography>
                
                {/* Stats Section */}
                <Box 
                  sx={{ 
                    display: 'flex',
                    gap: { xs: 2, sm: 3 },
                    flexWrap: 'wrap',
                    mb: 4
                  }}
                >
                  <Zoom in timeout={1000} style={{ transitionDelay: '200ms' }}>
                    <Box 
                      sx={{ 
                        p: { xs: 2, sm: 3 },
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        boxShadow: theme === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
                        flex: 1,
                        minWidth: { xs: 140, sm: 160 },
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)'
                        }
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                        10K+
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Users
                      </Typography>
                    </Box>
                  </Zoom>
                  <Zoom in timeout={1000} style={{ transitionDelay: '400ms' }}>
                    <Box 
                      sx={{ 
                        p: { xs: 2, sm: 3 },
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        boxShadow: theme === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
                        flex: 1,
                        minWidth: { xs: 140, sm: 160 },
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)'
                        }
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                        50K+
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Translations
                      </Typography>
                    </Box>
                  </Zoom>
                </Box>

                {/* Social Proof */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Trusted by language enthusiasts worldwide
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Github size={24} style={{ color: 'var(--mui-palette-text-secondary)' }} />
                    <Twitter size={24} style={{ color: 'var(--mui-palette-text-secondary)' }} />
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Grid>
          
          {/* Right side - Login Form */}
          <Grid item xs={12} md={6}>
            <Zoom in timeout={1000}>
              <Paper 
                elevation={4} 
                sx={{ 
                  p: { xs: 3, sm: 5 },
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  background: theme === 'dark' 
                    ? 'linear-gradient(135deg, rgba(36, 36, 56, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 245, 247, 0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme === 'dark' 
                      ? '0 8px 32px rgba(0,0,0,0.4)' 
                      : '0 8px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    component="h1" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'primary.main',
                      mb: 1.5,
                      display: { xs: 'block', md: 'none' }
                    }}
                  >
                    Welcome Back!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to continue to TeluguTranslate
                  </Typography>
                </Box>
                
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setError(null)}
                  >
                    {error}
                  </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={emailLocalPart}
                    onChange={handleEmailChange}
                    sx={{ 
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          }
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={20} style={{ color: 'var(--mui-palette-primary-main)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <FormControl variant="standard" sx={{ minWidth: 120 }}>
                            <Select
                              value={emailDomain}
                              onChange={handleDomainChange}
                              sx={{
                                '&:before': { borderBottom: 'none' },
                                '&:after': { borderBottom: 'none' },
                                '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }
                              }}
                            >
                              {commonDomains.map((domain) => (
                                <MenuItem key={domain} value={domain}>
                                  {domain}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ 
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          }
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={20} style={{ color: 'var(--mui-palette-primary-main)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Box sx={{ textAlign: 'right', mb: 3 }}>
                    <Link 
                      component={RouterLink} 
                      to="/forgot-password"
                      variant="body2"
                      underline="hover"
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': {
                          color: 'primary.dark'
                        }
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
                    sx={{ 
                      py: 1.5,
                      mb: 3,
                      borderRadius: 2,
                      fontWeight: 600,
                      position: 'relative',
                      background: 'linear-gradient(45deg, #8A2BE2, #00CED1)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(138, 43, 226, 0.3)',
                        background: 'linear-gradient(45deg, #9B4DEB, #00E5E8)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  
                  <Divider sx={{ my: 2.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Don't have an account?{' '}
                      <Link 
                        component={RouterLink} 
                        to="/signup"
                        underline="hover"
                        sx={{ 
                          fontWeight: 600,
                          color: 'primary.main',
                          '&:hover': {
                            color: 'primary.dark'
                          }
                        }}
                      >
                        Sign Up
                      </Link>
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Switch to{' '}
                      <Link 
                        component="button"
                        variant="body2"
                        onClick={toggleTheme}
                        underline="hover"
                        sx={{ 
                          fontWeight: 600,
                          color: 'primary.main',
                          '&:hover': {
                            color: 'primary.dark'
                          }
                        }}
                      >
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
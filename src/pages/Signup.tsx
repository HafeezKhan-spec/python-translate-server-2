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
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent
} from '@mui/material';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Split the name into first and last name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || firstName; // Use first name as last name if no last name provided
      
      await signup(firstName, lastName, email, password);
      navigate('/');
    } catch (err: unknown) {
      console.error('Signup error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create account. Please try again.');
      }
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
        <Grid container spacing={{ xs: 2, sm: 4 }} alignItems="center" justifyContent="center">
          {/* Left side - Welcome Text */}
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
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
                Join Us Today!
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 3,
                  lineHeight: 1.6
                }}
              >
                Create your account and start your journey with TeluguTranslate. Experience seamless English-Telugu translation at your fingertips.
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex',
                  gap: { xs: 1, sm: 2 },
                  flexWrap: 'wrap'
                }}
              >
                <Box 
                  sx={{ 
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    flex: 1,
                    minWidth: { xs: 100, sm: 120 }
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    100%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Free to Use
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    flex: 1,
                    minWidth: { xs: 100, sm: 120 }
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    24/7
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          {/* Right side - Signup Form */}
          <Grid item xs={12} md={7}>
            <Paper 
              elevation={4} 
              className="scale-in"
              sx={{ 
                p: { xs: 2, sm: 4 },
                borderRadius: { xs: 2, sm: 3 },
                transition: 'all 0.3s ease',
                background: theme === 'dark' 
                  ? 'linear-gradient(135deg, rgba(36, 36, 56, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 245, 247, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              <Box sx={{ mb: { xs: 3, sm: 4 }, textAlign: 'center' }}>
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
                  Join Us Today!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create your TeluguTranslate account
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
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ mb: 2.5 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={20} style={{ color: 'var(--mui-palette-primary-main)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={emailLocalPart}
                  onChange={handleEmailChange}
                  sx={{ mb: 2.5 }}
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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 2.5 }}
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
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  sx={{ mb: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} style={{ color: 'var(--mui-palette-primary-main)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
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
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
                
                <Divider sx={{ my: 2.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Already have an account?{' '}
                    <Link 
                      component={RouterLink} 
                      to="/login"
                      underline="hover"
                      sx={{ 
                        fontWeight: 600,
                        color: 'primary.main',
                        '&:hover': {
                          color: 'primary.dark'
                        }
                      }}
                    >
                      Sign In
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Signup;
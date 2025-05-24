import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Alert,
  CircularProgress,
  Divider,
  Container,
  Grid,
  useMediaQuery,
  useTheme as useMuiTheme,
  Fade,
  Zoom,
  InputAdornment
} from '@mui/material';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface ForgotPasswordError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const ForgotPassword = () => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const { theme } = useTheme();
  
  // Form state
  const [email, setEmail] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { forgotPassword } = useAuth();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      console.error('Forgot password error:', err);
      const error = err as ForgotPasswordError;
      setError(error.response?.data?.message || error.message || 'Failed to process request. Please try again.');
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
                  Reset Your Password
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 3,
                    lineHeight: 1.6
                  }}
                >
                  Don't worry! It happens to the best of us. Enter your email address and we'll send you instructions to reset your password.
                </Typography>
                
                {/* Security Info */}
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
                        100%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Secure Process
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
                        24/7
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Support Available
                      </Typography>
                    </Box>
                  </Zoom>
                </Box>
              </Box>
            </Fade>
          </Grid>
          
          {/* Right side - Form */}
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
                    Reset Password
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Enter your email to reset your password
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
                
                {success ? (
                  <Box sx={{ textAlign: 'center' }} className="fade-in">
                    <Alert 
                      severity="success" 
                      sx={{ mb: 4, borderRadius: 2 }}
                    >
                      Password reset instructions have been sent to your email.
                    </Alert>
                    <Typography variant="body1" paragraph>
                      Please check your email for instructions on how to reset your password.
                    </Typography>
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant="contained"
                      startIcon={<ArrowLeft size={20} />}
                      sx={{ 
                        mt: 2,
                        py: 1.5,
                        px: 4,
                        fontWeight: 600,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #8A2BE2, #00CED1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(138, 43, 226, 0.3)',
                          background: 'linear-gradient(45deg, #9B4DEB, #00E5E8)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Return to Login
                    </Button>
                  </Box>
                ) : (
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      sx={{ 
                        mb: 3,
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
                      {loading ? 'Sending Instructions...' : 'Reset Password'}
                    </Button>
                    
                    <Divider sx={{ my: 2.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        OR
                      </Typography>
                    </Divider>
                    
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Remember your password?{' '}
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
                    </Box>
                  </Box>
                )}
              </Paper>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
        bgcolor: 'background.default'
      }}
    >
      <Paper
        elevation={4}
        className="scale-in"
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          borderRadius: 3
        }}
      >
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: '8rem', 
            fontWeight: 800,
            color: 'primary.main',
            lineHeight: 1.1
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Page Not Found
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<ArrowLeft />}
          onClick={() => navigate('/')}
          sx={{ 
            py: 1.5,
            px: 3,
            borderRadius: 2,
            fontWeight: 600
          }}
        >
          Back to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
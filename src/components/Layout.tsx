import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ 
        flexGrow: 1, 
        py: 4,
        px: { xs: 2, sm: 3, md: 4 },
        maxWidth: { sm: 'sm', md: 'md', lg: 'lg' }
      }}>
        <Box className="fade-in">
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default Layout;
import { type ReactNode } from 'react';
import { AuthProvider } from './auth/AuthContext';
import { PostProvider } from './post/PostContext';
import Navbar from './components/headers/nav';
import { Box } from '@mui/material';

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AuthProvider>
      <PostProvider>
        <Box sx={{position:"relative", mt:"65px"}}>
          <Navbar/>
          {children}
        </Box>
      </PostProvider>
    </AuthProvider>
  );
};

export default Providers;

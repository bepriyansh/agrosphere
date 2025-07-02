import {
  Box,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import { keyframes } from '@mui/system';

// Custom animations
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const LoaderPage = () => {
  const theme = useTheme();

  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          backdropFilter: 'blur(10px)',
          zIndex: 9999,
        }}
      >
        {/* Main loader container */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            animation: `${floatAnimation} 3s ease-in-out infinite`,
          }}
        >
          {/* Animated logo/icon area */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Outer ring */}
            <Box
              sx={{
                position: 'absolute',
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                animation: `${pulseAnimation} 2s ease-in-out infinite`,
              }}
            />
            
           
            
            {/* Center dot */}
            <Box
              sx={{
                position: 'absolute',
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                animation: `${pulseAnimation} 1.5s ease-in-out infinite`,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default LoaderPage;

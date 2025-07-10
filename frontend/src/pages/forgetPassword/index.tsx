import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Link,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { type FormEvent } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SecurityIcon from '@mui/icons-material/Security';
import { sendResetLink } from '../../api/auth';

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
}

interface ForgotPasswordFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const ForgotPassword: React.FC = () => {
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    document.title = "Forget Password";
  }, []);


  const handleSubmit = async (event: FormEvent<ForgotPasswordFormElement>) => {
    event.preventDefault();
    setFormError(null);
    const emailValue = event.currentTarget.elements.email.value.trim();
    if (!emailValue) {
      setFormError("Email is required.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailValue)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    try {
      setIsLoading(true);
      
      // Console log the email as requested
      console.log('Email submitted:', emailValue);
      
      await sendResetLink(emailValue);
      
      // Show the success message after API call completes
      setShowMessage(true);
      setEmail(emailValue);
      
    } catch (error) {
      console.error('Error sending reset email:', error);
      // Handle error state here if needed
    } finally {
      // Always set loading to false when done
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          padding: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            maxWidth: 900,
            width: '100%',
            height: isMobile ? 'auto' : '450px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          {/* Left Column - Information Section */}
          <Box
            sx={{
              flex: 1,
              background: '#cffafe',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#002D74',
              padding: 3,
              minHeight: isMobile ? '250px' : '450px',
              borderRadius: isMobile ? '20px 20px 0 0' : '20px 0 0 20px'
            }}
          >
            <SecurityIcon sx={{ fontSize: 60, marginBottom: 2, opacity: 0.9 }} />
            
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center"
              sx={{ 
                fontWeight: 'bold',
                marginBottom: 1.5,
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}
            >
              Secure Reset
            </Typography>
            
            <Typography 
              variant="body1" 
              align="center"
              sx={{ 
                marginBottom: 2.5,
                opacity: 0.9,
                lineHeight: 1.5,
                fontSize: { xs: '0.9rem', md: '1rem' },
                maxWidth: '280px'
              }}
            >
              Don't worry, it happens to the best of us. We'll help you get back into your account safely.
            </Typography>

            <Box sx={{ textAlign: 'center', opacity: 0.8 }}>
              <Typography variant="body2" sx={{ marginBottom: 0.5, fontSize: '0.85rem' }}>
                ✓ Secure password reset
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 0.5, fontSize: '0.85rem' }}>
                ✓ Email verification
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                ✓ Account protection
              </Typography>
            </Box>
          </Box>

          {/* Right Column - Form Section */}
          <Box sx={{ flex: 1 }}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: isMobile ? '0 0 20px 20px' : '0 20px 20px 0',
                boxShadow: 'none',
                border: 'none',
                backgroundColor: '#fafafa'
              }}
            >
              <CardContent 
                sx={{ 
                  padding: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: isMobile ? '350px' : '450px'
                }}
              >
                <Box sx={{ textAlign: 'center', marginBottom: 2.5 }}>
                  <LockOutlinedIcon 
                    sx={{ 
                      fontSize: 35, 
                      color: '#002D74',
                      marginBottom: 1.5 
                    }} 
                  />
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom 
                    sx={{ fontWeight: 'bold', color: '#002D74' }}
                  >
                    Reset Password
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="#002D74"
                    sx={{ marginBottom: 2.5, fontSize: '0.9rem' }}
                  >
                    Enter your email address and we'll send you a secure link.
                  </Typography>
                </Box>

                {!showMessage ? (
                  <form onSubmit={handleSubmit}>
                    {formError && (
                      <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{formError}</Alert>
                    )}
                    <TextField
                      fullWidth
                      required
                      id="email"
                      name="email"
                      label="Email Address"
                      type="email"
                      variant="outlined"
                      margin="normal"
                      disabled={isLoading}
                      sx={{ 
                        marginBottom: 2.5,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'white'
                        }
                      }}
                      placeholder="Enter your email address"
                    />
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                      sx={{ 
                        marginTop: 1,
                        marginBottom: 2.5,
                        padding: '10px',
                        fontSize: '1rem',
                        borderRadius: '12px',
                        backgroundColor: '#003674db',
                        position: 'relative',
                        '&:disabled': {
                          backgroundColor: '#003674db',
                          opacity: 0.7
                        }
                      }}
                    >
                      {isLoading && (
                          <CircularProgress 
                            size={20} 
                            sx={{ 
                              color: 'white',
                              marginRight: 1
                            }} 
                          />
                      )}
                      {isLoading ? '': 'Send Reset Link' }
                    </Button>
                  </form>
                ) : (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      marginTop: 1,
                      marginBottom: 2.5,
                      textAlign: 'center',
                      borderRadius: '12px',
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bfdbfe'
                    }}
                  >
                    If any account exists with this email ({email}), reset password link has been sent.
                  </Alert>
                )}

                {/* Login Link */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                    Remember your password?{' '}
                    <Link 
                      href="/login" 
                      underline="hover"
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#003674db',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: '#002D74'
                        }
                      }}
                    >
                      Back to Login
                    </Link>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;

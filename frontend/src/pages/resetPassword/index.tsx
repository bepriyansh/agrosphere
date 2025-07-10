import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, LockReset, CheckCircle, Error } from '@mui/icons-material';
import { resetPassword, validateResetToken } from "../../api/auth";

interface FormElements extends HTMLFormControlsCollection {
  newPassword: HTMLInputElement;
  confirmPassword: HTMLInputElement;
}

interface ResetPasswordFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string>('');

  useEffect(() => {
    document.title = "Reset Password";
    
    // Validate token on component mount
    if (token) {
      validateToken();
    } else {
      setError('Invalid reset link. No token provided.');
      setIsValidatingToken(false);
    }
  }, [token]);

  const validateToken = async () => {
    try {
      setIsValidatingToken(true);
      setError('');
      
      const response = await validateResetToken(token!);
      
      if (response.data.isValid) {
        setIsTokenValid(true);
      } else {
        setError('Password reset token is invalid or has expired.');
      }
    } catch (err) {
        console.error('Token validation error:', err);
        setError('Failed to validate reset token.');
    } finally {
      setIsValidatingToken(false);
    }
  };

  // Add form validation for password fields before API call
  const validatePasswords = (password: string, confirmPassword: string): boolean => {
    if (!password || !confirmPassword) {
      setPasswordError('Both password fields are required.');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<ResetPasswordFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validate passwords
    if (!validatePasswords(newPassword, confirmPassword)) {
      return;
    }

    try {
      setIsResettingPassword(true);
      setError('');
      
      await resetPassword(token!, newPassword);
      setIsPasswordReset(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to reset password.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Loading state while validating token
  if (isValidatingToken) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center'
          }}
        >
          <CircularProgress size={60} sx={{ marginBottom: 3, color: '#003674db' }} />
          <Typography variant="h6" color="text.secondary">
            Validating reset token...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Success state after password reset
  if (isPasswordReset) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center'
          }}
        >
          <CheckCircle sx={{ fontSize: 80, color: '#4caf50', marginBottom: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#4caf50' }}>
            Password Reset Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 3 }}>
            Your password has been reset successfully. You will be redirected to the login page in a few seconds.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              backgroundColor: '#003674db',
              borderRadius: '12px',
              padding: '10px 30px'
            }}
          >
            Go to Login
          </Button>
        </Box>
      </Container>
    );
  }

  // Error state or invalid token
  if (!isTokenValid) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center'
          }}
        >
          <Error sx={{ fontSize: 80, color: '#f44336', marginBottom: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#f44336' }}>
            Invalid Reset Link
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 3 }}>
            {error || 'The password reset link is invalid or has expired.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/forgot-password')}
            sx={{
              backgroundColor: '#003674db',
              borderRadius: '12px',
              padding: '10px 30px'
            }}
          >
            Request New Reset Link
          </Button>
        </Box>
      </Container>
    );
  }

  // Main reset password form
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
            height: isMobile ? 'auto' : '500px',
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
              minHeight: isMobile ? '250px' : '500px',
              borderRadius: isMobile ? '20px 20px 0 0' : '20px 0 0 20px'
            }}
          >
            <LockReset sx={{ fontSize: 60, marginBottom: 2, opacity: 0.9 }} />
            
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
              New Password
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
              Create a strong, secure password to protect your account.
            </Typography>

            <Box sx={{ textAlign: 'center', opacity: 0.8 }}>
              <Typography variant="body2" sx={{ marginBottom: 0.5, fontSize: '0.85rem' }}>
                ✓ At least 8 characters
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 0.5, fontSize: '0.85rem' }}>
                ✓ Secure encryption
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
                  minHeight: isMobile ? '400px' : '500px'
                }}
              >
                <Box sx={{ textAlign: 'center', marginBottom: 2.5 }}>
                  <LockReset 
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
                    Reset Your Password
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="#002D74"
                    sx={{ marginBottom: 2.5, fontSize: '0.9rem' }}
                  >
                    Enter your new password below.
                  </Typography>
                </Box>

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      marginBottom: 2,
                      borderRadius: '12px'
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    required
                    name="newPassword"
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    margin="normal"
                    disabled={isResettingPassword}
                    sx={{ 
                      marginBottom: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'white'
                      }
                    }}
                    placeholder="Enter your new password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                            disabled={isResettingPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    name="confirmPassword"
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    margin="normal"
                    disabled={isResettingPassword}
                    sx={{ 
                      marginBottom: passwordError ? 1 : 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'white'
                      }
                    }}
                    placeholder="Confirm your new password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={toggleConfirmPasswordVisibility}
                            edge="end"
                            disabled={isResettingPassword}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {passwordError && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        marginBottom: 2,
                        borderRadius: '12px'
                      }}
                    >
                      {passwordError}
                    </Alert>
                  )}
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isResettingPassword}
                    sx={{ 
                      marginTop: 1,
                      marginBottom: 2.5,
                      padding: '12px',
                      fontSize: '1rem',
                      borderRadius: '12px',
                      backgroundColor: '#003674db',
                      '&:disabled': {
                        backgroundColor: '#003674db',
                        opacity: 0.7
                      }
                    }}
                  >
                    {isResettingPassword ? (
                      <>
                        <CircularProgress 
                          size={20} 
                          sx={{ 
                            color: 'white',
                            marginRight: 1
                          }} 
                        />
                        Resetting Password...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </form>

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

export default ResetPassword;

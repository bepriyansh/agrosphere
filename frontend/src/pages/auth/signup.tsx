import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import wolf from "/images/wolf.png";
import { useAuth } from "../../auth/useAuth";
import { signupApi } from "../../api/auth";

export default function SignUp() {
  const [hidePassword, setHidePassword] = useState(true);
  const [signupInfo, setSignupInfo] = useState<{
    username: string;
    email: string;
    password: string;
  }>({
    username: "",
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const navigate = useNavigate(); 
  const { login } = useAuth();


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSignupInfo({ ...signupInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setError(null);
    if (!signupInfo.username.trim() || !signupInfo.email.trim() || !signupInfo.password.trim()) {
      setFormError("All fields are required.");
      return;
    }
    // Basic email format check
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(signupInfo.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (signupInfo.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const authData = await signupApi(signupInfo);
      login(authData);
      navigate("/"); 
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        height: "90dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: "#cffafe",
          display: "flex",
          borderRadius: 5,
          width: "100%",
          maxWidth: 900,
          p: 3,
          boxShadow: 3,
        }}
      >
        <Box sx={{ flex: 1, color: "#002D74", px: 3 }}>
          <Typography variant="h5" sx={{ mt: 4, fontWeight: "bold" }}>
            Sign Up
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
            Create your account to get started!
          </Typography>

          <form onSubmit={handleSubmit}>
            {(formError || error) && (
              <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
                {formError || error}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Username"
              name="username"
              variant="outlined"
              margin="normal"
              value={signupInfo.username}
              onChange={handleChange}
              autoComplete="username"
              sx={{
                borderRadius: 3,
                '& .MuiOutlinedInput-root': { borderRadius: 3 },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              margin="normal"
              value={signupInfo.email}
              onChange={handleChange}
              autoComplete="email"
              sx={{
                borderRadius: 3,
                '& .MuiOutlinedInput-root': { borderRadius: 3 },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={hidePassword ? "password" : "text"}
              variant="outlined"
              margin="normal"
              value={signupInfo.password}
              onChange={handleChange}
              autoComplete="new-password"
              sx={{
                borderRadius: 3,
                '& .MuiOutlinedInput-root': { borderRadius: 3 },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setHidePassword(!hidePassword)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {hidePassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                mb: 2,
                bgcolor: '#003674db',
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {loading ? "Registering" : "Register"}
            </Button>
          </form>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Divider sx={{ my: 2, borderRadius: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption" sx={{ display: "flex", alignItems: "center" }}>
                Already have an account?
              </Typography>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                  }}
                >
                  Log In
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 1, display: { xs: "none", sm: "flex" }, justifyContent: "center", alignItems: "center" }}>
          <img
            src={wolf}
            alt="wolf"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

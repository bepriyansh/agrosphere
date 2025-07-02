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
import { loginApi } from "../../api/auth";
import { useAuth } from "../../auth/useAuth";

export default function Login() {
  const [hidePassword, setHidePassword] = useState(true);
  const [loginInfo, setLoginInfo] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); 
  const { login } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    try {
      const authData = await loginApi(loginInfo);
      login(authData);
      navigate("/"); 
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    }finally {
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
            Login
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
            If you're already a member, easily log in
          </Typography>

          <form onSubmit={handleSubmit}>
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Username"
              name="username"
              variant="outlined"
              margin="normal"
              value={loginInfo.username}
              onChange={handleChange}
              autoComplete="username"
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
              value={loginInfo.password}
              onChange={handleChange}
              autoComplete="current-password"
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
              {loading ? "Logging In" : "Log In"}
            </Button>
          </form>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Link to="/forgot-password" style={{ textDecoration: "none" }}>
              <Typography variant="caption" sx={{ cursor: "pointer"}}>
                Forgot Password
              </Typography>
            </Link>
            <Divider sx={{ my: 2, borderRadius: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption" sx={{ display: "flex", alignItems: "center" }}>
                If you don't have an account, create
              </Typography>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 3, 
                    textTransform: "none",
                  }}
                >
                  Register
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
        <Box sx={{  flex: 1, display: {xs:"none", sm:"flex"}, justifyContent: "center", alignItems: "center" }}>
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

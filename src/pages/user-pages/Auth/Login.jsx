import React, { useState, useContext } from 'react'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  Alert,
  InputAdornment
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import AuthLayout from '../../../layouts/user-layouts/AuthLayout'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useContext(AuthContext);

  // Get the previous path from state (if any)
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async () => {
    setError("");
    try {
      if (!username || !password) {
        setError("Please enter both username and password");
        return;
      }

      const result = await login({ username, password });

      if (result.success) {
        console.log("Login successful:", result.users);
        sessionStorage.setItem("username", result.users.username);
        if (result.users.role_id === '1') {
          navigate("/admin/dashboard");
        } else {
          // Redirect back to the previous page or home
          navigate(from, { replace: true });
        }
      } else {
        setError("Incorrect username or password");
      }
    } catch (error) {
      // Display error message from API (including disabled account errors)
      setError(error.message || "Incorrect username or password");
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.password) {
      setError('Please enter both username and password')
      return
    }
    try {
      const result = await login(form)
      if (result.success) {
        if (result.user.role_id === 1) {
          navigate('/admin/dashboard')
        } else {
          // Redirect back to the previous page or home
          navigate(from, { replace: true })
        }
      } else {
        setError(result.message || 'Incorrect username or password')
      }
    } catch (err) {
      // Display error message from API (including disabled account errors)
      setError(err.message || 'Incorrect username or password')
    }
  }



  return (
    <AuthLayout>
      <Box
        sx={{
          maxWidth: '100%',
          backgroundColor: '#ffffffff',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            pl: { xs: 2, sm: 3, md: 6 }

          }}
        >
          <Paper
            elevation={0}
            sx={{
              height: { xs: 'auto', sm: 480, md: 500 },
              width: { xs: '100%', sm: 420, md: 450 },
              p: { xs: 4, sm: 9 },
              py: { xs: 5, sm: 5 },
              ml: 0,
              borderRadius: 2,
              color: '#000000ff',
              background: 'rgba(255, 255, 255, 0.16)',
              border: '1px solid rgba(255,255,255,0.22)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(10px)',
              marginTop: { xs: 2, md: 7 }

            }}
          >
                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              Sign in
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 4, display: 'flex', justifyContent: 'center' }}>
              Welcome back
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3.5}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ style: { color: 'rgba(0, 0, 0, 0.9)' } }}
                  inputProps={{ style: { color: '#000000ff' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(120, 120, 120, 0.35)' },
                      '&:hover fieldset': { borderColor: '#000000ff' },
                      '&.Mui-focused fieldset': { borderColor: '#000000ff' },
                      '&.label': { color: '#fff' },
                      '& label.Mui-focused': {
                        color: '#fff',
                      },
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: 2,
                      height: 56
                    }
                  }}
                />

                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  placeholder="Enter password"
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ style: { color: 'rgba(0, 0, 0, 0.9)' } }}
                  InputProps={{
                    style: { color: '#000000ff' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton sx={{ color: 'rgba(120, 120, 120, 0.35)' }}
                          aria-label={show ? "Hide password" : "Show password"}
                          onClick={() => setShow((s) => !s)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {show ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(120, 120, 120, 0.35)' },
                      '&:hover fieldset': { borderColor: '#000000ff' },
                      '&.Mui-focused fieldset': { borderColor: '#000000ff' },
                      '&.label': { color: '#000000ff' },
                      '& label.Mui-focused': {
                        color: '#000000ff'
                      },
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: 2,
                      height: 56
                    }
                  }}
                />

                {error && (
                  <Alert severity="error" sx={{ mt: 2, fontSize: 16, textAlign: 'center' }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  onClick={handleLogin}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    letterSpacing: 0.4,
                    background: '#242636',
                    boxShadow: '0 8px 20px rgba(62, 54, 121, 0.35)',
                    '&:hover': {
                      background: '#303346ff',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  Sign in
                </Button>

                <Box sx={{ textAlign: 'left', mt: -2 }}>
                  <Typography
                    component="a"
                    href="#"
                    sx={{
                      color: 'rgba(0, 0, 0, 0.8)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      '&:hover': {
                        color: '#rgba(120, 120, 120, 0.35)',
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Forgot password?
                  </Typography>
                </Box>
              </Stack>
            </Box>

          </Paper>
        </Container>
      </Box>
    </AuthLayout>
  )
}

export default Login

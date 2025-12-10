import React, { useState, useContext } from 'react'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
  IconButton,
  Alert,
  InputAdornment
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { useNavigate } from 'react-router-dom'
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
  const { login } = useContext(AuthContext);


  const handleLogin = async () => {
    setError("");
    try {
      if (!username || !password) {
        setError("Vui lòng nhập đầy đủ Username và Mật khẩu");
        return;
      }

      const result = await login({ username, password });

      if (result.success) {
        console.log("Login successful:", result.users);
        sessionStorage.setItem("username", result.users.username);
        if (result.users.role_id === '1') {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (error) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
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
      setError('Vui lòng nhập đầy đủ Username và Mật khẩu')
      return
    }
    try {
      const result = await login(form)
      if (result.success) {
        if (result.user.role_id === 1) {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        setError(result.message || 'Tên đăng nhập hoặc mật khẩu không đúng')
      }
    } catch (err) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng')
    }
  }

  const handleGoogleLogin = () => {
    console.log('Google login clicked')
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
              height: { xs: 'auto', sm: 520, md: 560 },
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
              Đăng nhập
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 4, display: 'flex', justifyContent: 'center' }}>
              Chào mừng bạn trở lại
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3.5}>
                <TextField
                  fullWidth
                  name="username"
                  label="Tài khoản"
                  placeholder="Nhập tài khoản"
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
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
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
                          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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
                  Đăng nhập
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
                    Quên mật khẩu?
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ my: 4 }}>
              <Divider sx={{
                borderColor: 'rgba(120, 120, 120, 0.35)',
                '&::before, &::after': {
                  borderColor: 'rgba(120, 120, 120, 0.35)',
                }
              }}>
                <Typography variant="body2" sx={{
                  color: 'rgba(0, 0, 0, 0.8)',
                  px: 2,
                  fontSize: '14px'
                }}>
                  hoặc
                </Typography>
              </Divider>
            </Box>

            <Button
              onClick={handleGoogleLogin}
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                borderColor: 'rgba(120, 120, 120, 0.35)',
                color: '#000000ff',
                fontWeight: 600,
                background: 'rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.6)',
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-1px)',
                },
                '& .MuiSvgIcon-root': {
                  color: '#000000ff',
                }
              }}
            >
              Đăng nhập với Google
            </Button>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography
                component="a"
                href="/dang-ky"
                sx={{
                  color: 'rgba(0, 0, 0, 0.8)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  '&:hover': {
                    color: '#rgba(120, 120, 120, 0.35)',
                    textDecoration: 'underline',
                  }
                }}
              >
                Chưa có tài khoản? Đăng ký
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </AuthLayout>
  )
}

export default Login

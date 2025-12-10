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
    Alert,
    InputAdornment,
    IconButton
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
import AuthLayout from '../../../layouts/user-layouts/AuthLayout'

const Signup = () => {
    const [form, setForm] = useState({
        username: '',
        full_name: '',
        phone: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: ''
    })
    const [show, setShow] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()
    const { signup } = useContext(AuthContext)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const validatePhone = (phone) => {
        return /^[0-9]{9,12}$/.test(phone)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (
            !form.username ||
            !form.full_name ||
            !form.phone ||
            !form.email ||
            !form.address ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError('Vui lòng nhập đầy đủ thông tin')
            return
        }

        if (!validateEmail(form.email)) {
            setError('Email không hợp lệ')
            return
        }

        if (!validatePhone(form.phone)) {
            setError('Số điện thoại không hợp lệ')
            return
        }

        if (form.password.length < 6) {
            setError('Mật khẩu phải từ 6 ký tự trở lên')
            return
        }

        if (form.password !== form.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp')
            return
        }

        try {
            const result = await signup({
                username: form.username,
                full_name: form.full_name,
                phone: form.phone,
                email: form.email,
                address: form.address,
                password: form.password
            })

            if (result.success) {
                setSuccess('Đăng ký thành công!')
                setTimeout(() => {
                    navigate('/login')
                }, 1500)
            } else {
                setError(result.message)
            }
        } catch (err) {
            setError(err.message || 'Đăng ký thất bại, vui lòng thử lại')
        }
    }

    return (
        <AuthLayout>
            <Box
                sx={{
                    maxWidth: '100%',
                    minHeight: '100vh',
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
                        marginBottom: { xs: 4, md: 16 },
                        pl: { xs: 2, sm: 3, md: 6 }
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            height: { xs: 'auto', sm: 520, md: 670 },
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
                        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ display: 'flex', justifyContent: 'center', mb: 2, paddingBottom: { xs: 0, md: 3 } }}>
                            Đăng ký
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
                                            background: 'rgba(255,255,255,0.06)',
                                            borderRadius: 2,
                                            height: 56
                                        }
                                    }}
                                />
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        name="full_name"
                                        label="Họ và tên"
                                        placeholder="Nhập họ và tên"
                                        value={form.full_name}
                                        onChange={handleChange}
                                        variant="outlined"
                                        fullWidth
                                        InputLabelProps={{ style: { color: 'rgba(0, 0, 0, 0.9)' } }}
                                        inputProps={{ style: { color: '#000000ff' } }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: 'rgba(120, 120, 120, 0.35)' },
                                                '&:hover fieldset': { borderColor: '#000000ff' },
                                                '&.Mui-focused fieldset': { borderColor: '#000000ff' },
                                                background: 'rgba(255,255,255,0.06)',
                                                borderRadius: 2,
                                                height: 56
                                            }
                                        }}
                                    />
                                    <TextField
                                        name="phone"
                                        label="Số điện thoại"
                                        placeholder="Nhập số điện thoại"
                                        value={form.phone}
                                        onChange={handleChange}
                                        variant="outlined"
                                        fullWidth
                                        InputLabelProps={{ style: { color: 'rgba(0, 0, 0, 0.9)' } }}
                                        inputProps={{ style: { color: '#000000ff' } }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: 'rgba(120, 120, 120, 0.35)' },
                                                '&:hover fieldset': { borderColor: '#000000ff' },
                                                '&.Mui-focused fieldset': { borderColor: '#000000ff' },
                                                background: 'rgba(255,255,255,0.06)',
                                                borderRadius: 2,
                                                height: 56
                                            }
                                        }}
                                    />
                                </Stack>
                                <TextField
                                    fullWidth
                                    name="email"
                                    label="Email"
                                    placeholder="Nhập email"
                                    value={form.email}
                                    onChange={handleChange}
                                    variant="outlined"
                                    InputLabelProps={{ style: { color: 'rgba(0, 0, 0, 0.9)' } }}
                                    inputProps={{ style: { color: '#000000ff' } }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: 'rgba(120, 120, 120, 0.35)' },
                                            '&:hover fieldset': { borderColor: '#000000ff' },
                                            '&.Mui-focused fieldset': { borderColor: '#000000ff' },
                                            background: 'rgba(255,255,255,0.06)',
                                            borderRadius: 2,
                                            height: 56
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    name="address"
                                    label="Địa chỉ"
                                    placeholder="Nhập địa chỉ"
                                    value={form.address}
                                    onChange={handleChange}
                                    variant="outlined"
                                    InputLabelProps={{ style: { color: 'rgba(0, 0, 0, 0.9)' } }}
                                    inputProps={{ style: { color: '#000000ff' } }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: 'rgba(120, 120, 120, 0.35)' },
                                            '&:hover fieldset': { borderColor: '#000000ff' },
                                            '&.Mui-focused fieldset': { borderColor: '#000000ff' },
                                            background: 'rgba(255,255,255,0.06)',
                                            borderRadius: 2,
                                            height: 56
                                        }
                                    }}
                                />
                                <Stack direction="row" spacing={2}>
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
                                                background: 'rgba(255,255,255,0.06)',
                                                borderRadius: 2,
                                                height: 56
                                            }
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        name="confirmPassword"
                                        label="Xác nhận mật khẩu"
                                        placeholder="Nhập lại mật khẩu"
                                        type={show ? 'text' : 'password'}
                                        value={form.confirmPassword}
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
                                                background: 'rgba(255,255,255,0.06)',
                                                borderRadius: 2,
                                                height: 56
                                            }
                                        }}
                                    />
                                </Stack>

                                {error && (
                                    <Alert severity="error" sx={{ mt: 2, fontSize: 16, textAlign: 'center' }}>
                                        {error}
                                    </Alert>
                                )}
                                {success && (
                                    <Alert severity="success" sx={{ mt: 2, fontSize: 16, textAlign: 'center' }}>
                                        {success}
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    size="large"
                                    variant="contained"
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
                                    Đăng ký
                                </Button>
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

                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography
                                component="a"
                                href="/dang-nhap"
                                sx={{
                                    color: 'rgba(0, 0, 0, 0.8)',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    '&:hover': {
                                        color: 'rgba(120, 120, 120, 0.35)',
                                        textDecoration: 'underline',
                                    }
                                }}
                            >
                                Đã có tài khoản? Đăng nhập
                            </Typography>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </AuthLayout>
    )
}

export default Signup

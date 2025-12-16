import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/user-layouts/MainLayout';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Divider,
    Card,
    CardMedia,
    CardContent,
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';

import Toast from '../../components/user-components/Toast';
import { useCart } from '../../hooks/useCart';
import { createOrder } from '../../services/orderApi';

const CarBooking = () => {
    const navigate = useNavigate();
    const { getSelectedItems, removeSelectedItems } = useCart();
    const cartItems = getSelectedItems(); // Chỉ lấy sản phẩm được chọn
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
    });
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const [errors, setErrors] = useState({
        fullName: '',
        phone: '',
        email: ''
    });

    // Lấy thông tin user từ localStorage
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setFormData({
                    fullName: user.full_name || '',
                    phone: user.phone || '',
                    email: user.email || '',
                    address: user.address || '',
                });
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const handleInputChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value
        });
        // Clear error khi user bắt đầu nhập
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCloseToast = () => {
        setToast({ ...toast, open: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            setToast({ open: true, message: 'Vui lòng điền đầy đủ thông tin bắt buộc!', severity: 'error' });
            return;
        }

        if (cartItems.length === 0) {
            setToast({ open: true, message: 'Giỏ hàng trống!', severity: 'error' });
            return;
        }

        setLoading(true);

        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            // Tạo đơn hàng cho từng sản phẩm
            for (const item of cartItems) {
                const orderData = {
                    user_id: user?.id || null,
                    car_id: item.car_id,
                    quantity: item.quantity,
                    order_date: new Date().toISOString(),
                    status: 'pending',
                    note: notes
                };

                await createOrder(orderData);
            }

            // Xóa các sản phẩm đã đặt khỏi giỏ hàng
            await removeSelectedItems();

            localStorage.removeItem('selectedCartItems');

            setToast({ open: true, message: 'Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.', severity: 'success' });

            // Chuyển về trang chủ sau 2 giây
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Error submitting order:', error);
            setToast({ open: true, message: 'Có lỗi xảy ra. Vui lòng thử lại!', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(p);

    return (
        <MainLayout>
            <Box
                sx={{
                    pt: { xs: 15, md: 20 },
                    pb: 10,
                    backgroundColor: '#f5f5f5',
                    minHeight: '100vh',
                }}
            >
                <Container maxWidth="lg">
                    <Paper
                        sx={{
                            p: 4,
                            mb: 3,
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                mb: 4,
                                color: '#1a1a1a',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <PersonIcon /> Thông Tin Liên Hệ
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Họ và tên"
                                        required
                                        placeholder="Nhập họ và tên"
                                        value={formData.fullName}
                                        onChange={handleInputChange('fullName')}
                                        error={Boolean(errors.fullName)}
                                        helperText={errors.fullName}
                                        InputProps={{
                                            startAdornment: <PersonIcon sx={{ mr: 1, color: '#999', fontSize: 20 }} />
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Số điện thoại"
                                        required
                                        type="tel"
                                        placeholder="Nhập số điện thoại"
                                        value={formData.phone}
                                        onChange={handleInputChange('phone')}
                                        error={Boolean(errors.phone)}
                                        helperText={errors.phone}
                                        InputProps={{
                                            startAdornment: <PhoneIcon sx={{ mr: 1, color: '#999', fontSize: 20 }} />
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        required
                                        type="email"
                                        placeholder="Nhập email"
                                        value={formData.email}
                                        onChange={handleInputChange('email')}
                                        error={Boolean(errors.email)}
                                        helperText={errors.email}
                                        InputProps={{
                                            startAdornment: <EmailIcon sx={{ mr: 1, color: '#999', fontSize: 20 }} />
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Địa chỉ"
                                        placeholder="Nhập địa chỉ"
                                        value={formData.address}
                                        onChange={handleInputChange('address')}
                                        InputProps={{
                                            startAdornment: <HomeIcon sx={{ mr: 1, color: '#999', fontSize: 20 }} />
                                        }}
                                    />
                                </Grid>
                            </Grid>



                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    mb: 3,
                                    color: '#1a1a1a',
                                }}
                            >
                                Ghi Chú
                            </Typography>

                            <TextField
                                fullWidth
                                label="Ghi chú (tùy chọn)"
                                multiline
                                rows={4}
                                placeholder="Thời gian liên hệ thuận tiện, yêu cầu đặc biệt..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <Divider sx={{ my: 4 }} />

                            {/* Thông Tin Xe */}
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    color: '#1a1a1a',
                                }}
                            >
                                Thông Tin Xe
                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                            {cartItems.length === 0 ? (
                                <Typography sx={{ mb: 3, color: '#666', textAlign: 'center', py: 4 }}>
                                    Giỏ hàng trống. Vui lòng thêm xe vào giỏ hàng trước khi đặt lịch.
                                </Typography>
                            ) : (
                                <Box sx={{ mb: 3 }}>
                                    {cartItems.map((item, index) => (
                                        <Card
                                            key={item.id}
                                            sx={{
                                                mb: 2,
                                                overflow: 'hidden',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                                                    transform: 'translateY(-2px)',
                                                }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: { xs: 'column', md: 'row' },
                                                    p: 2,
                                                    gap: 2,
                                                }}
                                            >
                                                {/* Hình ảnh */}
                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                    <Box
                                                        sx={{
                                                            width: { xs: '100%', md: 160 },
                                                            height: 100,
                                                            borderRadius: 2,
                                                            overflow: 'hidden',
                                                            backgroundColor: '#f5f5f5',
                                                            flexShrink: 0,
                                                            border: '1px solid #e0e0e0'
                                                        }}
                                                    >
                                                        <img
                                                            src={item.image || '/placeholder-car.jpg'}
                                                            alt={item.name}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>

                                                {/* Thông tin xe */}
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 700,
                                                            mb: 1,
                                                            color: '#1a1a1a',
                                                            fontSize: { xs: '1rem', md: '1.25rem' }
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                    {item.description && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                mb: 1,
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                lineHeight: 1.5
                                                            }}
                                                        >
                                                            {item.description}
                                                        </Typography>
                                                    )}
                                                </Box>

                                                {/* Thông tin giá - Desktop */}
                                                <Box
                                                    sx={{
                                                        display: { xs: 'none', md: 'flex' },
                                                        gap: 3,
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Box sx={{ textAlign: 'right', minWidth: 140 }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                            Đơn giá
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                                                            {formatPrice(item.price)}
                                                        </Typography>
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            textAlign: 'center',
                                                            minWidth: 80,
                                                            px: 2,
                                                            py: 1,
                                                            backgroundColor: '#f5f5f5',
                                                            borderRadius: 1
                                                        }}
                                                    >
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                            Số lượng
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                                                            {item.quantity}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ textAlign: 'right', minWidth: 160 }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                            Thành tiền
                                                        </Typography>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontWeight: 700,
                                                                color: '#d32f2f'
                                                            }}
                                                        >
                                                            {formatPrice(item.price * item.quantity)}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* Thông tin giá - Mobile */}
                                                <Box
                                                    sx={{
                                                        display: { xs: 'flex', md: 'none' },
                                                        flexDirection: 'column',
                                                        gap: 1,
                                                        pt: 1,
                                                        borderTop: '1px solid #e0e0e0'
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="body2" color="text.secondary">Đơn giá:</Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatPrice(item.price)}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="body2" color="text.secondary">Số lượng:</Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.quantity}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px dashed #e0e0e0' }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Thành tiền:</Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#d32f2f' }}>
                                                            {formatPrice(item.price * item.quantity)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Card>
                                    ))}
                                </Box>
                            )}


                            <Divider sx={{ my: 4 }} />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 2
                                }}
                            >
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Tổng thanh toán: <strong>{cartItems.length} xe</strong>
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: '#d32f2f',
                                            fontWeight: 700,
                                            mt: 0.5
                                        }}
                                    >
                                        {formatPrice(calculateTotal())}
                                    </Typography>
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading || cartItems.length === 0}
                                    sx={{
                                        backgroundColor: '#1a1a1a',
                                        color: '#fff',
                                        px: 6,
                                        py: 1.5,
                                        fontSize: 16,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: '#333',
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#ccc',
                                        }
                                    }}
                                >
                                    {loading ? 'Đang xử lý...' : 'Xác Nhận'}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Lưu ý */}
                    <Paper sx={{ p: 3, backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            📌 Lưu ý:
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                            • Nhân viên sẽ liên hệ xác nhận trong 24h<br />
                            • Vui lòng mang CMND/CCCD khi nhận xe<br />
                            • Thanh toán trực tiếp tại showroom
                        </Typography>
                    </Paper>

                </Container>
            </Box>
            <Toast
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={handleCloseToast}
            />
        </MainLayout>
    );
};

export default CarBooking;

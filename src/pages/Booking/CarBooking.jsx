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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Toast from '../../components/user-components/Toast';
import { useCart } from '../../hooks/useCart';
import { createOrder } from '../../services/orderApi';

const CarBooking = () => {
    const navigate = useNavigate();
    const { getSelectedItems } = useCart();
    const cartItems = getSelectedItems(); // Get only selected items

    const [selectedDate, setSelectedDate] = useState(null);
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
        email: '',
        selectedDate: ''
    });

    // Load user information from localStorage
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

        // Clear error when user starts typing
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
            newErrors.fullName = 'Please enter your full name';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Please enter your phone number';
        } else if (!/^[0-9]{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Invalid phone number';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Please enter your email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!selectedDate) {
            newErrors.selectedDate = 'Please select a pickup date';
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
            setToast({
                open: true,
                message: 'Please fill in all required fields!',
                severity: 'error'
            });
            return;
        }

        if (cartItems.length === 0) {
            setToast({
                open: true,
                message: 'Your cart is empty!',
                severity: 'error'
            });
            return;
        }

        setLoading(true);

        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            const orderData = {
                user_id: user?.id || null,
                pickup_date: selectedDate.format('YYYY-MM-DD'),
                notes: notes,
                total_amount: calculateTotal(),
                status: 'pending',
                items: cartItems.map(item => ({
                    car_id: item.car_id,
                    quantity: item.quantity,
                    price: Number(item.price)
                })),
                created_at: new Date().toISOString()
            };

            await createOrder(orderData);

            localStorage.removeItem('selectedCartItems');

            setToast({
                open: true,
                message: 'Booking successful! We will contact you shortly.',
                severity: 'success'
            });

        } catch (error) {
            console.error('Error submitting order:', error);
            setToast({
                open: true,
                message: 'An error occurred. Please try again!',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (p) =>
        new Intl.NumberFormat('vi-VN', {
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
                    <Paper sx={{ p: 4, mb: 3 }}>
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
                            <PersonIcon /> Contact Information
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        required
                                        placeholder="Enter your full name"
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
                                        label="Phone Number"
                                        required
                                        type="tel"
                                        placeholder="Enter phone number"
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
                                        placeholder="Enter email"
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
                                        label="Address"
                                        placeholder="Enter address"
                                        value={formData.address}
                                        onChange={handleInputChange('address')}
                                        InputProps={{
                                            startAdornment: <HomeIcon sx={{ mr: 1, color: '#999', fontSize: 20 }} />
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 4 }} />

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    mb: 3,
                                    color: '#1a1a1a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <CalendarTodayIcon /> Select Pickup Date
                            </Typography>

                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                        adapterLocale="vi"
                                    >
                                <DatePicker
                                    label="Pickup Date"
                                    value={selectedDate}
                                    onChange={(newValue) => {
                                        setSelectedDate(newValue);
                                        if (errors.selectedDate) {
                                            setErrors({ ...errors, selectedDate: '' });
                                        }
                                    }}
                                    disablePast
                                    minDate={dayjs().add(3, 'day')}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            required: true,
                                            error: Boolean(errors.selectedDate),
                                                    helperText: errors.selectedDate || 'Choose a date. (at least 3 days after)',
                                                    sx: {
                                                        '& .MuiFormHelperText-root': {
                                                            color: errors.selectedDate ? '#d32f2f !important' : 'rgba(0, 0, 0, 0.6)',
                                                            fontWeight: errors.selectedDate ? 600 : 400,
                                                            fontSize: '0.875rem'
                                                        }
                                                    }
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 4 }} />

                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3,color: '#1a1a1a' }}>
                                Notes
                            </Typography>

                            <TextField
                                fullWidth
                                label="Notes (optional)"
                                multiline
                                rows={4}
                                placeholder="Preferred contact time, special requests..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <Divider sx={{ my: 4 }} />

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    color: '#1a1a1a',
                                }}
                            >
                                Vehicle infomation
                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                            {cartItems.length === 0 ? (
                                <Typography sx={{ mb: 3, color: '#666', textAlign: 'center', py: 4 }}>
                                    Your cart is empty. Please add vehicles before booking.
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

                                                <Box
                                                    sx={{
                                                        display: { xs: 'none', md: 'flex' },
                                                        gap: 3,
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Box sx={{ textAlign: 'right', minWidth: 140 }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                            Price
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
                                                            Amount
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                                                            {item.quantity}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ textAlign: 'right', minWidth: 160 }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                            Total
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
                                                        <Typography variant="body2" color="text.secondary">Price:</Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatPrice(item.price)}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="body2" color="text.secondary">Amount:</Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.quantity}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px dashed #e0e0e0' }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Total:</Typography>
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
                                        Total: <strong>{cartItems.length} xe</strong>
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
                                    {loading ? 'Processing...' : 'Confirm Booking'}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 3, backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            📌 Note:
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                            • Our staff will contact you within 24 hours<br />
                            • Please bring your ID when picking up the vehicle<br />
                            • Payment is made directly at the showroom
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

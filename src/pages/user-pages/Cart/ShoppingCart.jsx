import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../layouts/user-layouts/MainLayout';
import {
    Box,
    Container,
    Stack,
    Typography,
    Checkbox,
    IconButton,
    Button,
    TextField,
    Divider,
    Grid,
    Card,
    CardMedia,
    CardContent,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
    Speed,
    Person,
    FavoriteBorder,
    ArrowForward,
} from '@mui/icons-material';
import { useCart } from '../../../hooks/useCart';

const CartShopee = () => {
    const navigate = useNavigate();

    const {
        cartItems,
        loading,
        updateItemQuantity,
        removeItem,
        toggleItemSelection,
        toggleAllSelection,
        removeSelectedItems,
        getSelectedCount,
        getSelectedTotal,
        isAllSelected,
    } = useCart();

    const items = cartItems;



    const recommendedCars = [
        {
            id: 4,
            name: 'Mercedes-Benz S-Class',
            image: '/proj_images/mecerdes-benz/sedan/s-class.png',
            price: 11000000000,
            transmission: 'Automatic',
            seats: 4,
        },
        {
            id: 6,
            name: 'Mercedes-Benz GLS',
            image: '/proj_images/mecerdes-benz/SUV/gls.png',
            price: 8900000000,
            transmission: 'Automatic',
            seats: 7,
        },
        {
            id: 3,
            name: 'Mercedes-Benz G-Class',
            image: '/proj_images/mecerdes-benz/SUV/G63.avif',
            price: 10000000000,
            transmission: 'Manual',
            seats: 4,
        },
        {
            id: 2,
            name: 'Mercedes-Benz GLE',
            image: '/proj_images/mecerdes-benz/SUV/gle.png',
            price: 2000000000,
            transmission: 'Automatic',
            seats: 4,
        },
        {
            id: 9,
            name: 'Mercedes-Benz GLC',
            image: '/proj_images/mecerdes-benz/SUV/glc.png',
            price: 5500000000,
            transmission: 'Automatic',
            seats: 5,
        },
        {
            id: 15,
            name: 'Mercedes-AMG SL Roadster',
            image: '/proj_images/AMG/cabriolet/cabriolet.avif',
            price: 8500000000,
            transmission: 'Automatic',
            seats: 2,
        },
    ];


    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    const allChecked = isAllSelected();
    const selectedCount = getSelectedCount();
    const total = getSelectedTotal();

    const handleToggleAll = (checked) => {
        toggleAllSelection(checked);
    };

    const handleToggleOne = (id, checked) => {
        toggleItemSelection(id, checked);
    };

    const handleQtyChange = async (id, qty) => {
        await updateItemQuantity(id, Math.max(1, qty || 1));
    };

    const handleRemoveOne = async (id) => {
        await removeItem(id);
    };

    const handleRemoveSelected = async () => {
        await removeSelectedItems();
    };

    const handleCarClick = (car) => {
        const carSlug = car.name.toLowerCase().replace(/\s+/g, '-');
        navigate(`/san-pham/${carSlug}`, { state: { productId: car.id } });
    };

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
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: 1,
                            mb: 1,
                            px: 2,
                            py: 1.5,
                            display: { xs: 'none', md: 'grid' },
                            gridTemplateColumns: '40px 4fr 2fr 2fr 80px',
                            alignItems: 'center',
                            fontSize: 14,
                            color: 'text.secondary',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox
                                size="small"
                                checked={allChecked}
                                onChange={(e) => handleToggleAll(e.target.checked)}
                            />
                        </Box>
                        <Typography variant="body2">Sản phẩm</Typography>
                        <Typography variant="body2">Đơn giá</Typography>
                        <Typography variant="body2">Số lượng</Typography>
                        <Typography variant="body2" sx={{ textAlign: 'right' }}>
                            Thao tác
                        </Typography>
                    </Box>

                    <Box sx={{ backgroundColor: '#fff', borderRadius: 1, overflow: 'hidden' }}>
                        {items.map((item, index) => (
                            <Box key={item.id}>
                                <Box
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        display: 'grid',
                                        gridTemplateColumns: { xs: 'auto 1fr', md: '40px 4fr 2fr 2fr 80px' },
                                        columnGap: 2,
                                        rowGap: { xs: 1, md: 0 },
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: { xs: 'flex-start', md: 'flex-start' },
                                        }}
                                    >
                                        <Checkbox
                                            size="small"
                                            checked={item.selected}
                                            onChange={(e) => handleToggleOne(item.id, e.target.checked)}
                                        />
                                    </Box>

                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 1,
                                                overflow: 'hidden',
                                                border: '1px solid #eee',
                                                backgroundColor: '#fafafa',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                        </Box>
                                        <Typography
                                            sx={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {item.name}
                                        </Typography>
                                    </Stack>

                                    <Box
                                        sx={{
                                            display: { xs: 'none', md: 'block' },
                                            fontSize: 14,
                                            color: '#ee4d2d',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {formatPrice(item.price)}
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                border: '1px solid #ddd',
                                                borderRadius: 0.5,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                                                sx={{
                                                    borderRadius: 0,
                                                    width: 32,
                                                    height: 32,
                                                    '&:hover': { backgroundColor: '#f5f5f5' },
                                                }}
                                            >
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <TextField
                                                size="small"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleQtyChange(item.id, parseInt(e.target.value) || 1)
                                                }
                                                sx={{
                                                    width: 50,
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { border: 'none' },
                                                    },
                                                    '& input': {
                                                        textAlign: 'center',
                                                        padding: '4px',
                                                        fontSize: 14,
                                                    },
                                                }}
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                                                sx={{
                                                    borderRadius: 0,
                                                    width: 32,
                                                    height: 32,
                                                    '&:hover': { backgroundColor: '#f5f5f5' },
                                                }}
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Box>

                                        <Typography
                                            sx={{
                                                display: { xs: 'block', md: 'none' },
                                                fontSize: 14,
                                                color: '#ee4d2d',
                                                fontWeight: 600,
                                                ml: 1,
                                            }}
                                        >
                                            {formatPrice(item.price * item.quantity)}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ textAlign: 'right' }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveOne(item.id)}
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            <DeleteOutlineIcon sx={{ color: '#ee4d2d' }} fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                                {index < items.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </Box>

                    {selectedCount > 0 && (
                        <Box sx={{ mt: 2, textAlign: 'right' }}>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteOutlineIcon />}
                                onClick={handleRemoveSelected}
                                sx={{ textTransform: 'none' }}
                            >
                                Xóa {selectedCount} sản phẩm đã chọn
                            </Button>
                        </Box>
                    )}

                    <Box
                        sx={{
                            position: 'sticky',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: '#fff',
                            borderTop: '1px solid #e0e0e0',
                            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                    >
                        <Container maxWidth="lg">
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    py: 2,
                                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                                    gap: 2,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Checkbox
                                        checked={allChecked}
                                        onChange={(e) => handleToggleAll(e.target.checked)}
                                    />
                                    <Typography variant="body2">
                                        Chọn tất cả ({items.length})
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: { xs: 2, md: 4 },
                                        flexWrap: { xs: 'wrap', md: 'nowrap' },
                                    }}
                                >
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Tổng thanh toán ({selectedCount} sản phẩm):
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: '#ee4d2d',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {formatPrice(total)}
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        disabled={selectedCount === 0}
                                        sx={{
                                            backgroundColor: '#000',
                                            color: '#fff',
                                            px: 5,
                                            py: 1.5,
                                            fontSize: 16,
                                            fontWeight: 500,
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: '#333',
                                            },
                                            '&:disabled': {
                                                backgroundColor: '#ccc',
                                                color: '#666',
                                            },
                                        }}
                                    >
                                        Mua hàng
                                    </Button>
                                </Box>
                            </Box>
                        </Container>
                    </Box>

                    <Box sx={{ mt: 6 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                mb: 3,
                                color: '#1a1a1a',
                            }}
                        >
                            Các Mẫu Xe Bạn Có Thể Thích
                        </Typography>

                        <Grid container spacing={3}>
                            {recommendedCars.map((car) => (
                                <Grid size={4} key={car.id}>
                                    <Card
                                        sx={{
                                            height: 510,
                                            borderRadius: 4,
                                            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                                            color: 'white',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            border: 'none',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '2px',
                                                background: 'linear-gradient(90deg, transparent, #fff, transparent)',
                                                opacity: 0.1
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            position: 'relative',
                                            background: 'linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%)',
                                            p: 2.5,
                                            height: 280
                                        }}>
                                            <CardMedia
                                                component="img"
                                                image={car.image}
                                                alt={car.name}
                                                sx={{
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.2))',
                                                    transition: 'transform 0.4s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)'
                                                    }
                                                }}
                                            />

                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '60%',
                                                    background: 'linear-gradient(to top, rgba(26, 26, 26, 0.4), transparent)',
                                                    pointerEvents: 'none'
                                                }}
                                            />

                                            <IconButton
                                                sx={{
                                                    position: 'absolute',
                                                    top: 16,
                                                    right: 16,
                                                    width: 44,
                                                    height: 44,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    backdropFilter: 'blur(10px)',
                                                    zIndex: 10,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 255, 255, 1)',
                                                        transform: 'scale(1.1)',
                                                    }
                                                }}
                                            >
                                                <FavoriteBorder sx={{ color: '#1a1a1a', fontSize: 22 }} />
                                            </IconButton>
                                        </Box>

                                        <CardContent sx={{
                                            p: 3,
                                            pt: 2.5,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2
                                        }}>
                                            <Typography
                                                variant="h6"
                                                fontWeight={700}
                                                sx={{
                                                    color: '#ffffff',
                                                    fontSize: '1.2rem',
                                                    letterSpacing: '0.5px',
                                                    lineHeight: 1.3
                                                }}
                                            >
                                                {car.name}
                                            </Typography>

                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                gap={2.5}
                                                sx={{
                                                    pb: 2,
                                                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                                                }}
                                            >
                                                <Box display="flex" alignItems="center" gap={0.8}>
                                                    <Person sx={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.7)' }} />
                                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                                                        {car.seats}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={0.8}>
                                                    <Speed sx={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.7)' }} />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'rgba(255, 255, 255, 0.9)',
                                                            textTransform: 'capitalize',
                                                            fontWeight: 500,
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        {car.transmission}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box display="flex" alignItems="flex-end" justifyContent="space-between">
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'rgba(255, 255, 255, 0.6)',
                                                            fontSize: '0.95rem',
                                                            mb: 0.5,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '1px',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        Giá
                                                    </Typography>
                                                    <Typography
                                                        fontWeight={700}
                                                        fontSize={20}
                                                        sx={{
                                                            color: '#ffffff',
                                                            letterSpacing: '0.5px'
                                                        }}
                                                    >
                                                        {formatPrice(car.price)}
                                                    </Typography>
                                                </Box>

                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleCarClick(car)}
                                                    endIcon={<ArrowForward />}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                                                        color: '#1a1a1a',
                                                        px: 2.5,
                                                        py: 1,
                                                        borderRadius: 2,
                                                        fontWeight: 600,
                                                        textTransform: 'none',
                                                        boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 6px 16px rgba(255, 255, 255, 0.3)',
                                                        }
                                                    }}
                                                >
                                                    Chi tiết
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>


        </MainLayout>
    );
};

export default CartShopee;
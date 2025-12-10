import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Grid,
    Typography,
    Fade,
    Skeleton
} from '@mui/material'
import React, { useEffect, useState, useCallback } from 'react'
import { getFeatureCars } from '../../../services/featureCarApi'

const FeaturedCar = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchCars = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const carData = await getFeatureCars();
            setCars(Array.isArray(carData) ? carData : []);
        } catch (error) {
            console.error('Error fetching cars:', error);
            setError(true);
            setCars([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    if (loading) {
        return (
            <Box sx={{ py: { xs: 6, md: 8 } }}>
                <Container maxWidth="xl">
                    <Box mt={4} mb={7}>
                        <Skeleton variant="text" width="40%" height={60} sx={{ mx: 'auto', mb: 3 }} />
                        <Skeleton variant="text" width="60%" height={30} sx={{ mx: 'auto' }} />
                    </Box>
                    <Grid container spacing={4} justifyContent="center">
                        {[1, 2, 3].map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item}>
                                <Skeleton variant="rectangular" width={350} height={450} sx={{ borderRadius: 3 }} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ py: { xs: 6, md: 8 } }}>
                <Container maxWidth="xl">
                    <Typography variant="h5" textAlign="center" color="error">
                        Không thể tải dữ liệu xe. Vui lòng thử lại sau.
                    </Typography>
                    <Box textAlign="center" mt={2}>
                        <Button variant="contained" onClick={fetchCars}>
                            Thử lại
                        </Button>
                    </Box>
                </Container>
            </Box>
        );
    }

    if (!cars || cars.length === 0) {
        return (
            <Box sx={{ py: { xs: 6, md: 8 } }}>
                <Container maxWidth="xl">
                    <Typography variant="h5" textAlign="center">
                        Hiện tại chưa có xe nào được hiển thị.
                    </Typography>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ py: { xs: 6, md: 8 } }}>
            <Container maxWidth="xl">
                <Box mt={4} mb={7}>
                    <Typography
                        variant="h4"
                        textAlign="center"
                        sx={{
                            fontWeight: 'bold',
                            color: '#000000',
                            mb: 3,
                            fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                    >
                        Danh Sách Xe Nổi Bật
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            textAlign: 'center',
                            color: '#666666',
                            fontSize: { xs: '1rem', md: '1.2rem' },
                            maxWidth: '600px',
                            mx: 'auto'
                        }}
                    >
                        Khám phá những mẫu xe ưu chuộng nhất hiện nay, mang đến trải nghiệm lái đỉnh cao và phong cách sang trọng
                    </Typography>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    {cars.map((car, index) => (
                        <Grid item xs={12} sm={6} md={4} key={car.id || car.name || index}>
                            <Fade in={true} timeout={600 + index * 200}>
                                <Card
                                    sx={{
                                        maxWidth: 400,
                                        height: 500,
                                        position: 'relative',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',

                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',

                                            '& .car-image': {
                                                transform: 'scale(1.05)',
                                            },

                                            '& .description-container': {
                                                maxHeight: '120px',
                                            }
                                        }
                                    }}
                                >
                                    <CardMedia
                                        className="car-image"
                                        component="img"
                                        sx={{
                                            height: 280,
                                            width: '100%',
                                            objectFit: 'contain',
                                            display: 'block',
                                            mx: 'auto',
                                            transition: 'transform 0.4s ease',

                                        }}
                                        image={car.image || 'https://via.placeholder.com/350x200?text=No+Image'}
                                        alt={car.name}

                                    />

                                    <CardContent sx={{
                                        p: 3,
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Typography
                                            variant="h5"
                                            component="div"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '1.4rem',
                                                color: '#1a1a1a',
                                                mb: 2,
                                                lineHeight: 1.3
                                            }}
                                        >
                                            {car.name || 'Tên xe không có'}
                                        </Typography>

                                        <Box
                                            className="description-container"
                                            sx={{
                                                maxHeight: '48px',
                                                overflow: 'hidden',
                                                transition: 'max-height 0.3s ease',

                                                mb: 2
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontSize: '1rem',
                                                    color: '#666666',
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {car.description || 'Mô tả sản phẩm sẽ được cập nhật sớm. Xe này mang đến trải nghiệm lái tuyệt vời với thiết kế hiện đại và công nghệ tiên tiến.'}
                                            </Typography>
                                        </Box>

                                        <CardActions sx={{ p: 0, gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: '#000',
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                    borderRadius: 2,
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                    px: 3,
                                                    py: 1.2,
                                                    '&:hover': {
                                                        backgroundColor: '#232323',
                                                        boxShadow: '0 4px 16px rgba(0,0,0,0.13)'
                                                    }
                                                }}
                                            >
                                                Xem chi tiết
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    color: '#1976d2',
                                                    borderColor: '#1976d2',
                                                    fontWeight: 600,
                                                    borderRadius: 2,
                                                    px: 3,
                                                    py: 1.2,
                                                    ml: 2,
                                                    '&:hover': {
                                                        backgroundColor: '#e3f2fd',
                                                        color: '#1565c0',
                                                        borderColor: '#1565c0'
                                                    }
                                                }}
                                            >
                                                Đăng ký lái thử
                                            </Button>

                                        </CardActions>
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default FeaturedCar;

import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../../../layouts/user-layouts/MainLayout';
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Button,
  Rating,
  CircularProgress,
  Divider,
  Paper,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Speed,
  Person,
  LocalGasStation,
  FavoriteBorder,
  CheckCircle
} from '@mui/icons-material';
import { GiCarDoor } from "react-icons/gi";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import Toast from '../../../components/user-components/Toast';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import getCarDetail from '../../../services/carDetail';
import { useCars } from '../../../hooks/useCars';
import { useCart } from '../../../hooks/useCart';

const ProductDetail = () => {
  const { name } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { cars } = useCars();
  const { addItem } = useCart();

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');


  const productId = location.state?.productId;

  useEffect(() => {
    setLoading(true);

    const fetchProduct = async () => {
      try {
        let id = productId;

        if (!id && name && cars.length > 0) {
          const foundCar = cars.find(car =>
            car.name.toLowerCase().replace(/\s+/g, '-') === name
          );
          id = foundCar?.id;
        }

        if (id) {
          const data = await getCarDetail(id);
          setProduct(data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, name, cars]);

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress sx={{ color: '#1a1a1a' }} />
        </Box>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography variant="h6">Product not found</Typography>
        </Box>
      </MainLayout>
    );
  }

  const images = product.image
    ? [product.image, ...(product.imageDetail && product.imageDetail.filter(img => img) || [])]
    : product.imageDetail && product.imageDetail.filter(img => img) || [];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = async () => {
    try {
      const result = await addItem(product.id, 1);

      if (result.success) {
        if (result.isUpdate) {
          setToastMessage('Car added to cart successfully!');
        } else {
          setToastMessage('Car added to cart successfully!');
        }
        setToastSeverity('success');
        setToastOpen(true);
      } else {
        // Check if error is due to unauthenticated user
        if (result.error === 'NOT_AUTHENTICATED') {
          setToastMessage(result.message || 'Please log in to add products to your cart.');
          setToastSeverity('warning');
          setToastOpen(true);

          // Redirect to login page after 1.5 seconds
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        } else {
          setToastMessage('An error occurred while adding to cart!');
          setToastSeverity('error');
          setToastOpen(true);
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToastMessage('An error occurred while adding to cart!');
      setToastSeverity('error');
      setToastOpen(true);
    }
  };
  const handleCloseToast = () => {
    setToastOpen(false);
  }



  return (
    <MainLayout>
      <Toast
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={handleCloseToast}
      />
      <Box sx={{
        pt: { xs: 12, md: 15 },
        pb: 8,
        background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        minHeight: '100vh',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100vw',
        marginTop: '40px'
      }}>
        <Container maxWidth="xl">

          <Grid container spacing={4}>
            <Grid size={7}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                  position: 'relative',

                }}
              >
                <Box
                  sx={{
                    height: { xs: 350, md: 465 },
                    backgroundColor: '#f8f8f8',
                    position: 'relative'

                  }}
                >
                  <Swiper
                    modules={[Thumbs, Navigation, Pagination]}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={10}
                    style={{ height: '100%', width: '100%' }}
                  >
                    {images.map((src, idx) => (
                      <SwiperSlide key={`main-${idx}`}>
                        <Box
                          sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 4
                          }}
                        >
                          <img
                            src={src}
                            alt={`${product.name}-${idx}`}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </Box>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          '&:hover': { backgroundColor: '#fff' }
                        }}
                      >
                        <FavoriteBorder />
                      </IconButton>

                    </Stack>
                  </Box>
                </Box>

                <Box sx={{ p: 2, backgroundColor: '#fff' }}>
                  <Swiper
                    modules={[FreeMode, Thumbs]}
                    onSwiper={setThumbsSwiper}
                    freeMode
                    watchSlidesProgress
                    slidesPerView={4}
                    spaceBetween={12}
                    breakpoints={{
                      640: { slidesPerView: 5 },
                      768: { slidesPerView: 6 },
                    }}
                  >
                    {images.map((src, idx) => (
                      <SwiperSlide key={`thumb-${idx}`}>
                        <Box
                          sx={{
                            border: '2px solid transparent',
                            borderRadius: 2,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            height: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f8f8f8',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#1a1a1a',

                            },
                          }}
                        >
                          <img
                            src={src}
                            alt={`thumb-${idx}`}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </Box>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              </Paper>
            </Grid>

            <Grid size={5}>
              <Stack spacing={3}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#1a1a1a',
                    lineHeight: 1.2,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  {product.name}
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Rating
                    value={4.5}
                    precision={0.5}
                    readOnly
                    sx={{ color: '#1a1a1a' }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    4.5
                  </Typography>
                  <Divider orientation="vertical" flexItem />
                    <Typography variant="body2" color="text.secondary">
                    137 reviews
                  </Typography>
                  <Divider orientation="vertical" flexItem />
                  <Typography variant="body2" color="text.secondary">
                    812 bookings
                  </Typography>
                </Stack>

                <Divider />

                <Box
                  sx={{
                    backgroundColor: '#f8f8f8',
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      SELLING PRICE
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="baseline">
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: '#1a1a1a',
                          fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                      >
                        {formatPrice(product.price)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
                      <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
                        Best price on the market
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Specifications
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={3}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#1a1a1a',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        <Speed sx={{ fontSize: 32, color: '#1a1a1a', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Transmission
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                          {product.transmission}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid size={3}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#1a1a1a',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        <LocalGasStation sx={{ fontSize: 32, color: '#1a1a1a', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Fuel type
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                          {product.fuel_type}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid size={3}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#1a1a1a',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        <Person sx={{ fontSize: 32, color: '#1a1a1a', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Seats
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {product.seats} seats
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid size={3}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#1a1a1a',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        <GiCarDoor style={{ fontSize: 32, color: '#1a1a1a', marginBottom: 8 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Doors
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {product.doors} doors
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{
                          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                          color: '#fff',
                          py: 1.8,
                          fontSize: '1rem',
                          fontWeight: 700,
                          textTransform: 'none',
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Buy Now
                      </Button>
                    </Grid>
                    <Grid size={6}>
                      <Button
                        variant="outlined"
                        size="large"
                        fullWidth
                        onClick={handleAddToCart}
                        sx={{
                          color: '#1a1a1a',
                          borderColor: '#1a1a1a',
                          py: 1.6,
                          fontSize: '1rem',
                          fontWeight: 700,
                          textTransform: 'none',
                          borderRadius: 2,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                            borderColor: '#1a1a1a',
                            backgroundColor: 'rgba(26, 26, 26, 0.04)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <MdOutlineAddShoppingCart style={{ marginRight: '10px' }} />
                        Add to cart
                      </Button>
                    </Grid>
                  </Grid>
                </Stack>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    backgroundColor: '#f8f8f8',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CheckCircle sx={{ fontSize: 20, color: '#4caf50' }} />
                      <Typography variant="body2">Comprehensive insurance</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CheckCircle sx={{ fontSize: 20, color: '#4caf50' }} />
                      <Typography variant="body2">24/7 support</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CheckCircle sx={{ fontSize: 20, color: '#4caf50' }} />
                      <Typography variant="body2">Free home delivery</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CheckCircle sx={{ fontSize: 20, color: '#4caf50' }} />
                      <Typography variant="body2">Free car replacement in case of issues</Typography>
                    </Stack>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ mt: 6 }}>
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{
                  borderBottom: '1px solid #e0e0e0',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#666',
                    '&.Mui-selected': {
                      color: '#1a1a1a',
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#1a1a1a',
                    height: 3,
                  }
                }}
              >
                <Tab label="Detailed description" />
                <Tab label="Reviews" />
                <Tab label="Policy" />
              </Tabs>

              <Box sx={{ p: 4 }}>
                {tabValue === 0 && (
                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      About {product.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {product.description || 'Mercedes-Benz is a symbol of luxury, class, and outstanding performance. Each Mercedes-Benz is meticulously crafted with cutting-edge technology, delivering an emotional and exceptionally safe driving experience.'}
                    </Typography>
                  </Stack>
                )}
                {tabValue === 1 && (
                  <Typography variant="body1" color="text.secondary">
                  Customer review section...
                  </Typography>
                )}
                {tabValue === 2 && (
                  <Typography variant="body1" color="text.secondary">
                    Rental policy...
                  </Typography>
                )}
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default ProductDetail;
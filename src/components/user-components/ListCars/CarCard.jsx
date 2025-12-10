import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    IconButton,
    Chip
} from '@mui/material';
import {
    Person,
    Speed,
    Favorite,
    FavoriteBorder,
    ArrowForward
} from '@mui/icons-material';
import { GiCarDoor } from "react-icons/gi";
import ButtonLink from './ButtonLink';

const CarCard = ({ car, favorites, onToggleFavorite, formatVND }) => {
    return (
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
                    onClick={() => onToggleFavorite(car.id)}
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
                    {favorites.has(car.id) ?
                        <Favorite sx={{ color: '#f44336', fontSize: 22 }} /> :
                        <FavoriteBorder sx={{ color: '#1a1a1a', fontSize: 22 }} />
                    }
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
                        <GiCarDoor style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.7)' }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                            {car.doors}
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
                            {formatVND(car.price)}
                            <Typography
                                component="span"
                                sx={{
                                    fontSize: '13px',
                                    ml: 0.5,
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontWeight: 500
                                }}
                            >
                                {car.period}
                            </Typography>
                        </Typography>
                    </Box>

                    <ButtonLink car={car} />
                </Box>
            </CardContent>
        </Card>
    );
};

export default CarCard;

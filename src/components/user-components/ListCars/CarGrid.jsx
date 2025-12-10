import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { DirectionsCar } from '@mui/icons-material';
import CarCard from './CarCard';

const CarGrid = ({ 
    cars, 
    favorites, 
    onToggleFavorite, 
    onViewDetails, 
    formatVND,
    hasMore,
    onLoadMore 
}) => {
    if (cars.length === 0) {
        return (
            <Grid item xs={12}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        minHeight: '300px',
                        textAlign: 'center',
                        py: 4
                    }}
                >
                    <DirectionsCar
                        sx={{
                            fontSize: 80,
                            color: '#ccc',
                            mb: 2
                        }}
                    />
                    <Typography
                        variant="h5"
                        fontWeight={600}
                        sx={{
                            color: '#666',
                            mb: 1
                        }}
                    >
                        Không tìm thấy kết quả
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#999',
                            maxWidth: '400px'
                        }}
                    >
                        Không có xe nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử điều chỉnh bộ lọc.
                    </Typography>
                </Box>
            </Grid>
        );
    }

    return (
        <>
            <Grid container spacing={3} sx={{ display: 'flex', marginLeft: { xs: 1, md: 2 } }}>
                {cars.map((car, index) => (
                    <Grid item xs={12} sm={6} md={3} size={4} key={`${car.id}-${index}`}>
                        <CarCard
                            car={car}
                            favorites={favorites}
                            onToggleFavorite={onToggleFavorite}
                            onViewDetails={onViewDetails}
                            formatVND={formatVND}
                        />
                    </Grid>
                ))}
            </Grid>

            {hasMore && (
                <Box display="flex" justifyContent="center" mt={5}>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={onLoadMore}
                        sx={{
                            borderColor: '#1a1a1a',
                            color: '#1a1a1a',
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#1a1a1a',
                                color: 'white'
                            }
                        }}
                    >
                        Load More Cars
                    </Button>
                </Box>
            )}
        </>
    );
};

export default CarGrid;
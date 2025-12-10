import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    TextField,
    MenuItem
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import MainLayout from '../../../layouts/user-layouts/MainLayout';
import FilterSidebar from '../../../components/user-components/ListCars/FilterSidebar';
import CarGrid from '../../../components/user-components/ListCars/CarGrid';
import useCars from '../../../hooks/useCars';
import useCategories from '../../../hooks/useCategories';
import useCarFilters from '../../../hooks/useCarFilters';
import { formatVND } from '../../../utils/formatters';

const ListCars = () => {
    const [favorites, setFavorites] = useState(new Set());
    const [displayedCars, setDisplayedCars] = useState(6);
    const [searchKeyword, setSearchKeyword] = useState('');
    const location = useLocation();
    
    const { cars, loading: carsLoading } = useCars();
    const { categories, loading: categoriesLoading } = useCategories();
    
    const {
        filteredCars,
        sortBy,
        setSortBy,
        selectedPriceRanges,
        setSelectedPriceRanges,
        selectedCategory,
        setSelectedCategory,
        selectedFuelTypes,
        setSelectedFuelTypes,
        selectedTransmission,
        setSelectedTransmission,
        clearFilters
    } = useCarFilters(cars, categories);

    const filteredBySearch = useMemo(() => {
        const keyword = searchKeyword.trim().toLowerCase();
        if (!keyword) return filteredCars;

        return filteredCars.filter((car) =>
            (car.name && car.name.toLowerCase().includes(keyword)) ||
            (car.description && car.description.toLowerCase().includes(keyword))
        );
    }, [filteredCars, searchKeyword]);

    const totalResults = filteredBySearch.length;
    const visibleCars = filteredBySearch.slice(0, displayedCars);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const keyword = params.get('search') || '';
        setSearchKeyword(keyword);
        setDisplayedCars(6); // reset pagination when keyword changes
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [location.search]);

    const handleLoadMore = () => {
        setDisplayedCars(prevCount => prevCount + 6);
    };

    const toggleFavorite = (carId) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(carId)) {
            newFavorites.delete(carId);
        } else {
            newFavorites.add(carId);
        }
        setFavorites(newFavorites);
    };

    const handlePriceRangeChange = (range) => {
        const newRanges = new Set(selectedPriceRanges);
        if (newRanges.has(range)) {
            newRanges.delete(range);
        } else {
            newRanges.add(range);
        }
        setSelectedPriceRanges(newRanges);
    };

    const handleTransmissionChange = (gear) => {
        const newTransmission = [...selectedTransmission];
        if (newTransmission.includes(gear)) {
            setSelectedTransmission(newTransmission.filter(g => g !== gear));
        } else {
            setSelectedTransmission([...newTransmission, gear]);
        }
    };

    const handleFuelTypeChange = (fuel) => {
        const newFuelTypes = [...selectedFuelTypes];
        if (newFuelTypes.includes(fuel)) {
            setSelectedFuelTypes(newFuelTypes.filter(f => f !== fuel));
        } else {
            setSelectedFuelTypes([...newFuelTypes, fuel]);
        }
    };

    const handleViewDetails = (carId) => {
        console.log('View details for car:', carId);
    };

    if (carsLoading || categoriesLoading) {
        return (
            <MainLayout>
                <Box sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <Typography>Loading...</Typography>
                </Box>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Box sx={{ py: { xs: 4, md: 6 }, backgroundColor: '#f7f7f7', minHeight: '100vh', marginTop: '100px' }}>
                <Container maxWidth="">
                    <Box mb={3}>
                        <Typography
                            sx={{
                                fontSize: { xs: '18px', md: '22px' },
                                fontWeight: 700,
                                color: '#000',
                            }}
                        >
                            {searchKeyword.trim()
                                ? `Tất cả kết quả cho "${searchKeyword}" (${totalResults} kết quả)`
                                : `Tất cả kết quả (${totalResults} kết quả)`}
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid size={3} item xs={12} md={3}>
                            <FilterSidebar
                                selectedPriceRanges={selectedPriceRanges}
                                selectedCategory={selectedCategory}
                                selectedTransmission={selectedTransmission}
                                selectedFuelTypes={selectedFuelTypes}
                                categories={categories}
                                onPriceRangeChange={handlePriceRangeChange}
                                onCategoryChange={setSelectedCategory}
                                onTransmissionChange={handleTransmissionChange}
                                onFuelTypeChange={handleFuelTypeChange}
                                onClearFilters={clearFilters}
                            />
                        </Grid>

                        <Grid size={9} item xs={12} md={9}>
                            <Box display="flex" alignItems="center" justifyContent="end" mb={4}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Typography sx={{ color: '#000000ff', fontSize: '17px', fontWeight: 500 }}>
                                        Xếp theo:
                                    </Typography>
                                    <TextField
                                        select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        size="small"
                                        sx={{
                                            width: 250,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                color: '#000000ff',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#737373ff',
                                                },
                                            },
                                            '& .MuiSvgIcon-root': {
                                                color: '#000000ff'
                                            }
                                        }}
                                    >
                                        <MenuItem value="most-popular">Tất cả mẫu xe</MenuItem>
                                        <MenuItem value="price-low">Giá: Thấp đến Cao</MenuItem>
                                        <MenuItem value="price-high">Giá: Cao đến Thấp</MenuItem>
                                    </TextField>
                                </Box>
                            </Box>

                            <CarGrid
                                cars={visibleCars}
                                favorites={favorites}
                                onToggleFavorite={toggleFavorite}
                                onViewDetails={handleViewDetails}
                                formatVND={formatVND}
                                hasMore={visibleCars.length < filteredBySearch.length}
                                onLoadMore={handleLoadMore}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </MainLayout>
    );
};

export default ListCars;
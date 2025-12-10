import { useState, useMemo } from 'react';

const useCarFilters = (cars, categories) => {
    const [sortBy, setSortBy] = useState('most-popular');
    const [selectedPriceRanges, setSelectedPriceRanges] = useState(new Set());
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);
    const [selectedTransmission, setSelectedTransmission] = useState([]);

    const parseCarPrice = (priceString) => {
        if (!priceString) return 0;
        return parseInt(String(priceString).replace(/[^0-9]/g, ""), 10);
    };

    const isInPriceRange = (price, range) => {
        switch (range) {
            case '< 1.000.000.000₫':
                return price < 1000000000;
            case '1.000.000.000₫ - 1.500.000.000₫':
                return price >= 1000000000 && price <= 1500000000;
            case '1.500.000.000₫ - 2.000.000.000₫':
                return price > 1500000000 && price <= 2000000000;
            case '2.000.000.000₫ - 3.000.000.000₫':
                return price > 2000000000 && price <= 3000000000;
            case '3.000.000.000₫ - 5.000.000.000₫':
                return price > 3000000000 && price <= 5000000000;
            case '5.000.000.000₫ - 8.000.000.000₫':
                return price > 5000000000 && price <= 8000000000;
            case '8.000.000.000₫ - 12.000.000.000₫':
                return price > 8000000000 && price <= 12000000000;
            case '> 12.000.000.000₫':
                return price > 12000000000;
            default:
                return false;
        }
    };

    const sortCars = (cars, sortType) => {
        const sortedCars = [...cars];
        switch (sortType) {
            case 'most-popular':
                return sortedCars.sort((a, b) => b.popularity - a.popularity);
            case 'price-low':
                return sortedCars.sort((a, b) => parseCarPrice(a.price) - parseCarPrice(b.price));
            case 'price-high':
                return sortedCars.sort((a, b) => parseCarPrice(b.price) - parseCarPrice(a.price));
            case 'newest':
                return sortedCars.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            default:
                return sortedCars;
        }
    };

    const filteredCars = useMemo(() => {
        let filtered = [...cars];

        if (selectedPriceRanges.size > 0) {
            filtered = filtered.filter(car => {
                const carPrice = parseCarPrice(car.price);
                return Array.from(selectedPriceRanges).some(range => isInPriceRange(carPrice, range));
            });
        }

        if (selectedCategory) {
            filtered = filtered.filter(car => {
                const category = categories.find(cat => cat.id === car.category_id.toString());
                return category && category.name === selectedCategory;
            });
        }

        if (selectedTransmission.length > 0) {
            filtered = filtered.filter(car => {
                const carTransmission = car.transmission === 'Automatic' ? 'Số tự động' : 'Số tay';
                return selectedTransmission.includes(carTransmission);
            });
        }

        if (selectedFuelTypes.length > 0) {
            filtered = filtered.filter(car => {
                const fuelTypeMap = {
                    'gasoline': 'Xăng',
                    'diesel': 'Diesel',
                    'hybrid': 'Hybrid',
                    'electric': 'Điện'
                };
                const carFuelType = fuelTypeMap[car.fuel_type] || car.fuel_type;
                return selectedFuelTypes.includes(carFuelType);
            });
        }

        return sortCars(filtered, sortBy);
    }, [cars, selectedPriceRanges, selectedCategory, selectedTransmission, selectedFuelTypes, sortBy, categories]);

    const clearFilters = () => {
        setSelectedPriceRanges(new Set());
        setSelectedCategory('');
        setSelectedTransmission([]);
        setSelectedFuelTypes([]);
    };

    return {
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
    };
};

export default useCarFilters;
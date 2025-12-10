import { useState, useEffect, useCallback } from 'react';
import getCars from '../services/carsApi';

export const useCars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCars = useCallback(async () => {
        try {
            setLoading(true);
            const carData = await getCars();
            setCars(Array.isArray(carData) ? carData : []);
        } catch (error) {
            console.error('Error cars:', error);
            setCars([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    return { cars, loading, refetch: fetchCars };
};

export default useCars;
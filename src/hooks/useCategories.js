import { useState, useEffect, useCallback } from 'react';
import getCategory from '../services/categoryApi';

const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getCategory();
            setCategories(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error('Error categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return { categories, loading, refetch: fetchCategories };
};

export default useCategories;
import axios from 'axios';
import API_BASE_URL from '../config';

const getCurrentUserId = () => {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        return userData.id;
    }
    return null;
};

export const getCart = async () => {
    try {
        const userId = getCurrentUserId();
        if (!userId) {
            console.log('No user logged in, returning empty cart');
            return [];
        }

        const response = await axios.get(`${API_BASE_URL}/cart?user_id=${userId}`);
        console.log('List Cart:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error Cart:', error);
        throw error;
    }
};

export const addToCart = async (payload) => {
    try {
        const userId = getCurrentUserId();
        if (!userId) {
            throw new Error('User must be logged in to add to cart');
        }

        const dataWithUser = {
            ...payload,
            user_id: userId
        };

        const response = await axios.post(`${API_BASE_URL}/cart`, dataWithUser);
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

export const updateCart = async (id, quantity) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/cart/${id}`, { quantity });
        return response.data;
    } catch (error) {
        console.error('Error updating cart:', error);
        throw error;
    }
}

export const deleteCartItem = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/cart/${id}`);
    } catch (error) {
        console.error('Error deleting cart item:', error);
        throw error;
    }
}

const cartApi = {
    getCart,
    addToCart,
    updateCart,
    deleteCartItem
};

export default cartApi;
import axios from 'axios';
import API_BASE_URL from '../config';

// Get all users
export const fetchAllUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
};

export default {
    fetchAllUsers,
};

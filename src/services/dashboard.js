import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999';

export const getDashboardStats = async () => {
    const [usersRes, carsRes, categoriesRes, postsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/users`),
        axios.get(`${API_BASE_URL}/cars`),
        axios.get(`${API_BASE_URL}/categories`),
        axios.get(`${API_BASE_URL}/posts`)
    ]);
    return {
        totalUsers: usersRes.data.length,
        totalCars: carsRes.data.length,
        totalCategories: categoriesRes.data.length,
        totalPosts: postsRes.data.length,
    };
};

export default getDashboardStats;
// trang thống kê của Admin
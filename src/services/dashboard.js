import axios from 'axios';
import API_BASE_URL from '../config';

// --- DASHBOARD STATS SECTION ---

// Get revenue from completed orders
export const getRevenueStats = async () => {
    // Fetch orders and cars in parallel
    const [ordersRes, carsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/orders`),
        axios.get(`${API_BASE_URL}/cars`)
    ]);
    const orders = ordersRes.data;
    const cars = carsRes.data;
    let totalRevenue = 0;
    let monthlyRevenue = {};

    orders.forEach(order => {
        if (order.status === 'completed') {
            const car = cars.find(c => c.id === order.car_id);
            if (car) {
                // Assuming revenue comes from car price in the old structure
                totalRevenue += Number(car.price) || 0; 
                
                // Calculate monthly revenue
                const date = new Date(order.created_at || order.date || order.createdDate);
                const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                
                if (!monthlyRevenue[month]) monthlyRevenue[month] = 0;
                monthlyRevenue[month] += Number(car.price) || 0;
            }
        }
    });
    return { totalRevenue, monthlyRevenue };
};

// Get top N most expensive cars
export const getTopExpensiveCars = async (topN = 5) => {
    const carsRes = await axios.get(`${API_BASE_URL}/cars`);
    const cars = carsRes.data;
    return cars
        .sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
        .slice(0, topN);
};

// Get user statistics by role
export const getUserRoleStats = async () => {
    const usersRes = await axios.get(`${API_BASE_URL}/users`);
    const users = usersRes.data;
    const adminCount = users.filter(u => u.role_id === 1).length; // role_id 1 is Admin
    const userCount = users.filter(u => u.role_id === 2).length;  // role_id 2 is Regular User
    return { adminCount, userCount, total: users.length };
};


export const getDashboardStats = async () => {
    const [usersRes, carsRes, categoriesRes, postsRes, revenueStats, userRoleStats, topCars] = await Promise.all([
        axios.get(`${API_BASE_URL}/users`),
        axios.get(`${API_BASE_URL}/cars`),
        axios.get(`${API_BASE_URL}/categories`),
        axios.get(`${API_BASE_URL}/posts`),
        getRevenueStats(),
        getUserRoleStats(),
        getTopExpensiveCars(5)
    ]);
    return {
        totalUsers: usersRes.data.length,
        totalCars: carsRes.data.length,
        totalCategories: categoriesRes.data.length,
        totalPosts: postsRes.data.length,
        totalRevenue: revenueStats.totalRevenue,
        monthlyRevenue: revenueStats.monthlyRevenue,
        userRoleStats,
        topCars,
    };
};

export default getDashboardStats;
// Admin dashboard statistics page
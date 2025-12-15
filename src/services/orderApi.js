// --- ORDER PROCESSING SECTION ---

import axios from 'axios';
import API_BASE_URL from '../config';

// 1. Get all orders
export const getOrders = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders`);
        console.log('Orders:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

// 1.1. Create new order
export const createOrder = async (orderData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
        console.log('Order created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// 2. Get user info by ID
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

// 3. Get car info by ID
export const getCarById = async (carId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/cars/${carId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching car:', error);
        return null;
    }
};

// 4. Get list of orders with joined info (user + car) for Admin
export const getOrdersWithDetails = async () => {
    try {
        // Fetch all orders, users, cars in parallel
        const [orders, usersResponse, carsResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/orders`),
            axios.get(`${API_BASE_URL}/users`),
            axios.get(`${API_BASE_URL}/cars`)
        ]);

        const users = usersResponse.data;
        const cars = carsResponse.data;

        // Join data - Handle both structures: old (car_id) and new (items array)
        const ordersWithDetails = orders.map(order => {
            const user = users.find(u => u.id === order.user_id);

            // New structure: uses items array
            if (order.items && Array.isArray(order.items)) {
                // Get all car names and join them by a comma
                const carNames = order.items.map(item => {
                    const car = cars.find(c => c.id === item.car_id);
                    return car ? car.name : 'Unknown Car';
                }).join(', ');

                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return {
                    ...order,
                    user_name: user ? user.full_name : 'Unknown User',
                    car_name: carNames,
                    quantity: totalItems,
                    order_date: order.pickup_date || order.created_at
                };
            }

            // Old structure: uses direct car_id
            const car = cars.find(c => c.id === order.car_id);
            return {
                ...order,
                user_name: user ? user.full_name : 'Unknown User',
                car_name: car ? car.name : 'Unknown Car'
            };
        });

        console.log('Orders with details:', ordersWithDetails);
        return ordersWithDetails;
    } catch (error) {
        console.error('Error fetching orders with details:', error);
        throw error;
    }
};

// 4.1. Get order detail by ID with full information (user + car + category) for User
export const getOrderDetailById = async (orderId) => {
    try {
        // Fetch order, users, cars, categories in parallel
        const [orderResponse, usersResponse, carsResponse, categoriesResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/orders/${orderId}`),
            axios.get(`${API_BASE_URL}/users`),
            axios.get(`${API_BASE_URL}/cars`),
            axios.get(`${API_BASE_URL}/categories`)
        ]);

        const order = orderResponse.data;
        const users = usersResponse.data;
        const cars = carsResponse.data;
        const categories = categoriesResponse.data;

        // Find user
        const user = users.find(u => u.id === order.user_id);

        // New structure: uses items array
        if (order.items && Array.isArray(order.items)) {
            // Enrich items with detailed information for each car
            const enrichedItems = order.items.map(item => {
                const car = cars.find(c => c.id === item.car_id);
                const category = car ? categories.find(cat => cat.id === String(car.category_id)) : null;

                return {
                    ...item,
                    car_name: car ? car.name : 'Unknown Car',
                    car_price: car ? car.price : 0,
                    car_image: car ? car.image : '',
                    car_transmission: car ? car.transmission : 'N/A',
                    car_fuel_type: car ? car.fuel_type : 'N/A',
                    car_seats: car ? car.seats : 'N/A',
                    car_doors: car ? car.doors : 'N/A',
                    category_name: category ? category.name : 'Unknown Category'
                };
            });

            return {
                ...order,
                user_name: user ? user.full_name : 'Unknown User',
                user_email: user ? user.email : 'N/A',
                user_phone: user ? user.phone : 'N/A',
                user_address: user ? user.address : 'N/A',
                items: enrichedItems,
                order_date: order.pickup_date || order.created_at,
                note: order.notes || order.note
            };
        }

        // Old structure: uses direct car_id
        const car = cars.find(c => c.id === order.car_id);
        const category = car ? categories.find(cat => cat.id === String(car.category_id)) : null;

        // Return complete order detail
        return {
            ...order,
            user_name: user ? user.full_name : 'Unknown User',
            user_email: user ? user.email : 'N/A',
            user_phone: user ? user.phone : 'N/A',
            user_address: user ? user.address : 'N/A',
            car_name: car ? car.name : 'Unknown Car',
            car_price: car ? car.price : 'N/A',
            car_image: car ? car.image : '',
            car_transmission: car ? car.transmission : 'N/A',
            car_fuel_type: car ? car.fuel_type : 'N/A',
            car_seats: car ? car.seats : 'N/A',
            car_doors: car ? car.doors : 'N/A',
            category_name: category ? category.name : 'Unknown Category'
        };
    } catch (error) {
        console.error('Error fetching order detail:', error);
        throw error;
    }
};

// 5. Update order status
export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        // Get current order information
        const orderResponse = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
        const currentOrder = orderResponse.data;

        // Update status
        const updatedOrder = {
            ...currentOrder,
            status: newStatus
        };

        const response = await axios.put(`${API_BASE_URL}/orders/${orderId}`, updatedOrder);
        console.log('Order status updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw { message: 'Could not update order status' };
    }
};

// 6. Format date and time
export const formatOrderDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// 7. Convert status to Vietnamese (Kept Vietnamese for display logic, but code is English)
export const getStatusLabel = (status) => {
    const statusMap = {
        'completed': 'Đã xử lý',
        'pending': 'Đang xử lý',
        'cancelled': 'Đã từ chối'
    };
    return statusMap[status] || status;
};

// 8. Get badge color class for status
export const getStatusBadgeClass = (status) => {
    const badgeMap = {
        'completed': 'bg-success',
        'pending': 'bg-warning text-dark',
        'cancelled': 'bg-danger'
    };
    return badgeMap[status] || 'bg-secondary';
};

// 9. Filter orders by status
export const filterOrdersByStatus = (orders, statusFilter) => {
    if (statusFilter === 'all') return orders;
    return orders.filter(order => order.status === statusFilter);
};

// 10. Filter orders by date range
export const filterOrdersByDateRange = (orders, fromDate, toDate) => {
    if (!fromDate && !toDate) return orders;

    return orders.filter(order => {
        // order_date is already added in getOrdersWithDetails/getOrderDetailById
        const orderDate = new Date(order.order_date); 

        // Reset time to compare only dates
        orderDate.setHours(0, 0, 0, 0);

        if (fromDate && toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 999);
            return orderDate >= from && orderDate <= to;
        } else if (fromDate) {
            const from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);
            return orderDate >= from;
        } else if (toDate) {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            return orderDate <= to;
        }

        return true;
    });
};

// 11. Apply all filters
export const applyOrderFilters = (orders, filters) => {
    const { statusFilter, fromDate, toDate } = filters;

    let filtered = [...orders];

    // Filter by status
    filtered = filterOrdersByStatus(filtered, statusFilter);

    // Filter by date range
    filtered = filterOrdersByDateRange(filtered, fromDate, toDate);

    return filtered;
};

export default {
    getOrders,
    createOrder,
    getUserById,
    getCarById,
    getOrdersWithDetails,
    updateOrderStatus,
    formatOrderDate,
    getStatusLabel,
    getStatusBadgeClass
};
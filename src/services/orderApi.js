// Xử lý duyệt đơn hàng và lấy ra danh sách đơn hàng, cập nhật trạng thái đơn hàng
import axios from 'axios';
import API_BASE_URL from '../config';

// 1. Lấy tất cả đơn hàng
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

// 2. Lấy thông tin user theo ID
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

// 3. Lấy thông tin car theo ID
export const getCarById = async (carId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/cars/${carId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching car:', error);
        return null;
    }
};

// 4. Lấy danh sách đơn hàng với thông tin join (user + car)
export const getOrdersWithDetails = async () => {
    try {
        // Lấy tất cả orders, users, cars song song
        const [orders, usersResponse, carsResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/orders`),
            axios.get(`${API_BASE_URL}/users`),
            axios.get(`${API_BASE_URL}/cars`)
        ]);

        const users = usersResponse.data;
        const cars = carsResponse.data;

        // Join data
        const ordersWithDetails = orders.data.map(order => {
            const user = users.find(u => u.id === order.user_id);
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

// 4.1. Lấy chi tiết đơn hàng theo ID với đầy đủ thông tin join (user + car + category)
export const getOrderDetailById = async (orderId) => {
    try {
        // Lấy order, users, cars, categories song song
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

        // Find related data
        const user = users.find(u => u.id === order.user_id);
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

// 5. Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        // Lấy thông tin order hiện tại
        const orderResponse = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
        const currentOrder = orderResponse.data;

        // Cập nhật status
        const updatedOrder = {
            ...currentOrder,
            status: newStatus
        };

        const response = await axios.put(`${API_BASE_URL}/orders/${orderId}`, updatedOrder);
        console.log('Order status updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw { message: 'Không thể cập nhật trạng thái đơn hàng' };
    }
};

// 6. Format ngày giờ
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

// 7. Chuyển đổi status sang tiếng Việt
export const getStatusLabel = (status) => {
    const statusMap = {
        'completed': 'Đã xử lý',
        'pending': 'Đang xử lý',
        'cancelled': 'Đã từ chối'
    };
    return statusMap[status] || status;
};

// 8. Lấy màu badge cho status
export const getStatusBadgeClass = (status) => {
    const badgeMap = {
        'completed': 'bg-success',
        'pending': 'bg-warning text-dark',
        'cancelled': 'bg-danger'
    };
    return badgeMap[status] || 'bg-secondary';
};

// 9. Lọc đơn hàng theo trạng thái
export const filterOrdersByStatus = (orders, statusFilter) => {
    if (statusFilter === 'all') return orders;
    return orders.filter(order => order.status === statusFilter);
};

// 10. Lọc đơn hàng theo khoảng ngày
export const filterOrdersByDateRange = (orders, fromDate, toDate) => {
    if (!fromDate && !toDate) return orders;

    return orders.filter(order => {
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

// 11. Áp dụng tất cả các filter
export const applyOrderFilters = (orders, filters) => {
    const { statusFilter, fromDate, toDate } = filters;

    let filtered = [...orders];

    // Lọc theo trạng thái
    filtered = filterOrdersByStatus(filtered, statusFilter);

    // Lọc theo khoảng ngày
    filtered = filterOrdersByDateRange(filtered, fromDate, toDate);

    return filtered;
};

export default {
    getOrders,
    getUserById,
    getCarById,
    getOrdersWithDetails,
    updateOrderStatus,
    formatOrderDate,
    getStatusLabel,
    getStatusBadgeClass
};

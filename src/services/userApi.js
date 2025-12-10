// API calls để lấy dữ liệu người dùng từ db.json
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999';

// Lấy danh sách tất cả người dùng
export const fetchAllUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Không thể tải danh sách người dùng');
    }
};

// Lấy thông tin chi tiết một người dùng theo ID
export const fetchUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user detail:', error);
        throw new Error('Không thể tải thông tin người dùng');
    }
};

// Tạo người dùng mới
export const createUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users`, userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Không thể tạo người dùng mới');
    }
};

// Cập nhật thông tin người dùng
export const updateUserById = async (userId, userData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Không thể cập nhật thông tin người dùng');
    }
};

// Xóa người dùng
export const deleteUserById = async (userId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Không thể xóa người dùng');
    }
};

export default {
    fetchAllUsers,
    fetchUserById,
    createUser,
    updateUserById,
    deleteUserById
};

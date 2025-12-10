// Logic quản lý người dùng của Admin
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999';

// Lấy danh sách tất cả người dùng
export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        console.log('List Users:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Lấy thông tin chi tiết một người dùng theo ID
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
        console.log('User Detail:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user detail:', error);
        throw error;
    }
};

// Cập nhật thông tin người dùng
export const updateUser = async (userId, userData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData);
        console.log('User updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Xóa người dùng
export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
        console.log('User deleted:', userId);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// Validate thông tin người dùng
export const validateUserData = (formData) => {
    const errors = {};

    // Validate họ tên
    if (!formData.full_name?.trim()) {
        errors.full_name = 'Vui lòng nhập họ tên';
    }

    // Validate email
    if (!formData.email?.trim()) {
        errors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email không hợp lệ';
    }

    // Validate số điện thoại
    if (!formData.phone?.trim()) {
        errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
        errors.phone = 'Số điện thoại phải có 10 chữ số';
    }

    return errors;
};

// Validate file avatar
export const validateAvatarFile = (file) => {
    if (!file) return null;

    // Validate kích thước file (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        return 'Kích thước ảnh không được vượt quá 2MB';
    }

    // Validate định dạng file
    if (!file.type.startsWith('image/')) {
        return 'Vui lòng chọn file ảnh hợp lệ';
    }

    return null;
};

// Lọc danh sách người dùng theo từ khóa tìm kiếm
export const filterUsers = (users, searchTerm) => {
    if (!searchTerm.trim()) {
        return users;
    }

    const keyword = searchTerm.toLowerCase();
    return users.filter(user =>
        user.full_name?.toLowerCase().includes(keyword) ||
        user.username?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword) ||
        user.phone?.includes(keyword)
    );
};

// Xử lý upload avatar và tạo preview
export const handleAvatarUpload = (file, callback) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
        callback(reader.result);
    };
    reader.readAsDataURL(file);
};

export default {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    validateUserData,
    validateAvatarFile,
    filterUsers,
    handleAvatarUpload
};
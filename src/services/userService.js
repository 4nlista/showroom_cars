// Logic quản lý người dùng của Admin
import axios from 'axios';
import API_BASE_URL from '../config';

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
    // Kiểm tra trùng email, phone với user khác
    try {
        const usersResponse = await axios.get(`${API_BASE_URL}/users`);
        const users = usersResponse.data;
        let validationErrors = {};
        const emailExists = users.some(u => u.id !== userId && u.email === userData.email);
        if (emailExists) {
            validationErrors.email = 'Email đã được sử dụng';
        }
        const phoneExists = users.some(u => u.id !== userId && u.phone === userData.phone);
        if (phoneExists) {
            validationErrors.phone = 'Số điện thoại đã được sử dụng';
        }
        if (Object.keys(validationErrors).length > 0) {
            throw { validationErrors };
        }

        // Giữ nguyên status cũ nếu userData không truyền status
        let dataToUpdate = { ...userData };
        if (typeof userData.status === 'undefined') {
            // Lấy user hiện tại để lấy status
            const userDetailRes = await axios.get(`${API_BASE_URL}/users/${userId}`);
            dataToUpdate.status = userDetailRes.data.status;
        }

        const response = await axios.put(`${API_BASE_URL}/users/${userId}`, dataToUpdate);
        console.log('User updated:', response.data);
        return response.data;
    } catch (error) {
        if (error.validationErrors) throw error;
        console.error('Error updating user:', error);
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

// Tạo người dùng mới (Admin)
export const createNewUser = async (formData) => {
    // Validation
    const errors = {};

    // Validate username
    if (!formData.username?.trim()) {
        errors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (formData.username.length < 3) {
        errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

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

    // Validate mật khẩu
    if (!formData.password?.trim()) {
        errors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Validate xác nhận mật khẩu
    if (!formData.confirmPassword?.trim()) {
        errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    // Nếu có lỗi validation, throw error
    if (Object.keys(errors).length > 0) {
        throw { validationErrors: errors };
    }

    try {
        // Kiểm tra username, email, phone đã tồn tại chưa
        const usersResponse = await axios.get(`${API_BASE_URL}/users`);
        const users = usersResponse.data;
        let validationErrors = {};
        const usernameExists = users.some(user => user.username === formData.username);
        if (usernameExists) {
            validationErrors.username = 'Tên đăng nhập đã tồn tại';
        }
        const emailExists = users.some(user => user.email === formData.email);
        if (emailExists) {
            validationErrors.email = 'Email đã được sử dụng';
        }
        const phoneExists = users.some(user => user.phone === formData.phone);
        if (phoneExists) {
            validationErrors.phone = 'Số điện thoại đã được sử dụng';
        }
        if (Object.keys(validationErrors).length > 0) {
            throw { validationErrors };
        }
        // Tạo user mới
        const newUser = {
            username: formData.username,
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address || '',
            birth_date: formData.birth_date || '',
            password: formData.password,
            role_id: formData.role_id,
            avatar: `https://i.pravatar.cc/300?u=${Date.now()}`,
            status: 'active'
        };

        const response = await axios.post(`${API_BASE_URL}/users`, newUser);
        console.log('User created:', response.data);
        return response.data;
    } catch (error) {
        // Nếu là lỗi validation đã throw, throw lại
        if (error.validationErrors) {
            throw error;
        }
        // Nếu là lỗi khác
        console.error('Error creating user:', error);
        throw { message: 'Không thể tạo người dùng mới' };
    }
};

// Validate password change data
export const validatePasswordChange = (currentPassword, newPassword, confirmPassword) => {
    const errors = {};

    // Validate current password
    if (!currentPassword?.trim()) {
        errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    // Validate new password
    if (!newPassword?.trim()) {
        errors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (newPassword.length < 6) {
        errors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (/\s/.test(newPassword)) {
        errors.newPassword = 'Mật khẩu không được chứa khoảng trắng';
    }

    // Validate confirm password
    if (!confirmPassword?.trim()) {
        errors.confirmPassword = 'Vui lòng nhập lại mật khẩu mới';
    } else if (newPassword !== confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    return errors;
};

// Change password
export const changePassword = async (userId, currentPassword, newPassword, confirmPassword) => {
    // Validation
    const errors = validatePasswordChange(currentPassword, newPassword, confirmPassword);

    if (Object.keys(errors).length > 0) {
        throw { validationErrors: errors };
    }

    try {
        // Get current user data
        const userResponse = await axios.get(`${API_BASE_URL}/users/${userId}`);
        const currentUser = userResponse.data;

        // Verify current password
        if (currentUser.password !== currentPassword) {
            throw { validationErrors: { currentPassword: 'Mật khẩu hiện tại không đúng' } };
        }

        // Check if new password is different from current
        if (currentPassword === newPassword) {
            throw { validationErrors: { newPassword: 'Mật khẩu mới phải khác mật khẩu hiện tại' } };
        }

        // Update password
        const updatedUser = {
            ...currentUser,
            password: newPassword
        };

        const response = await axios.put(`${API_BASE_URL}/users/${userId}`, updatedUser);
        console.log('Password changed:', response.data);
        return response.data;
    } catch (error) {
        // If validation error, throw it
        if (error.validationErrors) {
            throw error;
        }
        // Other errors
        console.error('Error changing password:', error);
        throw { message: 'Không thể đổi mật khẩu' };
    }
};

export default {
    getUserById,
    updateUser,
    validateUserData,
    validateAvatarFile,
    filterUsers,
    handleAvatarUpload,
    createNewUser
};
// Admin user management logic
import axios from 'axios';
import API_BASE_URL from '../config';

// Get a user's detailed information by ID
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

// Update user information
export const updateUser = async (userId, userData) => {
    // Check for duplicate email, phone with other users
    try {
        const usersResponse = await axios.get(`${API_BASE_URL}/users`);
        const users = usersResponse.data;
        let validationErrors = {};
        const emailExists = users.some(u => u.id !== userId && u.email === userData.email);
        if (emailExists) {
            validationErrors.email = 'Email already in use';
        }
        const phoneExists = users.some(u => u.id !== userId && u.phone === userData.phone);
        if (phoneExists) {
            validationErrors.phone = 'Phone number already in use';
        }
        if (Object.keys(validationErrors).length > 0) {
            throw { validationErrors };
        }

        // Preserve old status if userData does not contain status
        let dataToUpdate = { ...userData };
        if (typeof userData.status === 'undefined') {
            // Fetch current user to get the status
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


// Validate user information
export const validateUserData = (formData) => {
    const errors = {};

    // Validate full name
    if (!formData.full_name?.trim()) {
        errors.full_name = 'Please enter full name';
    }

    // Validate email
    if (!formData.email?.trim()) {
        errors.email = 'Please enter email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Invalid email format';
    }

    // Validate phone number
    if (!formData.phone?.trim()) {
        errors.phone = 'Please enter phone number';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
        errors.phone = 'Phone number must be 10 digits';
    }

    return errors;
};

// Validate avatar file
export const validateAvatarFile = (file) => {
    if (!file) return null;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        return 'Image size must not exceed 2MB';
    }

    // Validate file format
    if (!file.type.startsWith('image/')) {
        return 'Please select a valid image file';
    }

    return null;
};

// Filter user list by search keyword
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

// Handle avatar upload and create preview
export const handleAvatarUpload = (file, callback) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
        callback(reader.result);
    };
    reader.readAsDataURL(file);
};

// Create new user (Admin)
export const createNewUser = async (formData) => {
    // Validation
    const errors = {};

    // Validate username
    if (!formData.username?.trim()) {
        errors.username = 'Please enter username';
    } else if (formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
    }

    // Validate full name
    if (!formData.full_name?.trim()) {
        errors.full_name = 'Please enter full name';
    }

    // Validate email
    if (!formData.email?.trim()) {
        errors.email = 'Please enter email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Invalid email format';
    }

    // Validate phone number
    if (!formData.phone?.trim()) {
        errors.phone = 'Please enter phone number';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
        errors.phone = 'Phone number must be 10 digits';
    }

    // Validate password
    if (!formData.password?.trim()) {
        errors.password = 'Please enter password';
    } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    // Validate confirm password
    if (!formData.confirmPassword?.trim()) {
        errors.confirmPassword = 'Please confirm password';
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Confirmation password does not match';
    }

    // If there are validation errors, throw error
    if (Object.keys(errors).length > 0) {
        throw { validationErrors: errors };
    }

    try {
        // Check if username, email, phone already exist
        const usersResponse = await axios.get(`${API_BASE_URL}/users`);
        const users = usersResponse.data;
        let validationErrors = {};
        const usernameExists = users.some(user => user.username === formData.username);
        if (usernameExists) {
            validationErrors.username = 'Username already exists';
        }
        const emailExists = users.some(user => user.email === formData.email);
        if (emailExists) {
            validationErrors.email = 'Email already in use';
        }
        const phoneExists = users.some(user => user.phone === formData.phone);
        if (phoneExists) {
            validationErrors.phone = 'Phone number already in use';
        }
        if (Object.keys(validationErrors).length > 0) {
            throw { validationErrors };
        }
        // Create new user
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
        // If it's a thrown validation error, re-throw
        if (error.validationErrors) {
            throw error;
        }
        // If it's another error
        console.error('Error creating user:', error);
        throw { message: 'Could not create new user' };
    }
};

// Validate password change data
export const validatePasswordChange = (currentPassword, newPassword, confirmPassword) => {
    const errors = {};

    // Validate current password
    if (!currentPassword?.trim()) {
        errors.currentPassword = 'Please enter current password';
    }

    // Validate new password
    if (!newPassword?.trim()) {
        errors.newPassword = 'Please enter new password';
    } else if (newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
    } else if (/\s/.test(newPassword)) {
        errors.newPassword = 'Password must not contain spaces';
    }

    // Validate confirm password
    if (!confirmPassword?.trim()) {
        errors.confirmPassword = 'Please re-enter new password';
    } else if (newPassword !== confirmPassword) {
        errors.confirmPassword = 'Confirmation password does not match';
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
            throw { validationErrors: { currentPassword: 'Current password is incorrect' } };
        }

        // Check if new password is different from current
        if (currentPassword === newPassword) {
            throw { validationErrors: { newPassword: 'New password must be different from current password' } };
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
        throw { message: 'Could not change password' };
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
import axios from "axios";
import API_BASE_URL from "../config";

const login = async ({ username, password }) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        const users = response.data;
        const foundUser = users.find(
            (user) => user.username === username && user.password === password
        );

        if (foundUser) {
            // Kiểm tra trạng thái tài khoản
            if (foundUser.status === 'inactive') {
                throw new Error("Your account has been deactivated. Please contact administrator.");
            }
            return foundUser;
        } else {
            throw new Error("Invalid username or password");
        }
    } catch (error) {
        console.error("Lỗi xảy ra:", error);
        throw error;
    }
};

const signup = async (username, full_name, phone, email, address, password) => {
    try {
        const usersRes = await axios.get(`${API_BASE_URL}/users`);
        const users = usersRes.data;

        if (users.some(user => user.username === username)) {
            throw new Error("Username already exists");
        }

        if (users.some(user => user.email === email)) {
            throw new Error("Email is already in use");
        }
        const response = await axios.post(`${API_BASE_URL}/users`, {
            username,
            full_name,
            phone,
            email,
            address,
            password,
            role_id: 2,
        });

        return response.data;
    } catch (error) {
        console.error("Lỗi xảy ra:", error);
        throw error;
    }
};

const authApi = {
    login,
    signup
};

export default authApi;

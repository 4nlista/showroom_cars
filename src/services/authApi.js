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
                throw new Error("Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.");
            }
            return foundUser;
        } else {
            throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
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
            throw new Error("Tên đăng nhập đã tồn tại");
        }

        if (users.some(user => user.email === email)) {
            throw new Error("Email đã được sử dụng");
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

import axios from "axios";

export const API_URL = "http://localhost:9999";

const login = async ({ username, password }) => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        const users = response.data;
        const foundUser = users.find(
            (user) => user.username === username && user.password === password
        );

        if (foundUser) {
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
        const usersRes = await axios.get(`${API_URL}/users`);
        const users = usersRes.data;

        // kiểm tra tên đăng nhập đã tồn tại chưa
        if (users.some(user => user.username === username)) {
            throw new Error("Tên đăng nhập đã tồn tại");
        }

        // kiểm tra email đã được sử dụng chưa
        if (users.some(user => user.email === email)) {
            throw new Error("Email đã được sử dụng");
        }

        const response = await axios.post(`${API_URL}/users`, {
            username,
            full_name,
            phone,
            email,
            address,
            password,
            role_id: 2,
            avatar: `https://i.pravatar.cc/300?u=${Date.now()}`
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

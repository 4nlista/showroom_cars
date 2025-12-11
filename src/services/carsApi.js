import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999';


// lấy toàn bộ danh sách các xe
export const getCars = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cars`);
    console.log('List Cars:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error Cars:', error);
    throw error;
  }
};


// Lấy thông tin chi tiết loại xe dùng theo ID
export const getCarById = async (carId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cars/${carId}`);
    console.log('Car Detail:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching car detail:', error);
    throw error;
  }
};


//3. thêm 1 loại xe mới (Validate dữ liệu , giá cả, thông tin, hình ảnh...)



//4. xóa 1 loại xe theo ID



//5. cập nhât thông tin loại xe theo ID -- chỉ sửa ảnh, thông tin , giá cả... 
// (Validate dữ liệu , giá cả, thông tin, hình ảnh...)



//6. danh sách lọc theo giá, theo loại (SUV, Sedan, Convertible...)









export default getCars;
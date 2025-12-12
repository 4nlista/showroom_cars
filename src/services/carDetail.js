import axios from 'axios';
import API_BASE_URL from '../config';

// lấy thông tin chi tiết 1 loại cars
export const getCarDetail = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cars/${productId}`);
    console.log('Car Detail:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error Car Detail:', error);
    throw error;
  }
};

export default getCarDetail;
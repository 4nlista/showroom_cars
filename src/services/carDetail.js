import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999';

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
import axios from 'axios';
import API_BASE_URL from '../config';

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

export default getCars;
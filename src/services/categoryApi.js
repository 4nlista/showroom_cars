import axios from 'axios';

const API_URL = 'http://localhost:9999';

export const getCategory = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    console.log('List Categories:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error Categories:', error);
    throw error;
  }
};

export default getCategory;
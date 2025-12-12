import axios from 'axios';
import API_BASE_URL from '../config';

export const getFeatureCars = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/featured_cars`);
    console.log('Fetched cars:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
};

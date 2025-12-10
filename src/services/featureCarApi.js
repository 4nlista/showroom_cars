import axios from 'axios';

export const API_URL = 'http://localhost:9999/featured_cars';

export const getFeatureCars = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('Fetched cars:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
};

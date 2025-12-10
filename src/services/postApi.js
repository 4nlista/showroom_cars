import axios from 'axios';

export const API_URL = 'http://localhost:9999/posts';

export const getPosts = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('Fetched posts:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

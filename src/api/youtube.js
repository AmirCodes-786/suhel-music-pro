import axios from 'axios';

const BACKEND_URL = '/api';

export const searchMultiSource = async (query) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/search`, {
      params: { q: query },
    });
    return response.data.tracks || [];
  } catch (error) {
    console.error('Failed to search via backend:', error);
    return [];
  }
};

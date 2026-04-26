import ytSearch from 'yt-search';

/**
 * Searches YouTube for videos matching the given query.
 * 
 * @param {string} query - The search query string.
 * @returns {Promise<Array>} - A promise that resolves to an array of the top 5 video results.
 */
export const searchYouTube = async (query) => {
  if (!query) {
    throw new Error('Search query is required');
  }

  try {
    const results = await ytSearch(query);
    // Filter out non-video results (like channels or playlists) and take the top 5
    const videos = results.videos.slice(0, 5);
    return videos;
  } catch (error) {
    console.error('Error during yt-search execution:', error);
    throw error;
  }
};

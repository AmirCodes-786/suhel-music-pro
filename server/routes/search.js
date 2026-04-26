import express from 'express';
import axios from 'axios';
import { searchYouTube } from '../utils/youtubeSearch.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  // Step 1: Search YouTube Data API v3
  try {
    const apiKey = process.env.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: `${q} official audio`,
          type: 'video',
          videoCategoryId: '10',
          maxResults: 10,
          key: apiKey,
        },
      });

        const host = req.get('host');
        // On Render/Vercel, always use https, otherwise use req.protocol
        const protocol = (host.includes('localhost') || host.includes('127.0.0.1')) ? req.protocol : 'https';
        const backendBaseUrl = `${protocol}://${host}`;

        const results = response.data.items.map((item) => ({
          id: item.id.videoId,
          name: item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'),
          artist_name: item.snippet.channelTitle,
          image: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
          audio: `${backendBaseUrl}/api/stream?id=${item.id.videoId}`,
          duration: 0,
          source: 'youtube',
        }));
      return res.json({ tracks: results });
    }
  } catch (err) {
    console.warn('[Search] YouTube API failed/empty, falling back to yt-search...', err.response?.data?.error?.message || err.message);
  }

  // Step 2: Fallback to yt-search
  try {
    const ytSearchResults = await searchYouTube(q);
    if (ytSearchResults && ytSearchResults.length > 0) {
      const host = req.get('host');
      const protocol = (host.includes('localhost') || host.includes('127.0.0.1')) ? req.protocol : 'https';
      const backendBaseUrl = `${protocol}://${host}`;

      const results = ytSearchResults.map((video) => ({
        id: video.videoId,
        name: video.title,
        artist_name: video.author.name,
        image: video.thumbnail,
        audio: `${backendBaseUrl}/api/stream?id=${video.videoId}`,
        duration: video.seconds || 0,
        source: 'youtube',
      }));
      return res.json({ tracks: results });
    }
  } catch (err) {
    console.warn('[Search] yt-search failed/empty, falling back to Jamendo...', err.message);
  }

  // Step 3: Final Fallback to Jamendo API
  try {
    const clientId = process.env.VITE_JAMENDO_CLIENT_ID || process.env.JAMENDO_CLIENT_ID;
    if (!clientId) {
      throw new Error('Jamendo Client ID not configured');
    }

    const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
      params: {
        client_id: clientId,
        format: 'json',
        limit: 10,
        search: q,
        audioformat: 'mp32', // Ensures we get a playable stream
        imagesize: 600,
      },
    });

    if (response.data.results && response.data.results.length > 0) {
      const results = response.data.results.map((track) => ({
        id: track.id,
        name: track.name,
        artist_name: track.artist_name,
        image: track.image || track.album_image,
        audio: track.audio, // Direct Jamendo URL
        duration: track.duration || 0,
        source: 'jamendo',
      }));
      return res.json({ tracks: results });
    }

    // No results anywhere
    return res.json({ tracks: [] });

  } catch (err) {
    console.error('[Search] Jamendo API failed:', err.response?.data || err.message);
    return res.status(500).json({ error: 'All search providers failed' });
  }
});

export default router;

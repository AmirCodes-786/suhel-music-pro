import express from 'express';
import play from 'play-dl';

const router = express.Router();

router.get('/', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing YouTube video ID' });
  }

  const url = `https://www.youtube.com/watch?v=${id}`;

  try {
    // Check if the link is valid and get stream info
    const streamInfo = await play.stream(url, {
      quality: 0, // 0 is best audio
      seek: 0
    });

    if (!streamInfo || !streamInfo.url) {
      throw new Error('Failed to extract stream URL');
    }

    // Redirect to the direct audio stream URL
    res.redirect(302, streamInfo.url);
  } catch (error) {
    console.error('Streaming extraction error:', error.message);
    
    // Detailed error logging for Render troubleshooting
    if (error.message.includes('429')) {
      return res.status(429).json({ error: 'YouTube is rate-limiting the server. Try again later.' });
    }
    
    res.status(500).json({ error: 'Server error during stream preparation' });
  }
});

export default router;

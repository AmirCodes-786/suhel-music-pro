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
    // Get the stream from play-dl
    const stream = await play.stream(url, {
      quality: 0, // Best audio
    });

    // Set headers for audio streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    // YouTube streams are usually chunked/variable, so we don't set Content-Length
    
    // Pipe the stream directly to the response
    stream.stream.pipe(res);

    // Handle stream errors
    stream.stream.on('error', (err) => {
      console.error('Stream piping error:', err.message);
      if (!res.headersSent) {
        res.status(500).send('Streaming failed');
      }
    });

  } catch (error) {
    console.error('Streaming extraction error:', error.message);
    
    if (error.message.includes('429')) {
      return res.status(429).json({ error: 'YouTube rate limit hit. Try again later.' });
    }
    
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server error during stream preparation' });
    }
  }
});

export default router;

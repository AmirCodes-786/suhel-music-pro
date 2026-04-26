import express from 'express';
import youtubedl from 'youtube-dl-exec';

const router = express.Router();

router.get('/', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing YouTube video ID' });
  }

  const url = `https://www.youtube.com/watch?v=${id}`;

  try {
    // Extract the direct audio URL using youtube-dl-exec (which uses yt-dlp)
    const streamUrl = await youtubedl(url, {
      getUrl: true,
      format: 'bestaudio',
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
    });

    if (!streamUrl) {
      return res.status(404).json({ error: 'No audio format found' });
    }

    // Redirect the HTML5 audio player directly to YouTube's high-speed CDN
    res.redirect(302, streamUrl);
  } catch (error) {
    console.error('Streaming extraction error:', error.message);
    res.status(500).json({ error: 'Server error during stream preparation' });
  }
});

export default router;

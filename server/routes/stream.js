import express from 'express';
import play from 'play-dl';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Path to the yt-dlp binary provided by youtube-dl-exec
const YT_DLP_PATH = path.join(__dirname, '../node_modules/youtube-dl-exec/bin/yt-dlp.exe');

router.get('/', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    console.warn('[Stream] Missing YouTube video ID');
    return res.status(400).json({ error: 'Missing YouTube video ID' });
  }

  const cleanId = id.trim();
  const url = `https://www.youtube.com/watch?v=${cleanId}`;
  console.log(`[Stream] Request received for ID: ${cleanId}`);

  try {
    // 1. Try play-dl (Primary Engine)
    try {
      // Validate first
      const validation = await play.yt_validate(url);
      if (validation) {
        const stream = await play.stream(url, { quality: 0 });
        console.log(`[Stream] play-dl success. Type: ${stream.type}`);
        res.setHeader('Content-Type', 'audio/mpeg');
        stream.stream.pipe(res);
        
        res.on('close', () => {
          console.log(`[Stream] Connection closed (play-dl) for ${cleanId}`);
        });
        return; // Success!
      } else {
        console.warn(`[Stream] play-dl validation failed for ${cleanId}`);
      }
    } catch (playError) {
      console.warn(`[Stream] play-dl failed for ${cleanId}: ${playError.message}`);
    }

    // 2. Fallback: Direct yt-dlp.exe Spawn (Heavy Duty Engine)
    console.log(`[Stream] Attempting direct yt-dlp fallback for ${cleanId}...`);
    
    const ytDlpProcess = spawn(YT_DLP_PATH, [
      url,
      '-f', 'bestaudio',
      '-o', '-',
      '--no-playlist',
      '--no-warnings',
      '--add-header', 'referer:https://www.youtube.com/watch?v=' + cleanId,
      '--add-header', 'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]);

    if (ytDlpProcess.stdout) {
      res.setHeader('Content-Type', 'audio/mpeg');
      console.log(`[Stream] yt-dlp binary started. Piping...`);
      
      ytDlpProcess.stdout.pipe(res);

      ytDlpProcess.stderr.on('data', (data) => {
        // Only log actual errors
        const msg = data.toString();
        if (msg.includes('ERROR')) console.error(`[Stream] yt-dlp error: ${msg.trim()}`);
      });

      ytDlpProcess.on('error', (err) => {
        console.error('[Stream] yt-dlp spawn error:', err.message);
      });

      res.on('close', () => {
        console.log(`[Stream] Connection closed (yt-dlp) for ${cleanId}`);
        ytDlpProcess.kill();
      });
    } else {
      throw new Error('yt-dlp process stdout is unavailable');
    }

  } catch (error) {
    console.error(`[Stream] Fatal error for ${cleanId}:`, error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: `Streaming failed: ${error.message}` });
    }
  }
});

export default router;

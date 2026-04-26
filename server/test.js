import { searchYouTube } from './utils/youtubeSearch.js';

async function runTest() {
  try {
    console.log('Testing yt-search fallback logic...');
    const results = await searchYouTube('Hans Zimmer Time');
    console.log(`Success! Found ${results.length} videos.`);
    if (results.length > 0) {
      console.log('First result:', {
        title: results[0].title,
        videoId: results[0].videoId,
        author: results[0].author.name
      });
    }
  } catch (error) {
    console.error('yt-search failed:', error.message);
  }
}

runTest();

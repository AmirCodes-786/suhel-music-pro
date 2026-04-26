import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import usePlayerStore from '../../store/playerStore';
import useUIStore from '../../store/uiStore';
import { getTrackById } from '../../api/jamendo';
import { searchMultiSource } from '../../api/youtube';

const ShareLinkHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const playTrack = usePlayerStore((s) => s.playTrack);
  const openFullPlayer = useUIStore((s) => s.openFullPlayer);

  useEffect(() => {
    const source = searchParams.get('source');
    const id = searchParams.get('id');

    if (source && id) {
      const loadAndPlay = async () => {
        try {
          let track = null;
          if (source === 'jamendo') {
            const results = await getTrackById(id);
            if (results && results.length > 0) {
              const t = results[0];
              track = {
                id: t.id,
                name: t.name,
                artist_name: t.artist_name,
                image: t.image || t.album_image,
                audio: t.audio,
                duration: t.duration,
                source: 'jamendo'
              };
            }
          } else if (source === 'youtube') {
            // Search for the ID specifically
            const results = await searchMultiSource(id);
            if (results && results.length > 0) {
              // Try to find the exact match or take the first
              track = results.find(r => r.id === id) || results[0];
            } else {
              // Fallback: create a dummy track if search fails but we have ID
              track = {
                id: id,
                name: 'Shared YouTube Track',
                artist_name: 'YouTube',
                image: '',
                audio: `/api/stream?id=${id}`,
                duration: 0,
                source: 'youtube'
              };
            }
          }

          if (track) {
            playTrack(track);
            openFullPlayer();
            // Clean up URL after playing
            navigate('/', { replace: true });
          }
        } catch (error) {
          console.error('Failed to load shared track:', error);
        }
      };

      loadAndPlay();
    }
  }, [searchParams, playTrack, navigate]);

  return null;
};

export default ShareLinkHandler;

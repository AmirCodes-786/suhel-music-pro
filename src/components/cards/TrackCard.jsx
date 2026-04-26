import React, { useCallback } from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import usePlayerStore from '../../store/playerStore';
import useLibraryStore from '../../store/libraryStore';
import { formatDuration } from '../../utils/formatTime';
import { DEFAULT_COVER } from '../../utils/constants';
import TrackMenu from '../common/TrackMenu';
import './TrackCard.css';

const TrackCard = ({ track, tracks, index = 0 }) => {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const isFav = useLibraryStore((s) => s.isFavorite(track.id));

  const isActive = currentTrack?.id === track.id;

  const handlePlay = useCallback((e) => {
    e.stopPropagation();
    if (isActive) {
      togglePlay();
    } else {
      playTrack(track, tracks);
    }
  }, [track, tracks, isActive, playTrack, togglePlay]);

  const handleFav = useCallback((e) => {
    e.stopPropagation();
    toggleFavorite(track);
  }, [track, toggleFavorite]);

  return (
    <motion.div
      className="track-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.8), duration: 0.3, ease: 'easeOut' }}
      onClick={handlePlay}
      whileHover={{ y: -4 }}
    >
      <div className="track-card-image-wrapper">
        <img
          src={track.image || track.album_image || DEFAULT_COVER}
          alt={track.name}
          loading="lazy"
        />
        <button
          className="track-card-play-btn"
          onClick={handlePlay}
          aria-label={isActive && isPlaying ? 'Pause' : 'Play'}
        >
          {isActive && isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
        </button>
        <button
          className={`track-card-fav-btn ${isFav ? 'is-fav' : ''}`}
          onClick={handleFav}
          aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
        >
          <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
        </button>
        <div className="track-card-menu-wrapper" onClick={(e) => e.stopPropagation()}>
          <TrackMenu track={track} />
        </div>
      </div>

      <div className="track-card-body">
        <div className="track-card-title truncate">{track.name}</div>
        <div className="track-card-subtitle truncate">{track.artist_name}</div>
        <div className="track-card-meta">
          {track.source && (
            <span className={`source-badge source-${track.source}`}>
              {track.source === 'youtube' ? 'YouTube' : 'Jamendo'}
            </span>
          )}
          {track.duration > 0 && <span>{formatDuration(track.duration)}</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(TrackCard);

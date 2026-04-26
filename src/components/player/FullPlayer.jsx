import React, { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  X, ChevronDown, Play, Pause,
  SkipBack, SkipForward, Shuffle,
  Repeat, Repeat1, Heart, Share2
} from 'lucide-react';
import usePlayerStore from '../../store/playerStore';
import useLibraryStore from '../../store/libraryStore';
import useUIStore from '../../store/uiStore';
import Visualizer from './Visualizer';
import { formatTime } from '../../utils/formatTime';
import { DEFAULT_COVER, REPEAT_MODES } from '../../utils/constants';
import './FullPlayer.css';

const FullPlayer = ({ seek }) => {
  const progressRef = useRef(null);

  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeat = usePlayerStore((s) => s.repeat);

  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat);

  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const isFav = currentTrack ? useLibraryStore.getState().isFavorite(currentTrack.id) : false;

  const closeFullPlayer = useUIStore((s) => s.closeFullPlayer);
  const addToast = useUIStore((s) => s.addToast);

  const handleShare = useCallback(() => {
    if (!currentTrack) return;
    const url = `${window.location.origin}/?source=${currentTrack.source}&id=${currentTrack.id}`;
    navigator.clipboard.writeText(url);
    addToast('Share link copied to clipboard!', 'success');
  }, [currentTrack, addToast]);

  const handleProgressClick = useCallback(
    (e) => {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seek(percent * duration);
    },
    [duration, seek]
  );

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const RepeatIcon = repeat === REPEAT_MODES.ONE ? Repeat1 : Repeat;
  const coverImage = currentTrack?.image || currentTrack?.album_image || DEFAULT_COVER;

  return (
    <motion.div
      className="full-player"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Blurred Background */}
      <div className="full-player-bg">
        <img src={coverImage} alt="" />
      </div>
      <div className="full-player-overlay" />

      {/* Close buttons */}
      <button className="full-player-chevron" onClick={closeFullPlayer} aria-label="Minimize">
        <ChevronDown size={22} />
      </button>
      <button className="full-player-close" onClick={closeFullPlayer} aria-label="Close">
        <X size={20} />
      </button>

      {/* Content */}
      <div className="full-player-content">
        {/* Album Art */}
        <motion.div
          className="full-player-art-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
        >
          <img
            className={`full-player-art ${isPlaying ? 'playing' : ''}`}
            src={coverImage}
            alt={currentTrack?.name}
          />
        </motion.div>

        {/* Track Info */}
        <motion.div
          className="full-player-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <div className="full-player-title truncate">{currentTrack?.name || 'Unknown'}</div>
          <div className="full-player-artist">{currentTrack?.artist_name || 'Unknown Artist'}</div>
        </motion.div>

        {/* Progress Bar */}
        <div className="full-player-progress">
          <div
            className="full-progress-bar"
            ref={progressRef}
            onClick={handleProgressClick}
          >
            <div className="full-progress-fill" style={{ width: `${progressPercent}%` }} />
            <div className="full-progress-thumb" style={{ left: `${progressPercent}%` }} />
          </div>
          <div className="full-player-times">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="full-player-controls">
          <button
            className={`fp-control-btn ${shuffle ? 'active' : ''}`}
            onClick={toggleShuffle}
            aria-label="Shuffle"
          >
            <Shuffle size={20} />
          </button>

          <button className="fp-control-btn" onClick={prev} aria-label="Previous">
            <SkipBack size={24} fill="currentColor" />
          </button>

          <button className="fp-play-btn" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? (
              <Pause size={26} fill="currentColor" />
            ) : (
              <Play size={26} fill="currentColor" style={{ marginLeft: 2 }} />
            )}
          </button>

          <button className="fp-control-btn" onClick={next} aria-label="Next">
            <SkipForward size={24} fill="currentColor" />
          </button>

          <button
            className={`fp-control-btn ${repeat !== REPEAT_MODES.OFF ? 'active' : ''}`}
            onClick={toggleRepeat}
            aria-label="Repeat"
          >
            <RepeatIcon size={20} />
          </button>
        </div>

        {/* Extra Actions */}
        <div className="full-player-actions">
          <button
            className={`fp-action-btn ${isFav ? 'is-fav' : ''}`}
            onClick={() => currentTrack && toggleFavorite(currentTrack)}
            aria-label="Favorite"
          >
            <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <button 
            className="fp-action-btn" 
            aria-label="Share"
            onClick={handleShare}
          >
            <Share2 size={20} />
          </button>
        </div>

        {/* Visualizer */}
        <div className="full-player-visualizer">
          <Visualizer isActive={isPlaying} />
        </div>
      </div>
    </motion.div>
  );
};

export default FullPlayer;

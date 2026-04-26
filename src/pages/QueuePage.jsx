import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play, Pause, X, Trash2, Music2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayerStore from '../store/playerStore';
import useUIStore from '../store/uiStore';
import { formatDuration } from '../utils/formatTime';
import { DEFAULT_COVER } from '../utils/constants';
import { EmptyState } from '../components/common/Loader';
import './QueuePage.css';

const QueuePage = () => {
  const navigate = useNavigate();

  const queue = usePlayerStore((s) => s.queue);
  const queueIndex = usePlayerStore((s) => s.queueIndex);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const clearQueue = usePlayerStore((s) => s.clearQueue);
  const addToast = useUIStore((s) => s.addToast);

  const handleTrackClick = useCallback((track, index) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      // Play track from its position in the queue
      const state = usePlayerStore.getState();
      usePlayerStore.setState({
        currentTrack: track,
        queueIndex: index,
        isPlaying: true,
        isLoading: true,
        progress: 0,
        error: null,
      });
    }
  }, [currentTrack, togglePlay]);

  const handleRemove = useCallback((e, index) => {
    e.stopPropagation();
    removeFromQueue(index);
    addToast('Removed from queue', 'info');
  }, [removeFromQueue, addToast]);

  const handleClearQueue = useCallback(() => {
    if (window.confirm('Clear the entire queue?')) {
      clearQueue();
      addToast('Queue cleared', 'info');
    }
  }, [clearQueue, addToast]);

  // Split queue into "now playing", "next up", and "played"
  const nowPlaying = currentTrack;
  const upNext = queue.slice(queueIndex + 1);
  const played = queue.slice(0, queueIndex);

  return (
    <div className="queue-page">
      {/* Header */}
      <motion.div
        className="queue-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="heading-lg">
            <span className="text-gradient">Queue</span>
          </h1>
          <p className="queue-subtitle">{queue.length} {queue.length === 1 ? 'track' : 'tracks'} in queue</p>
        </div>
        {queue.length > 0 && (
          <button className="queue-clear-btn" onClick={handleClearQueue}>
            <Trash2 size={14} />
            Clear Queue
          </button>
        )}
      </motion.div>

      {queue.length === 0 ? (
        <EmptyState
          icon="🎵"
          title="Queue is empty"
          message="Play some music and it will appear here"
        />
      ) : (
        <div className="queue-content">
          {/* Now Playing */}
          {nowPlaying && (
            <motion.section
              className="queue-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <h2 className="queue-section-label">Now Playing</h2>
              <div
                className="queue-item now-playing"
                onClick={() => handleTrackClick(nowPlaying, queueIndex)}
              >
                <div className="queue-item-left">
                  <div className="queue-now-indicator">
                    {isPlaying ? (
                      <div className="queue-playing-bars">
                        <span /><span /><span /><span />
                      </div>
                    ) : (
                      <Play size={14} fill="currentColor" />
                    )}
                  </div>
                  <img
                    className="queue-item-cover"
                    src={nowPlaying.image || nowPlaying.album_image || DEFAULT_COVER}
                    alt={nowPlaying.name}
                  />
                  <div className="queue-item-info">
                    <div className="queue-item-name truncate">{nowPlaying.name}</div>
                    <div className="queue-item-artist truncate">{nowPlaying.artist_name}</div>
                  </div>
                </div>
                <div className="queue-item-right">
                  <span className="queue-item-duration">{formatDuration(nowPlaying.duration)}</span>
                </div>
              </div>
            </motion.section>
          )}

          {/* Next Up */}
          {upNext.length > 0 && (
            <motion.section
              className="queue-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <h2 className="queue-section-label">Next Up</h2>
              <AnimatePresence>
                {upNext.map((track, i) => {
                  const absoluteIndex = queueIndex + 1 + i;
                  const isActive = currentTrack?.id === track.id;
                  return (
                    <motion.div
                      key={`${track.id}-${absoluteIndex}`}
                      className={`queue-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleTrackClick(track, absoluteIndex)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.25 }}
                    >
                      <div className="queue-item-left">
                        <span className="queue-item-index">{i + 1}</span>
                        <img
                          className="queue-item-cover"
                          src={track.image || track.album_image || DEFAULT_COVER}
                          alt={track.name}
                        />
                        <div className="queue-item-info">
                          <div className="queue-item-name truncate">{track.name}</div>
                          <div className="queue-item-artist truncate">{track.artist_name}</div>
                        </div>
                      </div>
                      <div className="queue-item-right">
                        <span className="queue-item-duration">{formatDuration(track.duration)}</span>
                        <button
                          className="queue-remove-btn"
                          onClick={(e) => handleRemove(e, absoluteIndex)}
                          aria-label="Remove from queue"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.section>
          )}

          {/* Previously Played */}
          {played.length > 0 && (
            <motion.section
              className="queue-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <h2 className="queue-section-label played-label">Previously Played</h2>
              {played.map((track, i) => {
                const isActive = currentTrack?.id === track.id;
                return (
                  <div
                    key={`${track.id}-played-${i}`}
                    className={`queue-item played ${isActive ? 'active' : ''}`}
                    onClick={() => handleTrackClick(track, i)}
                  >
                    <div className="queue-item-left">
                      <span className="queue-item-index">{i + 1}</span>
                      <img
                        className="queue-item-cover"
                        src={track.image || track.album_image || DEFAULT_COVER}
                        alt={track.name}
                      />
                      <div className="queue-item-info">
                        <div className="queue-item-name truncate">{track.name}</div>
                        <div className="queue-item-artist truncate">{track.artist_name}</div>
                      </div>
                    </div>
                    <div className="queue-item-right">
                      <span className="queue-item-duration">{formatDuration(track.duration)}</span>
                    </div>
                  </div>
                );
              })}
            </motion.section>
          )}
        </div>
      )}
    </div>
  );
};

export default QueuePage;

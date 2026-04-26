import React, { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1,
  Volume2, Volume1, VolumeX, Volume,
  Heart, Maximize2, ListMusic, Share2,
} from 'lucide-react';
import usePlayerStore from '../../store/playerStore';
import useLibraryStore from '../../store/libraryStore';
import useUIStore from '../../store/uiStore';
import { formatTime } from '../../utils/formatTime';
import { DEFAULT_COVER, REPEAT_MODES } from '../../utils/constants';
import './PlayerBar.css';

const PlayerBar = ({ seek }) => {
  const navigate = useNavigate();
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isLoading = usePlayerStore((s) => s.isLoading);
  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);
  const buffered = usePlayerStore((s) => s.buffered);
  const volume = usePlayerStore((s) => s.volume);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeat = usePlayerStore((s) => s.repeat);

  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleMute = usePlayerStore((s) => s.toggleMute);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat);

  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const isFav = currentTrack ? useLibraryStore.getState().isFavorite(currentTrack.id) : false;

  const openFullPlayer = useUIStore((s) => s.openFullPlayer);
  const addToast = useUIStore((s) => s.addToast);

  const handleShare = useCallback(() => {
    if (!currentTrack) return;
    const url = `${window.location.origin}/?source=${currentTrack.source}&id=${currentTrack.id}`;
    navigator.clipboard.writeText(url);
    addToast('Share link copied to clipboard!', 'success');
  }, [currentTrack, addToast]);

  // Progress bar click/drag
  const handleProgressClick = useCallback(
    (e) => {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seek(percent * duration);
    },
    [duration, seek]
  );

  // Volume slider click
  const handleVolumeClick = useCallback(
    (e) => {
      if (!volumeRef.current) return;
      const rect = volumeRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setVolume(percent);
    },
    [setVolume]
  );

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.3 ? Volume : volume < 0.7 ? Volume1 : Volume2;
  const RepeatIcon = repeat === REPEAT_MODES.ONE ? Repeat1 : Repeat;
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <div className="player-bar empty">
        <span className="player-empty-text">🎵 Select a track to start playing</span>
      </div>
    );
  }

  return (
    <div className="player-bar">
      {/* Left: Track Info */}
      <div className="player-track-info" onClick={(e) => {
        if (window.innerWidth <= 768) openFullPlayer();
      }}>
        <img
          className="player-album-art"
          src={currentTrack.image || currentTrack.album_image || DEFAULT_COVER}
          alt={currentTrack.name}
          onClick={(e) => {
            e.stopPropagation();
            openFullPlayer();
          }}
        />
        <div className="player-track-details">
          <div className="player-track-name truncate" onClick={(e) => {
            e.stopPropagation();
            openFullPlayer();
          }}>
            {currentTrack.name}
          </div>
          <div
            className="player-artist-name truncate"
            onClick={(e) => {
              if (currentTrack.artist_id) {
                e.stopPropagation();
                navigate(`/artist/${currentTrack.artist_id}`);
              }
            }}
          >
            {currentTrack.artist_name}
          </div>
        </div>
        <button
          className={`player-fav-btn ${isFav ? 'is-fav' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(currentTrack);
          }}
          aria-label="Toggle favorite"
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
        <button
          className="player-share-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          aria-label="Share song"
          title="Share song link"
        >
          <Share2 size={16} />
        </button>
      </div>

      <div className="mobile-player-controls">
        <button
          className={`mobile-play-btn ${isLoading ? 'loading' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
      </div>

      {/* Center: Controls + Progress */}
      <div className="player-center">
        <div className="player-controls">
          <button
            className={`player-control-btn ${shuffle ? 'active' : ''}`}
            onClick={toggleShuffle}
            aria-label="Toggle shuffle"
            title="Shuffle"
          >
            <Shuffle size={16} />
          </button>

          <button className="player-control-btn" onClick={prev} aria-label="Previous" title="Previous">
            <SkipBack size={18} fill="currentColor" />
          </button>

          <button
            className={`player-play-btn ${isLoading ? 'loading' : ''}`}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>

          <button className="player-control-btn" onClick={next} aria-label="Next" title="Next">
            <SkipForward size={18} fill="currentColor" />
          </button>

          <button
            className={`player-control-btn ${repeat !== REPEAT_MODES.OFF ? 'active' : ''}`}
            onClick={toggleRepeat}
            aria-label="Toggle repeat"
            title={`Repeat: ${repeat}`}
          >
            <RepeatIcon size={16} />
          </button>
        </div>

        <div className="player-progress-container">
          <span className="player-time">{formatTime(progress)}</span>
          <div
            className="progress-bar-wrapper"
            ref={progressRef}
            onClick={handleProgressClick}
          >
            <div
              className="progress-bar-buffered"
              style={{ width: `${bufferedPercent}%` }}
            />
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="progress-bar-thumb"
              style={{ left: `${progressPercent}%` }}
            />
          </div>
          <span className="player-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Mobile Play Button */}
      <button
        className="player-play-btn mobile-play-btn"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      </button>

      {/* Right: Volume + Actions */}
      <div className="player-right">
        <button
          className="player-control-btn"
          onClick={() => navigate('/queue')}
          aria-label="Queue"
          title="Queue"
        >
          <ListMusic size={16} />
        </button>

        <div className="volume-control">
          <button
            className="player-control-btn"
            onClick={toggleMute}
            aria-label="Toggle mute"
          >
            <VolumeIcon size={16} />
          </button>
          <div
            className="volume-slider-wrapper"
            ref={volumeRef}
            onClick={handleVolumeClick}
          >
            <div
              className="volume-slider-fill"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>

        <button
          className="player-expand-btn"
          onClick={openFullPlayer}
          aria-label="Expand player"
          title="Full screen player"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PlayerBar);

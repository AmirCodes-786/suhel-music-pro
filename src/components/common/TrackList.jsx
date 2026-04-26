import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Play, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import usePlayerStore from '../../store/playerStore';
import useLibraryStore from '../../store/libraryStore';
import { formatDuration } from '../../utils/formatTime';
import { DEFAULT_COVER } from '../../utils/constants';
import TrackMenu from './TrackMenu';
import './TrackList.css';

const NowPlayingBars = () => (
  <div className="now-playing-bars">
    <span /><span /><span /><span />
  </div>
);

const TrackRow = React.memo(({ track, index, tracks, isActive, isPlaying }) => {
  const navigate = useNavigate();
  const playTrack = usePlayerStore((s) => s.playTrack);
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const isFav = useLibraryStore((s) => s.isFavorite(track.id));

  const handlePlay = useCallback(() => {
    playTrack(track, tracks);
  }, [track, tracks, playTrack]);

  const handleArtistClick = useCallback((e) => {
    e.stopPropagation();
    if (track.artist_id) navigate(`/artist/${track.artist_id}`);
  }, [track.artist_id, navigate]);

  const handleFavorite = useCallback((e) => {
    e.stopPropagation();
    toggleFavorite(track);
  }, [track, toggleFavorite]);

  return (
    <motion.div
      className={`track-row ${isActive ? 'active' : ''}`}
      onClick={handlePlay}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.25 }}
    >
      <div className="track-number">
        {isActive && isPlaying ? (
          <NowPlayingBars />
        ) : (
          <>
            <span className="num">{index + 1}</span>
            <Play className="play-icon" size={14} />
          </>
        )}
      </div>

      <img
        className="track-thumb"
        src={track.image || track.album_image || DEFAULT_COVER}
        alt={track.name}
        loading="lazy"
      />

      <div className="track-info">
        <div className="track-name truncate">
          {track.name}
          {track.source && (
            <span className={`source-badge source-${track.source}`}>
              {track.source === 'youtube' ? 'YT' : 'Jamendo'}
            </span>
          )}
        </div>
        <div className="track-artist-name truncate" onClick={handleArtistClick}>
          {track.artist_name}
        </div>
      </div>

      <div className="track-album-name truncate">
        {track.album_name || '—'}
      </div>

      <div className="track-duration">
        {formatDuration(track.duration)}
      </div>

      <div className="track-actions">
        <button
          className={isFav ? 'is-fav' : ''}
          onClick={handleFavorite}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
        <div onClick={(e) => e.stopPropagation()}>
          <TrackMenu track={track} />
        </div>
      </div>
    </motion.div>
  );
});

const TrackList = ({ tracks = [], showHeader = true }) => {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  if (!tracks.length) return null;

  return (
    <div className="track-list">
      {showHeader && (
        <div className="track-list-header">
          <span>#</span>
          <span></span>
          <span>Title</span>
          <span>Album</span>
          <span style={{ textAlign: 'right' }}>Duration</span>
          <span></span>
        </div>
      )}
      {tracks.map((track, index) => (
        <TrackRow
          key={track.id}
          track={track}
          index={index}
          tracks={tracks}
          isActive={currentTrack?.id === track.id}
          isPlaying={isPlaying && currentTrack?.id === track.id}
        />
      ))}
    </div>
  );
};

export default React.memo(TrackList);

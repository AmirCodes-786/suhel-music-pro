import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Shuffle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAlbumById } from '../api/jamendo';
import usePlayerStore from '../store/playerStore';
import TrackList from '../components/common/TrackList';
import { Spinner, ErrorDisplay } from '../components/common/Loader';
import { DEFAULT_COVER } from '../utils/constants';
import { formatDuration } from '../utils/formatTime';
import './AlbumPage.css';

const AlbumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const playTrack = usePlayerStore((s) => s.playTrack);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAlbumById(id);
        if (data?.[0]) {
          setAlbum(data[0]);
          setTracks(data[0].tracks || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load album');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAlbum();
  }, [id]);

  const handlePlayAll = useCallback(() => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  }, [tracks, playTrack]);

  const handleShuffle = useCallback(() => {
    if (tracks.length > 0) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled);
    }
  }, [tracks, playTrack]);

  if (loading) return <Spinner />;
  if (error) return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  if (!album) return <ErrorDisplay message="Album not found" />;

  const coverImage = album.image || DEFAULT_COVER;
  const totalDuration = tracks.reduce((acc, t) => acc + (Number(t.duration) || 0), 0);

  return (
    <div className="album-page">
      {/* Hero Section */}
      <motion.div
        className="album-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="album-hero-bg">
          <img src={coverImage} alt="" />
        </div>
        <div className="album-hero-overlay" />

        <div className="album-hero-content">
          <motion.img
            className="album-hero-cover"
            src={coverImage}
            alt={album.name}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
          />
          <motion.div
            className="album-hero-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <span className="album-hero-label">Album</span>
            <h1 className="heading-xl">{album.name}</h1>
            <div className="album-hero-meta">
              <span
                className="album-artist-link"
                onClick={() => album.artist_id && navigate(`/artist/${album.artist_id}`)}
              >
                {album.artist_name}
              </span>
              <span className="meta-dot">·</span>
              <span>{tracks.length} tracks</span>
              {totalDuration > 0 && (
                <>
                  <span className="meta-dot">·</span>
                  <Clock size={13} style={{ verticalAlign: 'middle' }} />
                  <span>{formatDuration(totalDuration)}</span>
                </>
              )}
              {album.releasedate && (
                <>
                  <span className="meta-dot">·</span>
                  <span>{new Date(album.releasedate).getFullYear()}</span>
                </>
              )}
            </div>
            <div className="album-hero-actions">
              <button className="album-play-btn" onClick={handlePlayAll}>
                <Play size={18} fill="white" />
                Play All
              </button>
              <button className="album-shuffle-btn" onClick={handleShuffle}>
                <Shuffle size={16} />
                Shuffle
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Track List */}
      {tracks.length > 0 && (
        <motion.section
          className="album-tracks-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <TrackList tracks={tracks} />
        </motion.section>
      )}
    </div>
  );
};

export default AlbumPage;

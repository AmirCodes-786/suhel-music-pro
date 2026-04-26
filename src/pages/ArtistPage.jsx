import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Shuffle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { getArtistById, getArtistTracks, getArtistAlbums } from '../api/jamendo';
import usePlayerStore from '../store/playerStore';
import TrackList from '../components/common/TrackList';
import CardGrid from '../components/common/CardGrid';
import AlbumCard from '../components/cards/AlbumCard';
import { Spinner, ErrorDisplay } from '../components/common/Loader';
import { DEFAULT_ARTIST_IMAGE } from '../utils/constants';
import './ArtistPage.css';

const ArtistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const playTrack = usePlayerStore((s) => s.playTrack);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        setError(null);
        const [artistData, tracksData, albumsData] = await Promise.all([
          getArtistById(id),
          getArtistTracks(id, 20),
          getArtistAlbums(id, 12),
        ]);

        setArtist(artistData?.[0] || null);

        // Artist tracks endpoint returns nested data
        if (tracksData?.[0]?.tracks) {
          setTracks(tracksData[0].tracks);
        } else {
          setTracks(tracksData || []);
        }

        // Artist albums endpoint returns nested data
        if (albumsData?.[0]?.albums) {
          setAlbums(albumsData[0].albums);
        } else {
          setAlbums(albumsData || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load artist');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArtist();
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
  if (!artist) return <ErrorDisplay message="Artist not found" />;

  const heroImage = artist.image || DEFAULT_ARTIST_IMAGE;

  return (
    <div className="artist-page">
      {/* Hero Section */}
      <motion.div
        className="artist-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="artist-hero-bg">
          <img src={heroImage} alt="" />
        </div>
        <div className="artist-hero-overlay" />

        <div className="artist-hero-content">
          <motion.img
            className="artist-hero-avatar"
            src={heroImage}
            alt={artist.name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
          />
          <motion.div
            className="artist-hero-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <span className="artist-hero-label">Artist</span>
            <h1 className="heading-xl">{artist.name}</h1>
            {artist.joindate && (
              <p className="artist-hero-meta">
                Active since {new Date(artist.joindate).getFullYear()}
              </p>
            )}
            <div className="artist-hero-actions">
              <button className="artist-play-btn" onClick={handlePlayAll}>
                <Play size={18} fill="white" />
                Play All
              </button>
              <button className="artist-shuffle-btn" onClick={handleShuffle}>
                <Shuffle size={16} />
                Shuffle
              </button>
              {artist.website && (
                <a
                  className="artist-link-btn"
                  href={artist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={14} />
                  Website
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Popular Tracks */}
      {tracks.length > 0 && (
        <motion.section
          className="artist-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <h2 className="heading-sm">Popular Tracks</h2>
          <TrackList tracks={tracks} />
        </motion.section>
      )}

      {/* Albums */}
      {albums.length > 0 && (
        <motion.section
          className="artist-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <CardGrid title="Albums" subtitle={`Albums by ${artist.name}`}>
            {albums.map((album, i) => (
              <AlbumCard key={album.id} album={album} index={i} />
            ))}
          </CardGrid>
        </motion.section>
      )}
    </div>
  );
};

export default ArtistPage;

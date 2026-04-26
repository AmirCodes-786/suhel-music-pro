import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Sparkles, Play, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTrendingTracks, getNewTracks, getTracksByTag } from '../api/jamendo';
import { searchMultiSource } from '../api/youtube';
import usePlayerStore from '../store/playerStore';
import useLibraryStore from '../store/libraryStore';
import CardGrid from '../components/common/CardGrid';
import TrackCard from '../components/cards/TrackCard';
import { SkeletonGrid, ErrorDisplay } from '../components/common/Loader';
import './HomePage.css';



const HomePage = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [ytTrending, setYtTrending] = useState([]);
  const [englishSongs, setEnglishSongs] = useState([]);
  const [hindiSongs, setHindiSongs] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recentlyPlayed = useLibraryStore((s) => s.recentlyPlayed);
  const playTrack = usePlayerStore((s) => s.playTrack);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [trendingData, newData, ytData, engData, hinData] = await Promise.all([
          getTrendingTracks(20),
          getNewTracks(10),
          searchMultiSource('trending music'),
          searchMultiSource('top english songs'),
          searchMultiSource('top hindi songs'),
        ]);
        setTrending(trendingData || []);
        setNewReleases(newData || []);
        setYtTrending(ytData || []);
        setEnglishSongs(engData || []);
        setHindiSongs(hinData || []);
      } catch (err) {
        setError(err.message || 'Failed to load music data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  const handlePlayAll = useCallback(() => {
    if (ytTrending.length > 0) {
      playTrack(ytTrending[0], ytTrending);
    } else if (trending.length > 0) {
      playTrack(trending[0], trending);
    }
  }, [ytTrending, trending, playTrack]);

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.div
        className="home-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="home-hero-content">
          <div className="home-hero-label">
            <Sparkles size={12} />
            Premium Music Experience
          </div>
          <h1>
            Discover Your
            <br />
            <span className="text-gradient">Next Favorite Song</span>
          </h1>
          <p>
            Stream hundreds of thousands of free tracks. Create playlists,
            discover trending music, and enjoy beautiful audio visualizations.
          </p>
          <div className="home-hero-actions">
            <button className="hero-btn-primary" onClick={handlePlayAll}>
              <Play size={16} fill="white" />
              Play Trending
            </button>
            <button className="hero-btn-secondary" onClick={() => navigate('/search?q=popular music')}>
              Explore Music
            </button>
          </div>
        </div>
      </motion.div>



      {/* YouTube Trending (Renamed to Trending Songs) */}
      {ytTrending.length > 0 && (
        <CardGrid
          title="Trending Songs"
          subtitle="Popular music videos from YouTube"
          action={
            <button onClick={() => playTrack(ytTrending[0], ytTrending)}>
              <Play size={14} fill="white" style={{ marginRight: 4 }} />
              Play All
            </button>
          }
        >
          {ytTrending.slice(0, 10).map((track, i) => (
            <TrackCard key={track.id} track={track} tracks={ytTrending} index={i} />
          ))}
        </CardGrid>
      )}

      {/* Top English Songs */}
      {englishSongs.length > 0 && (
        <CardGrid
          title="Top English Songs"
          subtitle="Trending International Hits"
        >
          {englishSongs.slice(0, 10).map((track, i) => (
            <TrackCard key={track.id} track={track} tracks={englishSongs} index={i} />
          ))}
        </CardGrid>
      )}

      {/* Top Hindi Songs */}
      {hindiSongs.length > 0 && (
        <CardGrid
          title="Top Hindi Songs"
          subtitle="Trending Bollywood & Indie Hits"
        >
          {hindiSongs.slice(0, 10).map((track, i) => (
            <TrackCard key={track.id} track={track} tracks={hindiSongs} index={i} />
          ))}
        </CardGrid>
      )}

      {/* Trending Tracks (Jamendo) */}
      {loading ? (
        <SkeletonGrid count={10} />
      ) : (
        <CardGrid
          title="Trending on Jamendo"
          subtitle="Most popular tracks this week"
          action={
            <button onClick={handlePlayAll}>
              <TrendingUp size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              Play All
            </button>
          }
        >
          {trending.map((track, i) => (
            <TrackCard key={track.id} track={track} tracks={trending} index={i} />
          ))}
        </CardGrid>
      )}



      {/* New Releases */}
      {newReleases.length > 0 && (
        <CardGrid
          title="Fresh Releases"
          subtitle="Newly added tracks"
        >
          {newReleases.map((track, i) => (
            <TrackCard key={track.id} track={track} tracks={newReleases} index={i} />
          ))}
        </CardGrid>
      )}

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <CardGrid
          title="Recently Played"
          subtitle="Pick up where you left off"
          action={
            <button onClick={() => navigate('/library')}>
              <Clock size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              View All
            </button>
          }
        >
          {recentlyPlayed.slice(0, 10).map((track, i) => (
            <TrackCard key={track.id} track={track} tracks={recentlyPlayed} index={i} />
          ))}
        </CardGrid>
      )}
    </div>
  );
};

export default HomePage;

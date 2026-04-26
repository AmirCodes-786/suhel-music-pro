import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Music, Disc, User, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchTracks, searchArtists, searchAlbums, getTracksByTag } from '../api/jamendo';
import { searchMultiSource } from '../api/youtube';
import usePlayerStore from '../store/playerStore';
import TrackList from '../components/common/TrackList';
import CardGrid from '../components/common/CardGrid';
import ArtistCard from '../components/cards/ArtistCard';
import AlbumCard from '../components/cards/AlbumCard';
import TrackCard from '../components/cards/TrackCard';
import { SkeletonGrid, SkeletonRows, EmptyState } from '../components/common/Loader';
import './SearchPage.css';

const TABS = [
  { key: 'all', label: 'All', icon: Search },
  { key: 'tracks', label: 'Tracks', icon: Music },
  { key: 'artists', label: 'Artists', icon: User },
  { key: 'albums', label: 'Albums', icon: Disc },
];

const QUICK_GENRES = ['electronic', 'rock', 'pop', 'jazz', 'classical', 'hiphop', 'ambient', 'metal', 'indie', 'soul'];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState({ tracks: [], artists: [], albums: [] });
  const [loading, setLoading] = useState(false);
  const [quickTracks, setQuickTracks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const playTrack = usePlayerStore((s) => s.playTrack);

  // Search when query changes
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ tracks: [], artists: [], albums: [] });
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const [tracks, artists, albums] = await Promise.all([
          searchMultiSource(query),
          searchArtists(query, 12),
          searchAlbums(query, 12),
        ]);
        setResults({
          tracks: tracks || [],
          artists: artists || [],
          albums: albums || [],
        });
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  // Quick genre explore
  const handleGenreClick = useCallback(async (genre) => {
    setSelectedGenre(genre);
    try {
      const data = await getTracksByTag(genre, 12);
      setQuickTracks(data || []);
    } catch (err) {
      console.error('Genre fetch failed:', err);
    }
  }, []);

  const totalResults = (results.tracks?.length || 0) + (results.artists?.length || 0) + (results.albums?.length || 0);
  const hasQuery = query && query.length >= 2;

  return (
    <div className="search-page">
      {/* Search Header */}
      <motion.div
        className="search-page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="heading-lg">
          {hasQuery ? (
            <>Results for <span className="text-gradient">"{query}"</span></>
          ) : (
            <>Explore <span className="text-gradient">Music</span></>
          )}
        </h1>
        {hasQuery && !loading && (
          <p className="search-result-count">{totalResults} results found</p>
        )}
      </motion.div>

      {/* If no query, show genre browse */}
      {!hasQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="search-genres-section">
            <h2 className="heading-sm">
              <TrendingUp size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Browse by Genre
            </h2>
            <div className="search-genre-grid">
              {QUICK_GENRES.map((genre, i) => (
                <motion.button
                  key={genre}
                  className={`search-genre-card ${selectedGenre === genre ? 'active' : ''}`}
                  onClick={() => handleGenreClick(genre)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    '--genre-hue': `${(i / QUICK_GENRES.length) * 300 + 220}`,
                  }}
                >
                  <span className="genre-card-name">
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Genre results */}
          <AnimatePresence mode="wait">
            {quickTracks.length > 0 && selectedGenre && (
              <motion.div
                key={selectedGenre}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <CardGrid
                  title={`${selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Tracks`}
                  subtitle="Discover popular tracks in this genre"
                >
                  {quickTracks.map((track, i) => (
                    <TrackCard key={track.id} track={track} tracks={quickTracks} index={i} />
                  ))}
                </CardGrid>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Tabs (only when searching) */}
      {hasQuery && (
        <>
          <div className="search-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`search-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="search-loading">
              <SkeletonRows count={5} />
              <div style={{ marginTop: 32 }}>
                <SkeletonGrid count={6} />
              </div>
            </div>
          ) : totalResults === 0 ? (
            <EmptyState
              icon="🔍"
              title="No results found"
              message={`We couldn't find anything matching "${query}". Try a different search.`}
            />
          ) : (
            <div className="search-results">
              {/* Tracks */}
              {(activeTab === 'all' || activeTab === 'tracks') && results.tracks.length > 0 && (
                <motion.section
                  className="search-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {activeTab === 'all' && (
                    <div className="search-section-header">
                      <h2 className="heading-sm">Tracks</h2>
                      <button className="search-see-all" onClick={() => setActiveTab('tracks')}>
                        See all
                      </button>
                    </div>
                  )}
                  <TrackList
                    tracks={activeTab === 'all' ? results.tracks.slice(0, 5) : results.tracks}
                  />
                </motion.section>
              )}

              {/* Artists */}
              {(activeTab === 'all' || activeTab === 'artists') && results.artists.length > 0 && (
                <motion.section
                  className="search-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <CardGrid
                    title={activeTab === 'all' ? 'Artists' : undefined}
                    action={
                      activeTab === 'all' ? (
                        <button className="search-see-all" onClick={() => setActiveTab('artists')}>
                          See all
                        </button>
                      ) : undefined
                    }
                  >
                    {(activeTab === 'all' ? results.artists.slice(0, 6) : results.artists).map(
                      (artist, i) => (
                        <ArtistCard key={artist.id} artist={artist} index={i} />
                      )
                    )}
                  </CardGrid>
                </motion.section>
              )}

              {/* Albums */}
              {(activeTab === 'all' || activeTab === 'albums') && results.albums.length > 0 && (
                <motion.section
                  className="search-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <CardGrid
                    title={activeTab === 'all' ? 'Albums' : undefined}
                    action={
                      activeTab === 'all' ? (
                        <button className="search-see-all" onClick={() => setActiveTab('albums')}>
                          See all
                        </button>
                      ) : undefined
                    }
                  >
                    {(activeTab === 'all' ? results.albums.slice(0, 6) : results.albums).map(
                      (album, i) => (
                        <AlbumCard key={album.id} album={album} index={i} />
                      )
                    )}
                  </CardGrid>
                </motion.section>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;

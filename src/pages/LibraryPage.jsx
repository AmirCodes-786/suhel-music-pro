import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, ListMusic, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useLibraryStore from '../store/libraryStore';
import usePlayerStore from '../store/playerStore';
import useUIStore from '../store/uiStore';
import TrackList from '../components/common/TrackList';
import CardGrid from '../components/common/CardGrid';
import PlaylistCard from '../components/cards/PlaylistCard';
import { EmptyState } from '../components/common/Loader';
import './LibraryPage.css';

const TABS = [
  { key: 'favorites', label: 'Favorites', icon: Heart },
  { key: 'playlists', label: 'Playlists', icon: ListMusic },
  { key: 'recent', label: 'Recently Played', icon: Clock },
];

const LibraryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('favorites');

  const favorites = useLibraryStore((s) => s.favorites);
  const recentlyPlayed = useLibraryStore((s) => s.recentlyPlayed);
  const playlists = useLibraryStore((s) => s.playlists);
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);
  const clearRecentlyPlayed = useLibraryStore((s) => s.clearRecentlyPlayed);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const addToast = useUIStore((s) => s.addToast);

  const handleCreatePlaylist = useCallback(() => {
    const name = prompt('Enter playlist name:');
    if (name?.trim()) {
      const p = createPlaylist(name.trim());
      addToast('Playlist created!', 'success');
      navigate(`/playlist/${p.id}`);
    }
  }, [createPlaylist, navigate, addToast]);

  const handlePlayAllFavorites = useCallback(() => {
    if (favorites.length > 0) {
      playTrack(favorites[0], favorites);
    }
  }, [favorites, playTrack]);

  const handleClearRecent = useCallback(() => {
    if (window.confirm('Clear recently played history?')) {
      clearRecentlyPlayed();
      addToast('History cleared', 'info');
    }
  }, [clearRecentlyPlayed, addToast]);

  return (
    <div className="library-page">
      {/* Header */}
      <motion.div
        className="library-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="heading-lg">
          Your <span className="text-gradient">Library</span>
        </h1>
        <p className="library-subtitle">Your personal music collection</p>
      </motion.div>

      {/* Tabs */}
      <div className="library-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`library-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon size={15} />
            {tab.label}
            {tab.key === 'favorites' && favorites.length > 0 && (
              <span className="tab-badge">{favorites.length}</span>
            )}
            {tab.key === 'playlists' && playlists.length > 0 && (
              <span className="tab-badge">{playlists.length}</span>
            )}
            {tab.key === 'recent' && recentlyPlayed.length > 0 && (
              <span className="tab-badge">{recentlyPlayed.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="library-content"
        >
          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <>
              {favorites.length > 0 ? (
                <div>
                  <div className="library-section-header">
                    <span className="library-count">{favorites.length} liked songs</span>
                    <button className="library-play-all-btn" onClick={handlePlayAllFavorites}>
                      Play All
                    </button>
                  </div>
                  <TrackList tracks={favorites} />
                </div>
              ) : (
                <EmptyState
                  icon="❤️"
                  title="No favorites yet"
                  message="Like songs by clicking the heart icon to see them here"
                />
              )}
            </>
          )}

          {/* Playlists Tab */}
          {activeTab === 'playlists' && (
            <>
              <div className="library-section-header">
                <span className="library-count">{playlists.length} playlists</span>
                <button className="library-create-btn" onClick={handleCreatePlaylist}>
                  <Plus size={16} />
                  New Playlist
                </button>
              </div>
              {playlists.length > 0 ? (
                <CardGrid>
                  {playlists.map((pl, i) => (
                    <PlaylistCard key={pl.id} playlist={pl} index={i} />
                  ))}
                </CardGrid>
              ) : (
                <EmptyState
                  icon="📝"
                  title="No playlists yet"
                  message="Create your first playlist and start adding songs"
                />
              )}
            </>
          )}

          {/* Recently Played Tab */}
          {activeTab === 'recent' && (
            <>
              {recentlyPlayed.length > 0 ? (
                <div>
                  <div className="library-section-header">
                    <span className="library-count">{recentlyPlayed.length} recently played</span>
                    <button className="library-clear-btn" onClick={handleClearRecent}>
                      <Trash2 size={14} />
                      Clear History
                    </button>
                  </div>
                  <TrackList tracks={recentlyPlayed} />
                </div>
              ) : (
                <EmptyState
                  icon="🕐"
                  title="No listening history"
                  message="Start playing music and your history will appear here"
                />
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LibraryPage;

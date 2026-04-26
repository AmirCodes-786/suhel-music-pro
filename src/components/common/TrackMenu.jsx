import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MoreHorizontal, Plus, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useLibraryStore from '../../store/libraryStore';
import './TrackMenu.css';

const TrackMenu = ({ track }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const menuRef = useRef(null);
  const playlists = useLibraryStore((s) => s.playlists);
  const addToPlaylist = useLibraryStore((s) => s.addToPlaylist);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    setShowPlaylists(false);
  };

  const handleAddToPlaylist = (playlistId) => {
    addToPlaylist(playlistId, track);
    setIsOpen(false);
    setShowPlaylists(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowPlaylists(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="track-menu-container" ref={menuRef}>
      <button 
        className="track-menu-trigger" 
        onClick={toggleMenu}
        aria-label="More options"
      >
        <MoreHorizontal size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="track-menu-dropdown"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {!showPlaylists ? (
              <button 
                className="track-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPlaylists(true);
                }}
              >
                <Plus size={16} />
                <span>Add to Playlist</span>
              </button>
            ) : (
              <div className="track-menu-playlists">
                <div className="playlist-menu-header">
                  <span>Select Playlist</span>
                </div>
                {playlists.length > 0 ? (
                  playlists.map((pl) => (
                    <button 
                      key={pl.id} 
                      className="track-menu-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToPlaylist(pl.id);
                      }}
                    >
                      <Music size={14} />
                      <span className="truncate">{pl.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="no-playlists-msg">No playlists found</div>
                )}
                <button 
                  className="track-menu-item back-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPlaylists(false);
                  }}
                >
                  <span>Back</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrackMenu;

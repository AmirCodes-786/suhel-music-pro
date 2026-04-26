import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Shuffle, Trash2, Edit3, Music, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import usePlayerStore from '../store/playerStore';
import useLibraryStore from '../store/libraryStore';
import useUIStore from '../store/uiStore';
import TrackList from '../components/common/TrackList';
import { EmptyState, ErrorDisplay } from '../components/common/Loader';
import './PlaylistPage.css';

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  const playlist = useLibraryStore((s) => s.getPlaylistById(id));
  const renamePlaylist = useLibraryStore((s) => s.renamePlaylist);
  const deletePlaylist = useLibraryStore((s) => s.deletePlaylist);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const addToast = useUIStore((s) => s.addToast);

  const tracks = playlist?.tracks || [];

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

  const handleRename = useCallback(() => {
    if (editName.trim() && playlist) {
      renamePlaylist(playlist.id, editName.trim());
      setIsEditing(false);
      addToast('Playlist renamed!', 'success');
    }
  }, [editName, playlist, renamePlaylist, addToast]);

  const handleDelete = useCallback(() => {
    if (playlist && window.confirm(`Delete "${playlist.name}"? This cannot be undone.`)) {
      deletePlaylist(playlist.id);
      addToast('Playlist deleted', 'info');
      navigate('/library');
    }
  }, [playlist, deletePlaylist, navigate, addToast]);

  const startEditing = useCallback(() => {
    setEditName(playlist?.name || '');
    setIsEditing(true);
  }, [playlist]);

  if (!playlist) {
    return <ErrorDisplay message="Playlist not found" />;
  }

  // Build a cover from first 4 tracks, or show placeholder
  const coverTracks = tracks.slice(0, 4);

  return (
    <div className="playlist-page">
      {/* Hero Section */}
      <motion.div
        className="playlist-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="playlist-hero-cover">
          {coverTracks.length >= 4 ? (
            <div className="playlist-mosaic">
              {coverTracks.map((t, i) => (
                <img
                  key={i}
                  src={t.image || t.album_image}
                  alt=""
                  className="mosaic-img"
                />
              ))}
            </div>
          ) : coverTracks.length > 0 ? (
            <img
              src={coverTracks[0].image || coverTracks[0].album_image}
              alt={playlist.name}
              className="playlist-single-cover"
            />
          ) : (
            <div className="playlist-empty-cover">
              <Music size={56} />
            </div>
          )}
        </div>

        <div className="playlist-hero-info">
          <span className="playlist-hero-label">Playlist</span>

          {isEditing ? (
            <div className="playlist-edit-name">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                autoFocus
                className="playlist-name-input"
              />
              <button className="playlist-save-btn" onClick={handleRename}>
                Save
              </button>
              <button className="playlist-cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <h1 className="heading-xl">{playlist.name}</h1>
          )}

          <div className="playlist-hero-meta">
            <span>{tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}</span>
            {playlist.createdAt && (
              <>
                <span className="meta-dot">·</span>
                <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
              </>
            )}
          </div>

          <div className="playlist-hero-actions">
            {tracks.length > 0 && (
              <>
                <button className="playlist-play-btn" onClick={handlePlayAll}>
                  <Play size={18} fill="white" />
                  Play All
                </button>
                <button className="playlist-shuffle-btn" onClick={handleShuffle}>
                  <Shuffle size={16} />
                  Shuffle
                </button>
              </>
            )}
            <button className="playlist-action-btn" onClick={startEditing} title="Rename">
              <Edit3 size={16} />
            </button>
            <button className="playlist-action-btn delete" onClick={handleDelete} title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Track List */}
      {tracks.length > 0 ? (
        <motion.section
          className="playlist-tracks"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <TrackList tracks={tracks} />
        </motion.section>
      ) : (
        <EmptyState
          icon="🎶"
          title="This playlist is empty"
          message="Search for songs and add them to this playlist"
        />
      )}
    </div>
  );
};

export default PlaylistPage;

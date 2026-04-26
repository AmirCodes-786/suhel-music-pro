import { create } from 'zustand';
import { storage } from '../utils/storage';
import { MAX_RECENT_TRACKS } from '../utils/constants';

const useLibraryStore = create((set, get) => ({
  // Favorites
  favorites: storage.get('favorites', []),

  // Recently Played
  recentlyPlayed: storage.get('recentlyPlayed', []),

  // User Playlists
  playlists: storage.get('playlists', []),

  // Favorites Actions
  toggleFavorite: (track) => {
    const { favorites } = get();
    const exists = favorites.some((t) => t.id === track.id);
    const updated = exists
      ? favorites.filter((t) => t.id !== track.id)
      : [track, ...favorites];
    set({ favorites: updated });
    storage.set('favorites', updated);
  },

  isFavorite: (trackId) => {
    return get().favorites.some((t) => t.id === trackId);
  },

  // Recently Played Actions
  addToRecentlyPlayed: (track) => {
    const { recentlyPlayed } = get();
    const filtered = recentlyPlayed.filter((t) => t.id !== track.id);
    const updated = [track, ...filtered].slice(0, MAX_RECENT_TRACKS);
    set({ recentlyPlayed: updated });
    storage.set('recentlyPlayed', updated);
  },

  clearRecentlyPlayed: () => {
    set({ recentlyPlayed: [] });
    storage.set('recentlyPlayed', []);
  },

  // Playlist Actions
  createPlaylist: (name) => {
    const { playlists } = get();
    const newPlaylist = {
      id: `pl_${Date.now()}`,
      name,
      tracks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newPlaylist, ...playlists];
    set({ playlists: updated });
    storage.set('playlists', updated);
    return newPlaylist;
  },

  deletePlaylist: (playlistId) => {
    const updated = get().playlists.filter((p) => p.id !== playlistId);
    set({ playlists: updated });
    storage.set('playlists', updated);
  },

  renamePlaylist: (playlistId, newName) => {
    const updated = get().playlists.map((p) =>
      p.id === playlistId ? { ...p, name: newName, updatedAt: new Date().toISOString() } : p
    );
    set({ playlists: updated });
    storage.set('playlists', updated);
  },

  addToPlaylist: (playlistId, track) => {
    const updated = get().playlists.map((p) => {
      if (p.id !== playlistId) return p;
      if (p.tracks.some((t) => t.id === track.id)) return p;
      return {
        ...p,
        tracks: [...p.tracks, track],
        updatedAt: new Date().toISOString(),
      };
    });
    set({ playlists: updated });
    storage.set('playlists', updated);
  },

  removeFromPlaylist: (playlistId, trackId) => {
    const updated = get().playlists.map((p) => {
      if (p.id !== playlistId) return p;
      return {
        ...p,
        tracks: p.tracks.filter((t) => t.id !== trackId),
        updatedAt: new Date().toISOString(),
      };
    });
    set({ playlists: updated });
    storage.set('playlists', updated);
  },

  getPlaylistById: (playlistId) => {
    return get().playlists.find((p) => p.id === playlistId) || null;
  },
}));

export default useLibraryStore;

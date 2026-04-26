import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, Sun, Moon } from 'lucide-react';
import useUIStore from '../../store/uiStore';
import usePlayerStore from '../../store/playerStore';
import useDebounce from '../../hooks/useDebounce';
import { searchArtists, searchAlbums } from '../../api/jamendo';
import { searchMultiSource } from '../../api/youtube';
import { DEFAULT_COVER, DEFAULT_ARTIST_IMAGE } from '../../utils/constants';
import './TopBar.css';

const TopBar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const toggleMobileSidebar = useUIStore((s) => s.toggleMobileSidebar);
  const playTrack = usePlayerStore((s) => s.playTrack);

  const debouncedQuery = useDebounce(query, 350);

  // Fetch search results
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults(null);
      setShowDropdown(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const [tracks, artists, albums] = await Promise.all([
          searchMultiSource(debouncedQuery),
          searchArtists(debouncedQuery, 3),
          searchAlbums(debouncedQuery, 3),
        ]);
        // Limit tracks to top 5 in dropdown
        setResults({ tracks: tracks?.slice(0, 5), artists, albums });
        setShowDropdown(true);
      } catch (err) {
        console.error('Search failed:', err);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        setShowDropdown(false);
      }
    },
    [query, navigate]
  );

  const handleTrackClick = useCallback(
    (track) => {
      playTrack(track);
      setShowDropdown(false);
      setQuery('');
    },
    [playTrack]
  );

  const handleArtistClick = useCallback(
    (artist) => {
      navigate(`/artist/${artist.id}`);
      setShowDropdown(false);
      setQuery('');
    },
    [navigate]
  );

  const handleAlbumClick = useCallback(
    (album) => {
      navigate(`/album/${album.id}`);
      setShowDropdown(false);
      setQuery('');
    },
    [navigate]
  );

  return (
    <header className="topbar">
      <button
        className="topbar-menu-btn"
        onClick={toggleMobileSidebar}
        aria-label="Toggle menu"
      >
        <Menu size={22} />
      </button>

      <form className="topbar-search" onSubmit={handleSubmit}>
        <Search className="topbar-search-icon" size={16} />
        <input
          ref={inputRef}
          className="topbar-search-input"
          type="text"
          placeholder="Search songs, artists, albums..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && setShowDropdown(true)}
          id="search-input"
        />

        {showDropdown && results && (
          <div className="search-dropdown" ref={dropdownRef}>
            {results.tracks?.length > 0 && (
              <div className="search-dropdown-section">
                <div className="search-dropdown-label">Tracks</div>
                {results.tracks.map((track) => (
                  <div
                    key={track.id}
                    className="search-dropdown-item"
                    onClick={() => handleTrackClick(track)}
                  >
                    <img src={track.image || track.album_image || DEFAULT_COVER} alt="" />
                    <div className="item-info">
                      <div className="item-name">
                        {track.name}
                        {track.source && (
                          <span className={`source-badge source-${track.source}`} style={{ fontSize: '0.6rem', padding: '1px 4px', marginLeft: '4px' }}>
                            {track.source === 'youtube' ? 'YT' : 'JMD'}
                          </span>
                        )}
                      </div>
                      <div className="item-type">{track.artist_name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {results.artists?.length > 0 && (
              <div className="search-dropdown-section">
                <div className="search-dropdown-label">Artists</div>
                {results.artists.map((artist) => (
                  <div
                    key={artist.id}
                    className="search-dropdown-item"
                    onClick={() => handleArtistClick(artist)}
                  >
                    <img
                      src={artist.image || DEFAULT_ARTIST_IMAGE}
                      alt=""
                      style={{ borderRadius: '50%' }}
                    />
                    <div className="item-info">
                      <div className="item-name">{artist.name}</div>
                      <div className="item-type">Artist</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {results.albums?.length > 0 && (
              <div className="search-dropdown-section">
                <div className="search-dropdown-label">Albums</div>
                {results.albums.map((album) => (
                  <div
                    key={album.id}
                    className="search-dropdown-item"
                    onClick={() => handleAlbumClick(album)}
                  >
                    <img src={album.image || DEFAULT_COVER} alt="" />
                    <div className="item-info">
                      <div className="item-name">{album.name}</div>
                      <div className="item-type">{album.artist_name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="search-view-all" onClick={handleSubmit}>
              View all results for "{query}"
            </button>
          </div>
        )}
      </form>

      <div className="topbar-actions">
        <button
          className="topbar-action-btn theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};

export default React.memo(TopBar);

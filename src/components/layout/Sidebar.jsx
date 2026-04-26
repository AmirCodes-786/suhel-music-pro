import React, { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Search, Library, ListMusic, Heart,
  Clock, Plus, Music2, Disc3, X
} from 'lucide-react';
import useUIStore from '../../store/uiStore';
import useLibraryStore from '../../store/libraryStore';
import PlaylistModal from '../common/PlaylistModal';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/library', icon: Library, label: 'Your Library' },
];

const libraryItems = [
  { to: '/queue', icon: ListMusic, label: 'Queue' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const sidebarMobileOpen = useUIStore((s) => s.sidebarMobileOpen);
  const closeMobileSidebar = useUIStore((s) => s.closeMobileSidebar);
  const playlists = useLibraryStore((s) => s.playlists);
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreatePlaylist = useCallback((name, description) => {
    const p = createPlaylist(name, description);
    navigate(`/playlist/${p.id}`);
    closeMobileSidebar();
  }, [createPlaylist, navigate, closeMobileSidebar]);

  const handleNavClick = useCallback(() => {
    closeMobileSidebar();
  }, [closeMobileSidebar]);

  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarMobileOpen ? 'visible' : ''}`}
        onClick={closeMobileSidebar}
      />
      <aside className={`sidebar ${sidebarMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Disc3 size={20} />
          </div>
          <span className="sidebar-logo-text">Suhel Tunes</span>
          <button className="sidebar-mobile-close" onClick={closeMobileSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={handleNavClick}
            >
              <item.icon className="icon" size={20} />
              <span className="label">{item.label}</span>
            </NavLink>
          ))}

          <div className="sidebar-divider" />

          <div className="sidebar-section-title">Library</div>
          {libraryItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={handleNavClick}
            >
              <item.icon className="icon" size={20} />
              <span className="label">{item.label}</span>
            </NavLink>
          ))}

          <div className="sidebar-divider" />

          <div className="sidebar-section-title">Playlists</div>
          <button className="create-playlist-btn" onClick={() => setIsModalOpen(true)}>
            <div className="plus-icon">
              <Plus size={16} />
            </div>
            <span className="label">Create Playlist</span>
          </button>

          <div className="sidebar-playlists">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className="sidebar-playlist-item"
                onClick={() => {
                  navigate(`/playlist/${pl.id}`);
                  handleNavClick();
                }}
              >
                <Music2 size={14} />
                <span className="truncate">{pl.name}</span>
              </div>
            ))}
          </div>
        </nav>
        
        <PlaylistModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onCreate={handleCreatePlaylist} 
        />
      </aside>
    </>
  );
};

export default React.memo(Sidebar);

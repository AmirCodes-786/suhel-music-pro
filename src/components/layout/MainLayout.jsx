import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PlayerBar from '../player/PlayerBar';
import FullPlayer from '../player/FullPlayer';
import useUIStore from '../../store/uiStore';
import useAudioPlayer from '../../hooks/useAudioPlayer';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import './MainLayout.css';

const MainLayout = () => {
  const { seek } = useAudioPlayer();
  const { sidebarOpen, sidebarMobileOpen, toggleMobileSidebar, closeMobileSidebar } = useUIStore();
  const toasts = useUIStore((s) => s.toasts);
  const fullPlayerOpen = useUIStore((s) => s.fullPlayerOpen);

  useKeyboardShortcuts(seek);

  return (
    <div className={`main-layout ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <AnimatePresence>
        {sidebarMobileOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileSidebar}
          />
        )}
      </AnimatePresence>

      <Sidebar />
      
      <div className="main-content">
        <TopBar onMenuClick={toggleMobileSidebar} />
        <main className="page-content custom-scrollbar">
          <Outlet />
        </main>
      </div>
      <PlayerBar seek={seek} />

      <AnimatePresence>
        {fullPlayerOpen && <FullPlayer seek={seek} />}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`toast ${toast.type}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainLayout;

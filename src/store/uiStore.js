import { create } from 'zustand';
import { storage } from '../utils/storage';

const useUIStore = create((set, get) => ({
  // Theme
  theme: storage.get('theme', 'dark'),

  // Sidebar
  sidebarOpen: true,
  sidebarMobileOpen: false,

  // Full Player
  fullPlayerOpen: false,

  // Toast notifications
  toasts: [],

  // Actions
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme: newTheme });
    storage.set('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  },

  setTheme: (theme) => {
    set({ theme });
    storage.set('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  },

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleMobileSidebar: () => set((s) => ({ sidebarMobileOpen: !s.sidebarMobileOpen })),
  closeMobileSidebar: () => set({ sidebarMobileOpen: false }),

  openFullPlayer: () => set({ fullPlayerOpen: true }),
  closeFullPlayer: () => set({ fullPlayerOpen: false }),
  toggleFullPlayer: () => set((s) => ({ fullPlayerOpen: !s.fullPlayerOpen })),

  // Toast
  addToast: (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
}));

export default useUIStore;

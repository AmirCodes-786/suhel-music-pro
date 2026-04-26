import { create } from 'zustand';
import { REPEAT_MODES } from '../utils/constants';
import { storage } from '../utils/storage';

const usePlayerStore = create((set, get) => ({
  // Current Track
  currentTrack: storage.get('currentTrack', null),
  isPlaying: false,
  isLoading: false,
  error: null,

  // Progress
  progress: 0,
  duration: 0,
  buffered: 0,

  // Volume
  volume: storage.get('volume', 0.7),
  isMuted: false,
  prevVolume: 0.7,

  // Queue
  queue: storage.get('queue', []),
  queueIndex: storage.get('queueIndex', 0),
  originalQueue: [],

  // Modes
  shuffle: storage.get('shuffle', false),
  repeat: storage.get('repeat', REPEAT_MODES.OFF),

  // Actions
  setCurrentTrack: (track) => {
    set({ currentTrack: track, error: null });
    storage.set('currentTrack', track);
  },

  playTrack: (track, trackList = null) => {
    const state = get();
    if (trackList && trackList.length > 0) {
      const index = trackList.findIndex((t) => t.id === track.id);
      const q = [...trackList];
      set({
        currentTrack: track,
        queue: q,
        originalQueue: q,
        queueIndex: index >= 0 ? index : 0,
        isPlaying: true,
        isLoading: true,
        error: null,
        progress: 0,
      });
      storage.set('currentTrack', track);
      storage.set('queue', q);
      storage.set('queueIndex', index >= 0 ? index : 0);
    } else {
      // Add to queue if not already there
      const existingIndex = state.queue.findIndex((t) => t.id === track.id);
      if (existingIndex >= 0) {
        set({
          currentTrack: track,
          queueIndex: existingIndex,
          isPlaying: true,
          isLoading: true,
          error: null,
          progress: 0,
        });
      } else {
        const newQueue = [...state.queue, track];
        set({
          currentTrack: track,
          queue: newQueue,
          originalQueue: [...state.originalQueue, track],
          queueIndex: newQueue.length - 1,
          isPlaying: true,
          isLoading: true,
          error: null,
          progress: 0,
        });
        storage.set('queue', newQueue);
      }
      storage.set('currentTrack', track);
    }
  },

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),

  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setBuffered: (buffered) => set({ buffered }),

  setVolume: (volume) => {
    set({ volume, isMuted: volume === 0 });
    storage.set('volume', volume);
  },

  toggleMute: () => {
    const { isMuted, volume, prevVolume } = get();
    if (isMuted) {
      set({ isMuted: false, volume: prevVolume || 0.7 });
      storage.set('volume', prevVolume || 0.7);
    } else {
      set({ isMuted: true, prevVolume: volume, volume: 0 });
      storage.set('volume', 0);
    }
  },

  // Queue Navigation
  next: () => {
    const { queue, queueIndex, repeat, shuffle } = get();
    if (queue.length === 0) return;

    let nextIndex;
    if (repeat === REPEAT_MODES.ONE) {
      nextIndex = queueIndex;
    } else if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeat === REPEAT_MODES.ALL) {
          nextIndex = 0;
        } else {
          set({ isPlaying: false });
          return;
        }
      }
    }

    const nextTrack = queue[nextIndex];
    if (nextTrack) {
      set({
        currentTrack: nextTrack,
        queueIndex: nextIndex,
        isPlaying: true,
        isLoading: true,
        progress: 0,
        error: null,
      });
      storage.set('currentTrack', nextTrack);
      storage.set('queueIndex', nextIndex);
    }
  },

  prev: () => {
    const { queue, queueIndex, progress } = get();
    if (queue.length === 0) return;

    // If > 3 seconds in, restart current track
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) prevIndex = queue.length - 1;

    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      set({
        currentTrack: prevTrack,
        queueIndex: prevIndex,
        isPlaying: true,
        isLoading: true,
        progress: 0,
        error: null,
      });
      storage.set('currentTrack', prevTrack);
      storage.set('queueIndex', prevIndex);
    }
  },

  // Queue Management
  addToQueue: (track) => {
    const queue = [...get().queue, track];
    set({ queue, originalQueue: [...get().originalQueue, track] });
    storage.set('queue', queue);
  },

  removeFromQueue: (index) => {
    const { queue, queueIndex } = get();
    const newQueue = queue.filter((_, i) => i !== index);
    let newIndex = queueIndex;
    if (index < queueIndex) newIndex--;
    if (index === queueIndex && newIndex >= newQueue.length) newIndex = newQueue.length - 1;
    set({ queue: newQueue, queueIndex: Math.max(0, newIndex) });
    storage.set('queue', newQueue);
    storage.set('queueIndex', Math.max(0, newIndex));
  },

  clearQueue: () => {
    set({ queue: [], originalQueue: [], queueIndex: 0 });
    storage.set('queue', []);
    storage.set('queueIndex', 0);
  },

  // Modes
  toggleShuffle: () => {
    const { shuffle, queue, originalQueue, currentTrack } = get();
    const newShuffle = !shuffle;
    if (newShuffle) {
      // Shuffle queue but keep current track at position
      const others = queue.filter((t) => t.id !== currentTrack?.id);
      for (let i = others.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [others[i], others[j]] = [others[j], others[i]];
      }
      const shuffled = currentTrack ? [currentTrack, ...others] : others;
      set({ shuffle: true, queue: shuffled, queueIndex: 0 });
      storage.set('queue', shuffled);
    } else {
      // Restore original order
      const idx = originalQueue.findIndex((t) => t.id === currentTrack?.id);
      set({ shuffle: false, queue: [...originalQueue], queueIndex: idx >= 0 ? idx : 0 });
      storage.set('queue', originalQueue);
    }
    storage.set('shuffle', newShuffle);
  },

  toggleRepeat: () => {
    const { repeat } = get();
    const modes = [REPEAT_MODES.OFF, REPEAT_MODES.ALL, REPEAT_MODES.ONE];
    const nextIndex = (modes.indexOf(repeat) + 1) % modes.length;
    const newRepeat = modes[nextIndex];
    set({ repeat: newRepeat });
    storage.set('repeat', newRepeat);
  },
}));

export default usePlayerStore;

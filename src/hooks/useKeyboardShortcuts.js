import { useEffect } from 'react';
import usePlayerStore from '../store/playerStore';
import useUIStore from '../store/uiStore';
import { KEYBOARD_SHORTCUTS } from '../utils/constants';

const useKeyboardShortcuts = (seekFn) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      const { togglePlay, next, prev, toggleMute, toggleShuffle, toggleRepeat, volume, setVolume } =
        usePlayerStore.getState();
      const { toggleFullPlayer, closeFullPlayer, fullPlayerOpen } = useUIStore.getState();

      switch (e.key) {
        case KEYBOARD_SHORTCUTS.TOGGLE_PLAY:
          e.preventDefault();
          togglePlay();
          break;
        case KEYBOARD_SHORTCUTS.NEXT:
          e.preventDefault();
          next();
          break;
        case KEYBOARD_SHORTCUTS.PREV:
          e.preventDefault();
          prev();
          break;
        case KEYBOARD_SHORTCUTS.MUTE:
          e.preventDefault();
          toggleMute();
          break;
        case KEYBOARD_SHORTCUTS.SHUFFLE:
          e.preventDefault();
          toggleShuffle();
          break;
        case KEYBOARD_SHORTCUTS.REPEAT:
          e.preventDefault();
          toggleRepeat();
          break;
        case KEYBOARD_SHORTCUTS.VOLUME_UP:
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.05));
          break;
        case KEYBOARD_SHORTCUTS.VOLUME_DOWN:
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.05));
          break;
        case KEYBOARD_SHORTCUTS.SEEK_FORWARD:
          e.preventDefault();
          if (seekFn) seekFn(usePlayerStore.getState().progress + 5);
          break;
        case KEYBOARD_SHORTCUTS.SEEK_BACKWARD:
          e.preventDefault();
          if (seekFn) seekFn(Math.max(0, usePlayerStore.getState().progress - 5));
          break;
        case KEYBOARD_SHORTCUTS.FULLSCREEN:
          e.preventDefault();
          toggleFullPlayer();
          break;
        case KEYBOARD_SHORTCUTS.ESCAPE:
          if (fullPlayerOpen) {
            e.preventDefault();
            closeFullPlayer();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [seekFn]);
};

export default useKeyboardShortcuts;

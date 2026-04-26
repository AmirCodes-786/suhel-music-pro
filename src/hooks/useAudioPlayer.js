import { useEffect, useRef, useCallback } from 'react';
import usePlayerStore from '../store/playerStore';
import useLibraryStore from '../store/libraryStore';

let audioInstance = null;
let audioContextInstance = null;
let analyserInstance = null;
let sourceNode = null;
let analyserFailed = false;

const getAudio = () => {
  if (!audioInstance) {
    audioInstance = new Audio();
    audioInstance.preload = 'auto';
    // Note: crossOrigin='anonymous' removed — Jamendo CDN doesn't send CORS headers.
    // Without it, audio plays fine but Web Audio API can't read frequency data.
    // The visualizer will use a placeholder animation instead.
  }
  return audioInstance;
};

export const getAnalyser = () => {
  // Jamendo's CDN does not provide CORS headers (Access-Control-Allow-Origin).
  // If we route the audio through an AudioContext (createMediaElementSource),
  // the browser's security model will mute the audio output entirely.
  // Therefore, we must disable the real-time visualizer for these tracks
  // and return null. The Visualizer component will fall back to a placeholder animation.
  return null;
};

const useAudioPlayer = () => {
  const rafRef = useRef(null);
  const prevTrackIdRef = useRef(null);

  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);

  const setProgress = usePlayerStore((s) => s.setProgress);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const setBuffered = usePlayerStore((s) => s.setBuffered);
  const setIsLoading = usePlayerStore((s) => s.setIsLoading);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
  const setError = usePlayerStore((s) => s.setError);
  const next = usePlayerStore((s) => s.next);

  const addToRecentlyPlayed = useLibraryStore((s) => s.addToRecentlyPlayed);

  const audio = getAudio();

  // Sync volume
  useEffect(() => {
    audio.volume = volume;
  }, [volume, audio]);

  // Load new track
  useEffect(() => {
    if (!currentTrack?.audio) return;

    if (prevTrackIdRef.current !== currentTrack.id) {
      prevTrackIdRef.current = currentTrack.id;
      audio.src = currentTrack.audio;
      audio.load();
      addToRecentlyPlayed(currentTrack);

      // Resume AudioContext if suspended (browser autoplay policy)
      if (audioContextInstance?.state === 'suspended') {
        audioContextInstance.resume();
      }
    }
  }, [currentTrack, audio, addToRecentlyPlayed]);

  // Sync play/pause
  useEffect(() => {
    if (!currentTrack?.audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Playback failed:', err);
            setError('Playback failed. Try again.');
            setIsPlaying(false);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack, audio, setError, setIsPlaying]);

  // Progress update loop
  useEffect(() => {
    const updateProgress = () => {
      if (audio && !isNaN(audio.duration)) {
        setProgress(audio.currentTime);
        if (audio.buffered.length > 0) {
          setBuffered(audio.buffered.end(audio.buffered.length - 1));
        }
      }
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    if (isPlaying) {
      rafRef.current = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, audio, setProgress, setBuffered]);

  // Event listeners
  useEffect(() => {
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      next();
    };

    const handleError = () => {
      setError('Failed to load track');
      setIsLoading(false);
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audio, setDuration, setIsLoading, setError, next]);

  // Seek
  const seek = useCallback(
    (time) => {
      audio.currentTime = time;
      setProgress(time);
    },
    [audio, setProgress]
  );

  return { audio, seek, getAnalyser };
};

export default useAudioPlayer;

export const APP_NAME = 'Suhel Tunes';
export const APP_DESCRIPTION = 'Premium Music Player powered by Jamendo';

export const JAMENDO_BASE_URL = 'https://api.jamendo.com/v3.0';

export const DEFAULT_COVER = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop&auto=format';
export const DEFAULT_ARTIST_IMAGE = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&auto=format';

export const AUDIO_FORMATS = {
  MP3_LOW: 'mp31',
  MP3_HIGH: 'mp32',
  OGG: 'ogg',
  FLAC: 'flac',
};

export const REPEAT_MODES = {
  OFF: 'off',
  ALL: 'all',
  ONE: 'one',
};

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  ARTIST: '/artist/:id',
  ALBUM: '/album/:id',
  PLAYLIST: '/playlist/:id',
  LIBRARY: '/library',
  QUEUE: '/queue',
};

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_PLAY: ' ',
  NEXT: 'n',
  PREV: 'p',
  MUTE: 'm',
  SHUFFLE: 's',
  REPEAT: 'r',
  VOLUME_UP: 'ArrowUp',
  VOLUME_DOWN: 'ArrowDown',
  SEEK_FORWARD: 'ArrowRight',
  SEEK_BACKWARD: 'ArrowLeft',
  FULLSCREEN: 'f',
  ESCAPE: 'Escape',
};

export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
export const SEARCH_DEBOUNCE_MS = 350;
export const DEFAULT_LIMIT = 20;
export const MAX_RECENT_TRACKS = 50;

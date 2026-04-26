import axios from 'axios';
import { JAMENDO_BASE_URL, DEFAULT_LIMIT, AUDIO_FORMATS } from '../utils/constants';
import { apiCache, withCache } from './cache';

const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID || '';

const jamendo = axios.create({
  baseURL: JAMENDO_BASE_URL,
  params: {
    client_id: CLIENT_ID,
    format: 'json',
  },
});

// Response interceptor — unwrap Jamendo's response shape
jamendo.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data && data.headers && data.headers.status === 'success') {
      return data.results;
    }
    if (data && data.headers && data.headers.status === 'error') {
      throw new Error(data.headers.error_message || 'Jamendo API error');
    }
    return data.results || data;
  },
  (error) => {
    console.error('[Jamendo API Error]', error?.message);
    throw error;
  }
);

/* ============= TRACKS ============= */

export const getTrendingTracks = (limit = DEFAULT_LIMIT) =>
  withCache(`trending_${limit}`, () =>
    jamendo.get('/tracks/', {
      params: {
        limit,
        order: 'popularity_total',
        include: 'musicinfo+stats',
        audioformat: AUDIO_FORMATS.MP3_HIGH,
        imagesize: 600,
      },
    })
  );

export const getNewTracks = (limit = DEFAULT_LIMIT) =>
  withCache(`new_${limit}`, () =>
    jamendo.get('/tracks/', {
      params: {
        limit,
        order: 'releasedate_desc',
        include: 'musicinfo+stats',
        audioformat: AUDIO_FORMATS.MP3_HIGH,
        imagesize: 600,
      },
    })
  );

export const searchTracks = (query, limit = DEFAULT_LIMIT) =>
  withCache(`search_tracks_${query}_${limit}`, () =>
    jamendo.get('/tracks/', {
      params: {
        search: query,
        limit,
        include: 'musicinfo+stats',
        audioformat: AUDIO_FORMATS.MP3_HIGH,
        imagesize: 600,
      },
    })
  );

export const getTrackById = (id) =>
  withCache(`track_${id}`, () =>
    jamendo.get('/tracks/', {
      params: {
        id,
        include: 'musicinfo+stats+lyrics',
        audioformat: AUDIO_FORMATS.MP3_HIGH,
        imagesize: 600,
      },
    })
  );

export const getTracksByIds = (ids) =>
  jamendo.get('/tracks/', {
    params: {
      id: ids.join('+'),
      include: 'musicinfo',
      audioformat: AUDIO_FORMATS.MP3_HIGH,
      imagesize: 600,
    },
  });

/* ============= ALBUMS ============= */

export const searchAlbums = (query, limit = DEFAULT_LIMIT) =>
  withCache(`search_albums_${query}_${limit}`, () =>
    jamendo.get('/albums/', {
      params: {
        search: query,
        limit,
        imagesize: 600,
      },
    })
  );

export const getAlbumById = (id) =>
  withCache(`album_${id}`, () =>
    jamendo.get('/albums/tracks/', {
      params: {
        id,
        imagesize: 600,
        audioformat: AUDIO_FORMATS.MP3_HIGH,
      },
    })
  );

export const getTrendingAlbums = (limit = DEFAULT_LIMIT) =>
  withCache(`trending_albums_${limit}`, () =>
    jamendo.get('/albums/', {
      params: {
        limit,
        order: 'popularity_total',
        imagesize: 600,
      },
    })
  );

/* ============= ARTISTS ============= */

export const searchArtists = (query, limit = DEFAULT_LIMIT) =>
  withCache(`search_artists_${query}_${limit}`, () =>
    jamendo.get('/artists/', {
      params: {
        search: query,
        limit,
        imagesize: 600,
      },
    })
  );

export const getArtistById = (id) =>
  withCache(`artist_${id}`, () =>
    jamendo.get('/artists/', {
      params: {
        id,
        imagesize: 600,
      },
    })
  );

export const getArtistTracks = (artistId, limit = DEFAULT_LIMIT) =>
  withCache(`artist_tracks_${artistId}`, () =>
    jamendo.get('/artists/tracks/', {
      params: {
        id: artistId,
        limit,
        audioformat: AUDIO_FORMATS.MP3_HIGH,
        imagesize: 600,
      },
    })
  );

export const getArtistAlbums = (artistId, limit = DEFAULT_LIMIT) =>
  withCache(`artist_albums_${artistId}`, () =>
    jamendo.get('/artists/albums/', {
      params: {
        id: artistId,
        limit,
        imagesize: 600,
      },
    })
  );

/* ============= AUTOCOMPLETE ============= */

export const autocomplete = (prefix, limit = 8) =>
  withCache(
    `autocomplete_${prefix}`,
    () =>
      jamendo.get('/autocomplete/', {
        params: { prefix, limit },
      }),
    60_000 // 1 min TTL for autocomplete
  );

/* ============= PLAYLISTS ============= */

export const getPlaylists = (limit = DEFAULT_LIMIT) =>
  withCache(`playlists_${limit}`, () =>
    jamendo.get('/playlists/', {
      params: {
        limit,
        order: 'creationdate_desc',
      },
    })
  );

export const getPlaylistTracks = (id) =>
  withCache(`playlist_tracks_${id}`, () =>
    jamendo.get('/playlists/tracks/', {
      params: {
        id,
        audioformat: AUDIO_FORMATS.MP3_HIGH,
        imagesize: 600,
      },
    })
  );

/* ============= GENRES / TAGS ============= */

export const getTracksByTag = (tag, limit = DEFAULT_LIMIT) =>
  withCache(`tag_${tag}_${limit}`, () =>
    jamendo.get('/tracks/', {
      params: {
        tags: tag,
        limit,
        order: 'popularity_total',
        include: 'musicinfo',
        audioformat: AUDIO_FORMATS.MP3_HIGH,
        imagesize: 600,
      },
    })
  );

export default jamendo;

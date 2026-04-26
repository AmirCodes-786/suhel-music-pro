import { CACHE_TTL } from '../utils/constants';

class APICache {
  constructor() {
    this.cache = new Map();
    // Clean expired entries every 60 seconds
    this.cleanupInterval = setInterval(() => this.cleanup(), 60_000);
  }

  generateKey(url, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&');
    return `${url}?${sortedParams}`;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key, data, ttl = CACHE_TTL) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

export const apiCache = new APICache();

export const withCache = async (key, fetchFn, ttl = CACHE_TTL) => {
  const cached = apiCache.get(key);
  if (cached) return cached;

  const data = await fetchFn();
  apiCache.set(key, data, ttl);
  return data;
};

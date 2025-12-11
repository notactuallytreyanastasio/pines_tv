/**
 * Local Cache Manager
 * Simple caching layer using localStorage with TTL support
 */

class LocalCache {
  constructor(options = {}) {
    this.prefix = options.prefix || 'archive_cache_';
    this.defaultTTL = options.defaultTTL || 3600000; // 1 hour in milliseconds
    this.storage = typeof window !== 'undefined' ? window.localStorage : null;
  }

  /**
   * Generate cache key
   * @param {string} key - Base key
   * @returns {string} Prefixed cache key
   */
  _getCacheKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * Check if cache is available
   * @returns {boolean}
   */
  isAvailable() {
    return this.storage !== null;
  }

  /**
   * Set item in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl = null) {
    if (!this.isAvailable()) {
      console.warn('LocalStorage not available');
      return;
    }

    const cacheKey = this._getCacheKey(key);
    const expiresAt = Date.now() + (ttl || this.defaultTTL);

    const cacheItem = {
      value,
      expiresAt,
      cachedAt: Date.now()
    };

    try {
      this.storage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Error setting cache:', error);
      // If quota exceeded, clear old entries
      if (error.name === 'QuotaExceededError') {
        this.clearExpired();
        try {
          this.storage.setItem(cacheKey, JSON.stringify(cacheItem));
        } catch (retryError) {
          console.error('Failed to cache after cleanup:', retryError);
        }
      }
    }
  }

  /**
   * Get item from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or null if not found/expired
   */
  get(key) {
    if (!this.isAvailable()) {
      return null;
    }

    const cacheKey = this._getCacheKey(key);
    
    try {
      const item = this.storage.getItem(cacheKey);
      if (!item) {
        return null;
      }

      const cacheItem = JSON.parse(item);
      
      // Check if expired
      if (Date.now() > cacheItem.expiresAt) {
        this.delete(key);
        return null;
      }

      return cacheItem.value;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  /**
   * Delete item from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    if (!this.isAvailable()) {
      return;
    }

    const cacheKey = this._getCacheKey(key);
    this.storage.removeItem(cacheKey);
  }

  /**
   * Clear all cache entries with this prefix
   */
  clear() {
    if (!this.isAvailable()) {
      return;
    }

    const keys = Object.keys(this.storage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        this.storage.removeItem(key);
      }
    });
  }

  /**
   * Clear only expired entries
   */
  clearExpired() {
    if (!this.isAvailable()) {
      return;
    }

    const keys = Object.keys(this.storage);
    const now = Date.now();

    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        try {
          const item = JSON.parse(this.storage.getItem(key));
          if (now > item.expiresAt) {
            this.storage.removeItem(key);
          }
        } catch (error) {
          // Invalid cache entry, remove it
          this.storage.removeItem(key);
        }
      }
    });
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    if (!this.isAvailable()) {
      return { available: false };
    }

    const keys = Object.keys(this.storage);
    const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
    
    let totalSize = 0;
    let expiredCount = 0;
    const now = Date.now();

    cacheKeys.forEach(key => {
      const item = this.storage.getItem(key);
      totalSize += item.length;
      
      try {
        const cacheItem = JSON.parse(item);
        if (now > cacheItem.expiresAt) {
          expiredCount++;
        }
      } catch (error) {
        expiredCount++;
      }
    });

    return {
      available: true,
      totalEntries: cacheKeys.length,
      expiredEntries: expiredCount,
      estimatedSize: totalSize,
      estimatedSizeKB: (totalSize / 1024).toFixed(2)
    };
  }
}

// ES module export for React/Vite
export default LocalCache;

// Also support CommonJS and browser globals for compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LocalCache;
}

if (typeof window !== 'undefined') {
  window.LocalCache = LocalCache;
}

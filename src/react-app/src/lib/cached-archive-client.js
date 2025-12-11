/**
 * Cached Archive Client
 * Wraps ArchiveClient with caching capabilities
 */

class CachedArchiveClient {
  constructor(archiveClient, cache) {
    this.client = archiveClient;
    this.cache = cache;
  }

  /**
   * Generate cache key for collection search
   */
  _getCollectionCacheKey(collectionId, options) {
    return `collection_${collectionId}_${JSON.stringify(options)}`;
  }

  /**
   * Generate cache key for item metadata
   */
  _getMetadataCacheKey(identifier) {
    return `metadata_${identifier}`;
  }

  /**
   * Search collection with caching
   */
  async searchCollection(collectionId, options = {}) {
    const cacheKey = this._getCollectionCacheKey(collectionId, options);
    
    // Try cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('Cache hit for collection search:', collectionId);
      return cached;
    }

    // Fetch from API
    console.log('Cache miss, fetching from API:', collectionId);
    const result = await this.client.searchCollection(collectionId, options);
    
    // Cache the result
    this.cache.set(cacheKey, result);
    
    return result;
  }

  /**
   * Get item metadata with caching
   */
  async getItemMetadata(identifier) {
    const cacheKey = this._getMetadataCacheKey(identifier);
    
    // Try cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('Cache hit for metadata:', identifier);
      return cached;
    }

    // Fetch from API
    console.log('Cache miss, fetching metadata:', identifier);
    const result = await this.client.getItemMetadata(identifier);
    
    // Cache the result
    this.cache.set(cacheKey, result);
    
    return result;
  }

  /**
   * Get all collection items with caching
   */
  async getAllCollectionItems(collectionId, options = {}) {
    const cacheKey = `all_items_${collectionId}_${JSON.stringify(options)}`;
    
    // Try cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('Cache hit for all items:', collectionId);
      return cached;
    }

    // Fetch from API
    console.log('Cache miss, fetching all items:', collectionId);
    const result = await this.client.getAllCollectionItems(collectionId, options);
    
    // Cache the result (longer TTL for complete collections)
    this.cache.set(cacheKey, result, 7200000); // 2 hours
    
    return result;
  }

  // Passthrough methods that don't need caching
  getDetailsUrl(identifier) {
    return this.client.getDetailsUrl(identifier);
  }

  getDownloadUrl(identifier, filename = null) {
    return this.client.getDownloadUrl(identifier, filename);
  }

  getThumbnailUrl(identifier) {
    return this.client.getThumbnailUrl(identifier);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    return this.cache.getStats();
  }
}

// ES module export for React/Vite
export default CachedArchiveClient;

// Also support CommonJS and browser globals for compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CachedArchiveClient;
}

if (typeof window !== 'undefined') {
  window.CachedArchiveClient = CachedArchiveClient;
}

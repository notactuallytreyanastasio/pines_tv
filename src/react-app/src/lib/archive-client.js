/**
 * Archive.org API Client
 * A standalone, framework-agnostic client for interacting with archive.org APIs
 */

const ARCHIVE_BASE_URL = 'https://archive.org';
const SEARCH_ENDPOINT = `${ARCHIVE_BASE_URL}/advancedsearch.php`;
const METADATA_ENDPOINT = `${ARCHIVE_BASE_URL}/metadata`;
const DETAILS_BASE_URL = `${ARCHIVE_BASE_URL}/details`;
const DOWNLOAD_BASE_URL = `${ARCHIVE_BASE_URL}/download`;

/**
 * Archive.org API Client
 */
class ArchiveClient {
  /**
   * Search for items in a collection
   * @param {string} collectionId - The collection identifier
   * @param {Object} options - Search options
   * @param {string[]} options.fields - Fields to return (default: identifier, title, description, mediatype)
   * @param {number} options.rows - Number of results per page (default: 50)
   * @param {number} options.page - Page number (default: 1)
   * @param {string} options.sort - Sort field and direction
   * @returns {Promise<Object>} Search results
   */
  async searchCollection(collectionId, options = {}) {
    const {
      fields = ['identifier', 'title', 'description', 'mediatype'],
      rows = 50,
      page = 1,
      sort = ''
    } = options;

    const params = new URLSearchParams({
      q: `collection:${collectionId}`,
      'fl[]': fields,
      rows: rows.toString(),
      page: page.toString(),
      output: 'json'
    });

    if (sort) {
      params.append('sort[]', sort);
    }

    const url = `${SEARCH_ENDPOINT}?${params.toString()}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Archive.org API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching collection:', error);
      throw error;
    }
  }

  /**
   * Get metadata for a specific item
   * @param {string} identifier - The item identifier
   * @returns {Promise<Object>} Item metadata
   */
  async getItemMetadata(identifier) {
    const url = `${METADATA_ENDPOINT}/${identifier}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Archive.org API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching metadata:', error);
      throw error;
    }
  }

  /**
   * Get the details page URL for an item
   * @param {string} identifier - The item identifier
   * @returns {string} Details page URL
   */
  getDetailsUrl(identifier) {
    return `${DETAILS_BASE_URL}/${identifier}`;
  }

  /**
   * Get the download URL for an item
   * @param {string} identifier - The item identifier
   * @param {string} filename - Optional specific file to download
   * @returns {string} Download URL
   */
  getDownloadUrl(identifier, filename = null) {
    if (filename) {
      return `${DOWNLOAD_BASE_URL}/${identifier}/${filename}`;
    }
    return `${DOWNLOAD_BASE_URL}/${identifier}`;
  }

  /**
   * Get thumbnail URL for an item
   * @param {string} identifier - The item identifier
   * @returns {string} Thumbnail URL
   */
  getThumbnailUrl(identifier) {
    return `${ARCHIVE_BASE_URL}/services/img/${identifier}`;
  }

  /**
   * Get all items from a collection (handles pagination)
   * @param {string} collectionId - The collection identifier
   * @param {Object} options - Search options
   * @returns {Promise<Array>} All items in the collection
   */
  async getAllCollectionItems(collectionId, options = {}) {
    const items = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const result = await this.searchCollection(collectionId, {
        ...options,
        page
      });

      items.push(...result.response.docs);

      const totalItems = result.response.numFound;
      const fetchedItems = page * (options.rows || 50);
      
      hasMore = fetchedItems < totalItems;
      page++;

      // Safety limit to prevent infinite loops
      if (page > 100) {
        console.warn('Reached pagination safety limit');
        break;
      }
    }

    return items;
  }
}

// ES module export for React/Vite
export default ArchiveClient;

// Also support CommonJS and browser globals for compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ArchiveClient;
}

if (typeof window !== 'undefined') {
  window.ArchiveClient = ArchiveClient;
}

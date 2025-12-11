/**
 * Vanilla JS Application
 * Media collection viewer using the standalone API client
 */

class MediaCollectionApp {
  constructor() {
    // Initialize API client with caching
    const archiveClient = new ArchiveClient();
    const cache = new LocalCache({ prefix: 'markpines_', defaultTTL: 3600000 });
    this.client = new CachedArchiveClient(archiveClient, cache);
    
    this.collectionId = 'markpines';
    this.allItems = [];
    this.filteredItems = [];
    
    this.initializeElements();
    this.attachEventListeners();
    this.loadCollection();
  }

  initializeElements() {
    this.elements = {
      loading: document.getElementById('loading'),
      error: document.getElementById('error'),
      grid: document.getElementById('grid'),
      searchInput: document.getElementById('search-input'),
      itemCount: document.getElementById('item-count'),
      refreshBtn: document.getElementById('refresh-btn'),
      clearCacheBtn: document.getElementById('clear-cache-btn'),
      cacheStats: document.getElementById('cache-stats')
    };
  }

  attachEventListeners() {
    this.elements.searchInput.addEventListener('input', (e) => {
      this.filterItems(e.target.value);
    });

    this.elements.refreshBtn.addEventListener('click', () => {
      this.refreshData();
    });

    this.elements.clearCacheBtn.addEventListener('click', () => {
      this.clearCache();
    });
  }

  async loadCollection() {
    try {
      this.showLoading();
      this.hideError();

      // Fetch all items from the collection
      const items = await this.client.getAllCollectionItems(this.collectionId, {
        fields: ['identifier', 'title', 'description', 'mediatype'],
        rows: 100
      });

      this.allItems = items;
      this.filteredItems = items;
      
      this.renderGrid();
      this.updateStats();
      this.updateCacheStats();
      this.hideLoading();
    } catch (error) {
      console.error('Error loading collection:', error);
      this.showError('Failed to load collection. Please try again.');
      this.hideLoading();
    }
  }

  filterItems(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredItems = this.allItems;
    } else {
      this.filteredItems = this.allItems.filter(item => {
        const title = (item.title || '').toLowerCase();
        const description = (item.description || '').toLowerCase();
        return title.includes(term) || description.includes(term);
      });
    }

    this.renderGrid();
    this.updateStats();
  }

  renderGrid() {
    const grid = this.elements.grid;
    grid.innerHTML = '';

    if (this.filteredItems.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <h2>No videos found</h2>
          <p>Try adjusting your search terms</p>
        </div>
      `;
      return;
    }

    this.filteredItems.forEach(item => {
      const card = this.createCard(item);
      grid.appendChild(card);
    });
  }

  createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';

    const thumbnailUrl = this.client.getThumbnailUrl(item.identifier);
    const detailsUrl = this.client.getDetailsUrl(item.identifier);
    const downloadUrl = this.client.getDownloadUrl(item.identifier);

    card.innerHTML = `
      <img 
        src="${thumbnailUrl}" 
        alt="${this.escapeHtml(item.title)}"
        class="card-image"
        onerror="this.style.display='none'"
      />
      <div class="card-content">
        <h3 class="card-title">${this.escapeHtml(item.title)}</h3>
        <p class="card-description">${this.escapeHtml(item.description || 'No description available')}</p>
        <div class="card-actions">
          <a href="${detailsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            View Video
          </a>
          <a href="${downloadUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            Download
          </a>
        </div>
      </div>
    `;

    return card;
  }

  updateStats() {
    const total = this.allItems.length;
    const filtered = this.filteredItems.length;
    
    if (filtered === total) {
      this.elements.itemCount.textContent = `${total} videos`;
    } else {
      this.elements.itemCount.textContent = `${filtered} of ${total} videos`;
    }
  }

  updateCacheStats() {
    const stats = this.client.getCacheStats();
    if (stats.available) {
      this.elements.cacheStats.textContent = 
        `Cache: ${stats.totalEntries} entries (${stats.estimatedSizeKB} KB)`;
    } else {
      this.elements.cacheStats.textContent = 'Cache: Not available';
    }
  }

  async refreshData() {
    this.client.clearCache();
    this.elements.searchInput.value = '';
    await this.loadCollection();
  }

  clearCache() {
    this.client.clearCache();
    this.updateCacheStats();
    alert('Cache cleared successfully!');
  }

  showLoading() {
    this.elements.loading.style.display = 'block';
    this.elements.grid.style.display = 'none';
  }

  hideLoading() {
    this.elements.loading.style.display = 'none';
    this.elements.grid.style.display = 'grid';
  }

  showError(message) {
    this.elements.error.textContent = message;
    this.elements.error.style.display = 'block';
  }

  hideError() {
    this.elements.error.style.display = 'none';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MediaCollectionApp();
  });
} else {
  new MediaCollectionApp();
}

import { useState, useEffect, useMemo } from 'react';
import ArchiveClient from './lib/archive-client.js';
import LocalCache from './cache/local-cache.js';
import CachedArchiveClient from './lib/cached-archive-client.js';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import VideoGrid from './components/VideoGrid';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

const archiveClient = new ArchiveClient();
const cache = new LocalCache({ prefix: 'markpines_react_', defaultTTL: 3600000 });
const client = new CachedArchiveClient(archiveClient, cache);

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cacheStats, setCacheStats] = useState(null);

  const collectionId = 'markpines';

  const loadCollection = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await client.getAllCollectionItems(collectionId, {
        fields: ['identifier', 'title', 'description', 'mediatype'],
        rows: 100
      });

      setItems(data);
      updateCacheStats();
    } catch (err) {
      console.error('Error loading collection:', err);
      setError('Failed to load collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateCacheStats = () => {
    const stats = client.getCacheStats();
    setCacheStats(stats);
  };

  const handleRefresh = () => {
    client.clearCache();
    setSearchTerm('');
    loadCollection();
  };

  const handleClearCache = () => {
    client.clearCache();
    updateCacheStats();
    alert('Cache cleared successfully!');
  };

  useEffect(() => {
    loadCollection();
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }

    const term = searchTerm.toLowerCase();
    return items.filter(item => {
      const title = (item.title || '').toLowerCase();
      const description = (item.description || '').toLowerCase();
      return title.includes(term) || description.includes(term);
    });
  }, [items, searchTerm]);

  return (
    <div className="app">
      <Header 
        onRefresh={handleRefresh}
        onClearCache={handleClearCache}
        cacheStats={cacheStats}
      />

      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalItems={items.length}
        filteredItems={filteredItems.length}
      />

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        <VideoGrid items={filteredItems} client={client} />
      )}
    </div>
  );
}

export default App;

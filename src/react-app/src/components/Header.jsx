import './Header.css';

function Header({ onRefresh, onClearCache, cacheStats }) {
  return (
    <header className="header">
      <h1>Mark Pines Archive</h1>
      <p className="subtitle">A collection of audio, video and related materials</p>
      <div className="header-actions">
        <button onClick={onRefresh} className="btn btn-secondary">
          Refresh Data
        </button>
        <button onClick={onClearCache} className="btn btn-secondary">
          Clear Cache
        </button>
        {cacheStats && cacheStats.available && (
          <div className="cache-stats">
            Cache: {cacheStats.totalEntries} entries ({cacheStats.estimatedSizeKB} KB)
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

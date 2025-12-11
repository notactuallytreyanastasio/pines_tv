import './SearchBar.css';

function SearchBar({ searchTerm, onSearchChange, totalItems, filteredItems }) {
  return (
    <div className="filters">
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search videos..."
        className="search-input"
      />
      <div className="stats">
        {filteredItems === totalItems
          ? `${totalItems} videos`
          : `${filteredItems} of ${totalItems} videos`}
      </div>
    </div>
  );
}

export default SearchBar;

# Mark Pines Archive Media Collection Viewer

A media collection viewer for the Mark Pines Archive on archive.org, demonstrating different architectural approaches and framework implementations.

## Project Structure

```
├── src/
│   ├── lib/                    # Standalone API client library
│   │   ├── archive-client.js   # Core Archive.org API client
│   │   └── cached-archive-client.js  # Cached wrapper
│   ├── cache/                  # Caching layer
│   │   └── local-cache.js      # LocalStorage-based cache
│   ├── vanilla-app/            # Vanilla JavaScript implementation
│   │   ├── index.html
│   │   ├── app.js
│   │   └── styles.css
│   └── react-app/              # React implementation
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── App.jsx
│       │   └── main.jsx
│       └── package.json
```

## Architecture Decisions

### Separated API Client vs Framework Integration

**Decision:** Standalone API client library

**Rationale:**
- **Reusability:** The API client can be used with any framework (React, Vue, Svelte, vanilla JS)
- **Testability:** Easy to test in isolation without framework dependencies
- **Maintainability:** Changes to the API client don't require changes to UI code
- **Separation of concerns:** Clear boundary between data fetching and presentation

### Caching Strategy

**Implementation:** LocalStorage-based cache with TTL

**Features:**
- Configurable TTL (Time To Live) per cache entry
- Automatic expiration handling
- Cache statistics and management
- Quota exceeded handling with automatic cleanup

## Implementations

### 1. Vanilla JavaScript

**Location:** `src/vanilla-app/`

**Features:**
- Pure JavaScript, no build tools required
- Class-based architecture
- Modern ES6+ features
- Responsive grid layout

**Running:**
```bash
cd src/vanilla-app
python3 -m http.server 8080
# Visit http://localhost:8080
```

### 2. React

**Location:** `src/react-app/`

**Features:**
- Modern React with hooks
- Component-based architecture
- Vite for fast development
- Optimized with useMemo for filtering

**Running:**
```bash
cd src/react-app
npm install
npm run dev
# Visit http://localhost:5173
```

## API Client Usage

### Basic Usage

```javascript
import ArchiveClient from './lib/archive-client.js';
import LocalCache from './cache/local-cache.js';
import CachedArchiveClient from './lib/cached-archive-client.js';

// Initialize
const archiveClient = new ArchiveClient();
const cache = new LocalCache({ prefix: 'my_app_', defaultTTL: 3600000 });
const client = new CachedArchiveClient(archiveClient, cache);

// Fetch collection items
const items = await client.getAllCollectionItems('markpines', {
  fields: ['identifier', 'title', 'description', 'mediatype'],
  rows: 100
});

// Get URLs
const detailsUrl = client.getDetailsUrl(item.identifier);
const downloadUrl = client.getDownloadUrl(item.identifier);
const thumbnailUrl = client.getThumbnailUrl(item.identifier);
```

## Features

- ✅ Fetch and display media collection from archive.org
- ✅ Local caching to minimize API calls
- ✅ Search/filter functionality
- ✅ Responsive grid layout
- ✅ View video on archive.org
- ✅ Download video links
- ✅ Thumbnail previews
- ✅ Cache management (clear, stats)
- ✅ Multiple framework implementations

## Next Steps

- [ ] Alternative UI designs on separate branches
- [ ] Additional framework implementations (Vue, Svelte)
- [ ] Enhanced filtering (by date, type, etc.)
- [ ] Pagination for large collections
- [ ] Video player integration

## Decision Graph

This project uses Deciduous for decision tracking. View the decision graph:

```bash
deciduous serve --port 3001
# Visit http://localhost:3001
```

## Collection Information

**Collection:** Mark Pines Archive  
**URL:** https://archive.org/details/markpines  
**Items:** 1,345+ videos and audio recordings  
**Description:** A collection of audio, video and related materials from the estate of Mark Pines, a musician, videographer, and writer.

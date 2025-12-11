import VideoCard from './VideoCard';
import './VideoGrid.css';

function VideoGrid({ items, client }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h2>No videos found</h2>
        <p>Try adjusting your search terms</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {items.map((item) => (
        <VideoCard key={item.identifier} item={item} client={client} />
      ))}
    </div>
  );
}

export default VideoGrid;

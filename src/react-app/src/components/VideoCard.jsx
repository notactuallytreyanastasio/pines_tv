import { useState } from 'react';
import './VideoCard.css';

function VideoCard({ item, client }) {
  const [imageError, setImageError] = useState(false);

  const thumbnailUrl = client.getThumbnailUrl(item.identifier);
  const detailsUrl = client.getDetailsUrl(item.identifier);
  const downloadUrl = client.getDownloadUrl(item.identifier);

  return (
    <div className="card">
      {!imageError && (
        <img
          src={thumbnailUrl}
          alt={item.title}
          className="card-image"
          onError={() => setImageError(true)}
        />
      )}
      <div className="card-content">
        <h3 className="card-title">{item.title}</h3>
        <p className="card-description">
          {item.description || 'No description available'}
        </p>
        <div className="card-actions">
          <a
            href={detailsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            View Video
          </a>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;

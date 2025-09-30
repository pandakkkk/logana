import React, { useEffect, useState } from 'react';
import { IndexInfo } from '../types/elasticsearch';
import { elasticsearchApi } from '../api/elasticsearchApi';
import { LoadingSpinner } from './LoadingSpinner';
import './IndexSelector.css';

interface IndexSelectorProps {
  onIndexSelect: (indexName: string) => void;
}

export const IndexSelector: React.FC<IndexSelectorProps> = ({ onIndexSelect }) => {
  const [indices, setIndices] = useState<IndexInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<string>('');

  useEffect(() => {
    fetchIndices();
  }, []);

  const fetchIndices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await elasticsearchApi.getIndices();
      setIndices(data);
    } catch (err) {
      setError('Failed to fetch indices from Elasticsearch');
      console.error('Error fetching indices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIndexChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const indexName = event.target.value;
    setSelectedIndex(indexName);
    onIndexSelect(indexName);
  };

  const formatSize = (size: string) => {
    return size === '' ? 'N/A' : size;
  };

  if (loading) {
    return <LoadingSpinner message="Loading indices..." />;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchIndices} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="index-selector">
      <div className="index-header">
        <h2>Elasticsearch Indices</h2>
        <button onClick={fetchIndices} className="refresh-button">
          Refresh
        </button>
      </div>

      {indices.length === 0 ? (
        <div className="no-indices">No indices found</div>
      ) : (
        <>
          <div className="select-container">
            <label htmlFor="index-select" className="index-label">
              Select Index:
            </label>
            <select
              id="index-select"
              value={selectedIndex}
              onChange={handleIndexChange}
              className="index-select"
            >
              <option value="">Choose an index</option>
              {indices.map((index) => (
                <option key={index.uuid} value={index.name}>
                  {index.name}
                </option>
              ))}
            </select>
          </div>

          {selectedIndex && (
            <div className="index-details">
              {indices
                .filter((index) => index.name === selectedIndex)
                .map((index) => (
                  <div key={index.uuid} className="index-info">
                    <div className="info-row">
                      <span className="info-label">Health:</span>
                      <span className={`health-status health-${index.health}`}>
                        {index.health}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Status:</span>
                      <span className="info-value">{index.status}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Documents:</span>
                      <span className="info-value">
                        {index.docs_count.toLocaleString()} 
                        {index.docs_deleted > 0 && ` (${index.docs_deleted} deleted)`}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Size:</span>
                      <span className="info-value">{formatSize(index.store_size)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Shards:</span>
                      <span className="info-value">
                        {index.pri} primary, {index.rep} replica
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}; 
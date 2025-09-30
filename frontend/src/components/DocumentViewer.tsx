import React, { useEffect, useState } from 'react';
import { ESDocument, SearchResponse } from '../types/elasticsearch';
import { elasticsearchApi } from '../api/elasticsearchApi';
import { LoadingSpinner } from './LoadingSpinner';
import './DocumentViewer.css';

interface DocumentViewerProps {
  indexName: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ indexName }) => {
  const [documents, setDocuments] = useState<ESDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 10;

  useEffect(() => {
    if (indexName) {
      fetchDocuments();
    } else {
      setDocuments([]);
      setTotalDocs(0);
    }
  }, [indexName, page]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = searchQuery
        ? await elasticsearchApi.searchDocuments(indexName, searchQuery, page, pageSize)
        : await elasticsearchApi.getDocuments(indexName, page, pageSize);
      
      setDocuments(response.hits.hits);
      setTotalDocs(response.hits.total.value);
    } catch (err) {
      setError('Failed to fetch documents');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    await fetchDocuments();
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  if (!indexName) {
    return <div className="no-index">Please select an index to view documents</div>;
  }

  if (loading) {
    return <LoadingSpinner message="Loading documents..." />;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchDocuments} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="document-viewer">
      <h2 className="index-title">Documents in {indexName}</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {documents.length === 0 ? (
        <div className="no-documents">No documents found in this index</div>
      ) : (
        <>
          <div className="documents-list">
            {documents.map((doc) => (
              <div key={doc._id} className="document-card">
                <div className="document-header">
                  <span className="document-id">ID: {doc._id}</span>
                  {doc._score && (
                    <span className="document-score">Score: {doc._score.toFixed(2)}</span>
                  )}
                </div>
                <pre className="document-content">
                  {JSON.stringify(doc._source, null, 2)}
                </pre>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="pagination-button"
            >
              Previous
            </button>
            <span className="page-info">
              Page {page} of {Math.ceil(totalDocs / pageSize)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page * pageSize >= totalDocs}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}; 
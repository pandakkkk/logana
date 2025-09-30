import axios from 'axios';
import { ESDocument, SearchResponse, IndexInfo } from '../types/elasticsearch';

const API_BASE_URL = 'http://localhost:8080/api/es';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const elasticsearchApi = {
  // Get list of all available indices
  async getIndices(): Promise<IndexInfo[]> {
    try {
      const response = await api.get<IndexInfo[]>('/indices');
      return response.data;
    } catch (error) {
      console.error('Error fetching indices:', error);
      throw new Error('Failed to fetch indices');
    }
  },

  // Get documents from a specific index with pagination
  async getDocuments(indexName: string, page: number = 1, size: number = 10): Promise<SearchResponse> {
    try {
      const response = await api.get<SearchResponse>(`/${indexName}/documents`, {
        params: {
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching documents from index ${indexName}:`, error);
      throw new Error(`Failed to fetch documents from index ${indexName}`);
    }
  },

  // Search documents in a specific index
  async searchDocuments(
    indexName: string,
    query: string,
    page: number = 1,
    size: number = 10
  ): Promise<SearchResponse> {
    try {
      const response = await api.post<SearchResponse>(`/${indexName}/search`, {
        query,
        page,
        size,
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching documents in index ${indexName}:`, error);
      throw new Error(`Failed to search documents in index ${indexName}`);
    }
  },

  // Get mapping for a specific index
  async getIndexMapping(indexName: string): Promise<any> {
    try {
      const response = await api.get(`/${indexName}/mapping`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching mapping for index ${indexName}:`, error);
      throw new Error(`Failed to fetch mapping for index ${indexName}`);
    }
  },

  // Get index stats
  async getIndexStats(indexName: string): Promise<any> {
    try {
      const response = await api.get(`/${indexName}/stats`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stats for index ${indexName}:`, error);
      throw new Error(`Failed to fetch stats for index ${indexName}`);
    }
  },

  // Check backend health
  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get('http://localhost:8080/health');
      return response.data.status === 'ok';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}; 
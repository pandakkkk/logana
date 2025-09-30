// Document types
export interface ESDocument {
  _id: string;
  _index: string;
  _score?: number;
  _source: Record<string, any>;
}

// Search response from backend
export interface SearchResponse {
  took: number;
  hits: {
    total: {
      value: number;
      relation: 'eq' | 'gte';
    };
    max_score: number | null;
    hits: ESDocument[];
  };
}

// Index information
export interface IndexInfo {
  name: string;
  health: string;
  status: string;
  uuid: string;
  pri: number;
  rep: number;
  docs_count: number;
  docs_deleted: number;
  store_size: string;
  pri_store_size: string;
}

// Index mapping
export interface IndexMapping {
  mappings: {
    properties: Record<string, {
      type: string;
      fields?: Record<string, {
        type: string;
      }>;
    }>;
  };
}

// Index stats
export interface IndexStats {
  primaries: {
    docs: {
      count: number;
      deleted: number;
    };
    store: {
      size_in_bytes: number;
    };
    indexing: {
      index_total: number;
      index_time_in_millis: number;
      index_current: number;
      delete_total: number;
      delete_time_in_millis: number;
      delete_current: number;
    };
    search: {
      query_total: number;
      query_time_in_millis: number;
      query_current: number;
    };
  };
  total: {
    docs: {
      count: number;
      deleted: number;
    };
    store: {
      size_in_bytes: number;
    };
  };
} 
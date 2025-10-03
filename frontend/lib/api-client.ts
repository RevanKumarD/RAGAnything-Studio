/**
 * API Client for RAG-Anything Studio Backend
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api/v1`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle errors globally
        if (error.response?.status === 401) {
          // Handle unauthorized
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Documents
  async uploadDocument(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
  }

  async parseDocument(
    filePath: string,
    parser?: string,
    parseMethod?: string
  ) {
    return this.client.post('/documents/parse', {
      file_path: filePath,
      parser,
      parse_method: parseMethod,
    });
  }

  async listDocuments() {
    return this.client.get('/documents/list');
  }

  async getDocument(documentId: string) {
    return this.client.get(`/documents/${documentId}`);
  }

  async deleteDocument(documentId: string) {
    return this.client.delete(`/documents/${documentId}`);
  }

  // Query
  async query(
    query: string,
    mode: string = 'hybrid',
    vlmEnhanced: boolean = false
  ) {
    return this.client.post('/query/', {
      query,
      mode,
      vlm_enhanced: vlmEnhanced,
    });
  }

  async multimodalQuery(
    query: string,
    mode: string = 'hybrid',
    multimodalContent: any[] = []
  ) {
    return this.client.post('/query/multimodal', {
      query,
      mode,
      multimodal_content: multimodalContent,
    });
  }

  async getQueryHistory(limit: number = 50, offset: number = 0) {
    return this.client.get('/query/history', {
      params: { limit, offset },
    });
  }

  // Knowledge Graph
  async getGraphData(filters?: {
    content_type?: string;
    document_id?: string;
    limit?: number;
  }) {
    return this.client.get('/graph/data', { params: filters });
  }

  async getEntity(entityId: string) {
    return this.client.get(`/graph/entity/${entityId}`);
  }

  async searchEntities(query: string, entityType?: string, limit?: number) {
    return this.client.get('/graph/search', {
      params: { query, entity_type: entityType, limit },
    });
  }

  async getSubgraph(centerNode: string, depth: number = 1) {
    return this.client.get('/graph/subgraph', {
      params: { center_node: centerNode, depth },
    });
  }

  async getGraphStats() {
    return this.client.get('/graph/stats');
  }

  // Vectors
  async getVectorProjection(
    method: string = 'umap',
    dimensions: number = 2,
    contentType?: string
  ) {
    return this.client.get('/vectors/projection', {
      params: { method, dimensions, content_type: contentType },
    });
  }

  async vectorSimilaritySearch(
    queryText?: string,
    vectorId?: string,
    topK: number = 10
  ) {
    return this.client.get('/vectors/search', {
      params: { query_text: queryText, vector_id: vectorId, top_k: topK },
    });
  }

  async getClusters(method: string = 'kmeans', nClusters?: number) {
    return this.client.get('/vectors/clusters', {
      params: { method, n_clusters: nClusters },
    });
  }

  async getVectorStats() {
    return this.client.get('/vectors/stats');
  }

  // Health Check
  async healthCheck() {
    return axios.get(`${API_URL}/health`);
  }
}

export const apiClient = new APIClient();
export default apiClient;

/**
 * TypeScript type definitions for RAG-Anything Studio
 */

// Document Types
export interface Document {
  id: string;
  filename: string;
  path: string;
  size: number;
  created: number;
  modified: number;
  status: 'uploaded' | 'parsing' | 'parsed' | 'failed';
  contentStats?: ContentStats;
}

export interface ContentStats {
  textBlocks: number;
  images: number;
  tables: number;
  equations: number;
  pages?: number;
}

export interface ParsedContent {
  type: 'text' | 'image' | 'table' | 'equation';
  content: any;
  pageIdx: number;
  metadata?: Record<string, any>;
}

// Query Types
export type QueryMode = 'naive' | 'local' | 'global' | 'hybrid';

export interface QueryRequest {
  query: string;
  mode: QueryMode;
  vlmEnhanced?: boolean;
  topK?: number;
}

export interface QueryResponse {
  query: string;
  mode: QueryMode;
  answer: string;
  sources: Source[];
  metadata: QueryMetadata;
  evidence?: Evidence[];
}

export interface Source {
  document: string;
  page?: number;
  chunk: string;
  score: number;
}

export interface QueryMetadata {
  responseTime: number;
  chunksRetrieved: number;
  model?: string;
}

export interface Evidence {
  type: 'image' | 'table' | 'equation';
  content: any;
  caption?: string;
  source: string;
  page?: number;
}

// Knowledge Graph Types
export interface GraphNode {
  id: string;
  label: string;
  type: 'text' | 'image' | 'table' | 'equation';
  description?: string;
  metadata?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  weight?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: {
    totalNodes: number;
    totalEdges: number;
    filtered: boolean;
  };
}

export interface Entity {
  id: string;
  name: string;
  type: string;
  description: string;
  metadata: Record<string, any>;
  connections: Connection[];
}

export interface Connection {
  id: string;
  targetId: string;
  targetName: string;
  type: string;
  label: string;
}

// Vector Space Types
export interface VectorProjection {
  method: 'umap' | 'tsne' | 'pca';
  dimensions: 2 | 3;
  points: VectorPoint[];
  metadata: {
    totalVectors: number;
    embeddingDim: number;
  };
}

export interface VectorPoint {
  id: string;
  coordinates: number[];
  type: string;
  label: string;
  clusterId?: number;
  metadata?: Record<string, any>;
}

export interface Cluster {
  id: number;
  label: string;
  size: number;
  centroid: number[];
  color: string;
}

// UI State Types
export interface UIState {
  sidebarOpen: boolean;
  contextPanelOpen: boolean;
  theme: 'light' | 'dark';
  activeModule: Module;
}

export type Module =
  | 'upload'
  | 'chat'
  | 'documents'
  | 'graph'
  | 'vectors'
  | 'batch'
  | 'analytics'
  | 'settings';

// Settings Types
export interface Settings {
  llm: LLMSettings;
  parser: ParserSettings;
  rag: RAGSettings;
  ui: UISettings;
}

export interface LLMSettings {
  apiKey: string;
  baseUrl?: string;
  llmModel: string;
  visionModel: string;
  embeddingModel: string;
}

export interface ParserSettings {
  defaultParser: 'mineru' | 'docling';
  defaultParseMethod: 'auto' | 'ocr' | 'txt';
  ocrLanguage: string;
  processingDevice: string;
  enableImageProcessing: boolean;
  enableTableProcessing: boolean;
  enableEquationProcessing: boolean;
}

export interface RAGSettings {
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  similarityThreshold: number;
  contextWindow: number;
  maxTokens: number;
  enableVLM: boolean;
}

export interface UISettings {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  fontSize: number;
  language: string;
}

// WebSocket Types
export interface WSMessage {
  type: 'parsing_progress' | 'query_stream' | 'error' | 'info';
  data: any;
}

export interface ParsingProgress {
  documentId: string;
  filename: string;
  progress: number;
  status: string;
  currentStep?: string;
  error?: string;
}

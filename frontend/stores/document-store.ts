import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Document } from '@/components/documents/DocumentCard';
import { apiClient } from '@/lib/api-client';

interface DocumentStore {
  // State
  documents: Document[];
  selectedDocument: Document | null;
  isLoading: boolean;
  error: string | null;

  // Filters
  searchQuery: string;
  statusFilter: 'all' | 'completed' | 'processing' | 'failed';

  // Actions
  loadDocuments: () => Promise<void>;
  setSelectedDocument: (doc: Document | null) => void;
  deleteDocument: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: 'all' | 'completed' | 'processing' | 'failed') => void;
  clearError: () => void;

  // Computed
  getFilteredDocuments: () => Document[];
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      // Initial state
      documents: [],
      selectedDocument: null,
      isLoading: false,
      error: null,
      searchQuery: '',
      statusFilter: 'all',

      // Load documents from API
      loadDocuments: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.listDocuments();
          const docs: Document[] = response.data.documents?.map((doc: any) => ({
            id: doc.id || doc.filename,
            filename: doc.filename,
            size: doc.size || 0,
            type: doc.type || doc.content_type || 'application/octet-stream',
            status: doc.status || 'completed',
            uploadedAt: doc.uploaded_at ? new Date(doc.uploaded_at) : new Date(),
            chunks: doc.chunks,
            entities: doc.entities,
          })) || [];

          set({ documents: docs, isLoading: false });
        } catch (error) {
          console.error('Failed to load documents:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to load documents',
            isLoading: false
          });
        }
      },

      // Set selected document
      setSelectedDocument: (doc) => {
        set({ selectedDocument: doc });
      },

      // Delete document
      deleteDocument: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.deleteDocument(id);
          set((state) => ({
            documents: state.documents.filter((d) => d.id !== id),
            selectedDocument: state.selectedDocument?.id === id ? null : state.selectedDocument,
            isLoading: false,
          }));
        } catch (error) {
          console.error('Failed to delete document:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to delete document',
            isLoading: false
          });
          throw error;
        }
      },

      // Set search query
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      // Set status filter
      setStatusFilter: (status) => {
        set({ statusFilter: status });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Get filtered documents
      getFilteredDocuments: () => {
        const { documents, searchQuery, statusFilter } = get();
        let filtered = [...documents];

        // Apply search filter
        if (searchQuery) {
          filtered = filtered.filter((doc) =>
            doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
          filtered = filtered.filter((doc) => doc.status === statusFilter);
        }

        return filtered;
      },
    }),
    {
      name: 'document-store',
      // Only persist non-sensitive data
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        statusFilter: state.statusFilter,
      }),
    }
  )
);

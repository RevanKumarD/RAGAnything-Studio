"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DocumentCard, Document } from "@/components/documents/DocumentCard";
import { DocumentDetailModal } from "@/components/documents/DocumentDetailModal";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Grid3x3, List, Loader2, FileX } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

export default function DocumentsPage() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchQuery, statusFilter]);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.listDocuments();
      // Transform API response to Document format
      const docs: Document[] = response.data.documents?.map((doc: any) => ({
        id: doc.id || doc.filename,
        filename: doc.filename,
        size: doc.size || 0,
        type: doc.type || doc.content_type || "application/octet-stream",
        status: doc.status || "completed",
        uploadedAt: doc.uploaded_at ? new Date(doc.uploaded_at) : new Date(),
        chunks: doc.chunks,
        entities: doc.entities,
      })) || [];

      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
      // Set sample documents for demo
      setDocuments([
        {
          id: "1",
          filename: "research_paper.pdf",
          size: 2457600,
          type: "application/pdf",
          status: "completed",
          uploadedAt: new Date(Date.now() - 86400000),
          chunks: 45,
          entities: 12,
        },
        {
          id: "2",
          filename: "technical_docs.docx",
          size: 1048576,
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          status: "completed",
          uploadedAt: new Date(Date.now() - 172800000),
          chunks: 78,
          entities: 23,
        },
        {
          id: "3",
          filename: "diagram.png",
          size: 524288,
          type: "image/png",
          status: "processing",
          uploadedAt: new Date(Date.now() - 3600000),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = [...documents];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((doc) =>
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((doc) => doc.status === statusFilter);
    }

    setFilteredDocs(filtered);
  };

  const handleView = (doc: Document) => {
    setSelectedDocument(doc);
  };

  const handleDownload = async (doc: Document) => {
    try {
      toast({
        title: "Download started",
        description: `Downloading ${doc.filename}...`,
      });
      // TODO: Implement actual download
      // await apiClient.downloadDocument(doc.id);
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (doc: Document) => {
    setDocumentToDelete(doc);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;

    try {
      await apiClient.deleteDocument(documentToDelete.id);
      setDocuments((prev) => prev.filter((d) => d.id !== documentToDelete.id));
      toast({
        title: "Document deleted",
        description: `${documentToDelete.filename} has been deleted.`,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setDocumentToDelete(null);
    }
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-muted-foreground">
              Manage your uploaded and processed documents
            </p>
          </div>
          <Button onClick={loadDocuments} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-1 border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Documents Grid/List */}
        {isLoading ? (
          <Card className="p-12 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          </Card>
        ) : filteredDocs.length === 0 ? (
          <Card className="p-12 flex items-center justify-center">
            <div className="text-center space-y-4">
              <FileX className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">No documents found</p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Upload your first document to get started"}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-4"
            }
          >
            {filteredDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onView={handleView}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Document Count */}
        {!isLoading && filteredDocs.length > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Showing {filteredDocs.length} of {documents.length} documents
          </p>
        )}
      </div>

      {/* Document Detail Modal */}
      <DocumentDetailModal
        document={selectedDocument}
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        onDownload={handleDownload}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!documentToDelete}
        onOpenChange={(open) => !open && setDocumentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{documentToDelete?.filename}"? This
              action cannot be undone and will remove all associated data including
              chunks and entities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}

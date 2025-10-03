"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { Document } from "./DocumentCard";

interface DocumentDetailModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (doc: Document) => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  isOpen,
  onClose,
  onDownload,
}) => {
  if (!document) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            {document.filename}
          </DialogTitle>
          <DialogDescription>
            Document details and metadata
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge>
              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
            </Badge>
          </div>

          <Separator />

          {/* File Information */}
          <div className="space-y-3">
            <h3 className="font-semibold">File Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">File Size</p>
                <p className="font-medium">{formatFileSize(document.size)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">File Type</p>
                <p className="font-medium">{document.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Uploaded</p>
                <p className="font-medium">
                  {new Date(document.uploadedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Document ID</p>
                <p className="font-medium font-mono text-xs">{document.id}</p>
              </div>
            </div>
          </div>

          {document.status === "completed" && (
            <>
              <Separator />

              {/* Processing Results */}
              <div className="space-y-3">
                <h3 className="font-semibold">Processing Results</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Text Chunks</p>
                    <p className="font-medium">{document.chunks || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Entities Extracted</p>
                    <p className="font-medium">{document.entities || 0}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => onDownload(document)}
              className="flex-1"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Original
            </Button>
            <Button className="flex-1" variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View in Graph
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

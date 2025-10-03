"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, MoreVertical, Eye, Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Document {
  id: string;
  filename: string;
  size: number;
  type: string;
  status: "processing" | "completed" | "failed";
  uploadedAt: Date;
  chunks?: number;
  entities?: number;
}

interface DocumentCardProps {
  document: Document;
  onView: (doc: Document) => void;
  onDownload: (doc: Document) => void;
  onDelete: (doc: Document) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onDownload,
  onDelete,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "processing":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "failed":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("word") || type.includes("docx")) return "📝";
    if (type.includes("image")) return "🖼️";
    if (type.includes("text")) return "📃";
    return "📄";
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* File Icon */}
          <div className="text-4xl flex-shrink-0">
            {getFileIcon(document.type)}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate text-sm group-hover:text-primary transition-colors">
              {document.filename}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {formatFileSize(document.size)} • {new Date(document.uploadedAt).toLocaleDateString()}
            </p>

            {/* Stats */}
            {document.status === "completed" && (
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                {document.chunks !== undefined && (
                  <span>{document.chunks} chunks</span>
                )}
                {document.entities !== undefined && (
                  <span>{document.entities} entities</span>
                )}
              </div>
            )}
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(document)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(document)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(document)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Badge className={cn("text-xs", getStatusColor(document.status))}>
          {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
        </Badge>
      </CardFooter>
    </Card>
  );
};

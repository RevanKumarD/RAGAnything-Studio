"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UploadFile {
  file: File;
  id: string;
}

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFilesSelected,
  maxFiles = 10,
  accept = {
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/msword": [".doc"],
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
    "text/*": [".txt", ".md"],
  },
}) => {
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substring(7),
      }));

      setSelectedFiles((prev) => {
        const combined = [...prev, ...newFiles];
        return combined.slice(0, maxFiles);
      });
    },
    [maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    multiple: true,
  });

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles.map((f) => f.file));
      setSelectedFiles([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
          "hover:border-primary hover:bg-muted/50",
          isDragActive && "border-primary bg-muted/50",
          isDragReject && "border-destructive bg-destructive/10"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop files here...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, DOCX, DOC, images (PNG, JPG), and text files
            </p>
            <p className="text-xs text-muted-foreground">
              Max {maxFiles} files at a time
            </p>
          </div>
        )}
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Selected Files ({selectedFiles.length})
            </p>
            <Button
              onClick={handleUpload}
              size="sm"
              disabled={selectedFiles.length === 0}
            >
              Upload {selectedFiles.length} {selectedFiles.length === 1 ? "File" : "Files"}
            </Button>
          </div>
          <div className="space-y-2 max-h-60 overflow-auto">
            {selectedFiles.map(({ file, id }) => (
              <div
                key={id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50"
              >
                <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(id)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

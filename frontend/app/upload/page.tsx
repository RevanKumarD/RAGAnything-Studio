"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { UploadZone } from "@/components/upload/UploadZone";
import { UploadProgress, UploadTask } from "@/components/upload/UploadProgress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { useWebSocket } from "@/lib/hooks/useWebSocket";
import { Settings2 } from "lucide-react";

export default function UploadPage() {
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [parser, setParser] = useState<string>("mineru");
  const [parseMethod, setParseMethod] = useState<string>("auto");

  // WebSocket for real-time progress updates
  const { isConnected } = useWebSocket({
    url: "ws://localhost:8000/api/v1/ws/upload-client",
    onMessage: (message) => {
      if (message.type === "parsing_progress") {
        updateTaskProgress(
          message.filename,
          message.status,
          message.progress,
          message.message
        );
      }
    },
    onConnect: () => {
      console.log("Connected to upload progress updates");
    },
  });

  const updateTaskProgress = (
    filename: string,
    status: string,
    progress: number,
    message?: string
  ) => {
    setUploadTasks((prev) =>
      prev.map((task) =>
        task.filename === filename
          ? {
              ...task,
              status: status as UploadTask["status"],
              progress,
              message,
            }
          : task
      )
    );
  };

  const handleFilesSelected = async (files: File[]) => {
    // Create tasks for all files
    const newTasks: UploadTask[] = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      filename: file.name,
      status: "pending",
      progress: 0,
    }));

    setUploadTasks((prev) => [...prev, ...newTasks]);

    // Upload and parse each file
    for (const file of files) {
      try {
        // Update to uploading
        setUploadTasks((prev) =>
          prev.map((task) =>
            task.filename === file.name
              ? { ...task, status: "uploading", progress: 0 }
              : task
          )
        );

        // Upload file
        const uploadResult = await apiClient.uploadDocument(file, (progress) => {
          setUploadTasks((prev) =>
            prev.map((task) =>
              task.filename === file.name
                ? { ...task, progress: Math.round(progress * 50) }
                : task
            )
          );
        });

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Upload failed");
        }

        // Update to parsing
        setUploadTasks((prev) =>
          prev.map((task) =>
            task.filename === file.name
              ? {
                  ...task,
                  status: "parsing",
                  progress: 50,
                  message: "Starting document parsing...",
                }
              : task
          )
        );

        // Parse document
        const parseResult = await apiClient.parseDocument(
          uploadResult.file_path,
          parser,
          parseMethod
        );

        if (parseResult.success) {
          setUploadTasks((prev) =>
            prev.map((task) =>
              task.filename === file.name
                ? {
                    ...task,
                    status: "completed",
                    progress: 100,
                    message: "Document parsed successfully",
                  }
                : task
            )
          );
        } else {
          throw new Error(parseResult.error || "Parsing failed");
        }
      } catch (error) {
        setUploadTasks((prev) =>
          prev.map((task) =>
            task.filename === file.name
              ? {
                  ...task,
                  status: "failed",
                  error: error instanceof Error ? error.message : "Unknown error",
                }
              : task
          )
        );
      }
    }
  };

  const clearCompletedTasks = () => {
    setUploadTasks((prev) =>
      prev.filter((task) => task.status !== "completed" && task.status !== "failed")
    );
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Upload Documents</h1>
          <p className="text-muted-foreground">
            Upload and parse documents with advanced OCR and layout analysis
          </p>
        </div>

        {/* WebSocket Connection Status */}
        {!isConnected && (
          <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Real-time progress updates unavailable. Reconnecting...
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>
                  Drag and drop files or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UploadZone onFilesSelected={handleFilesSelected} />
              </CardContent>
            </Card>

            {/* Upload Progress */}
            {uploadTasks.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Processing</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCompletedTasks}
                  >
                    Clear Completed
                  </Button>
                </div>
                <UploadProgress tasks={uploadTasks} />
              </div>
            )}
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  <CardTitle>Parse Settings</CardTitle>
                </div>
                <CardDescription>
                  Configure parsing options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parser">Parser</Label>
                  <Select value={parser} onValueChange={setParser}>
                    <SelectTrigger id="parser">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mineru">MinerU</SelectItem>
                      <SelectItem value="docling">Docling</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose the document parser engine
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parse-method">Parse Method</Label>
                  <Select value={parseMethod} onValueChange={setParseMethod}>
                    <SelectTrigger id="parse-method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="ocr">OCR</SelectItem>
                      <SelectItem value="txt">Text</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Auto detects the best method
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supported Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• PDF documents</li>
                  <li>• Word (DOCX, DOC)</li>
                  <li>• Images (PNG, JPG, GIF)</li>
                  <li>• Text files (TXT, MD)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

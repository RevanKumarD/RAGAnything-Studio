"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, Loader2, FileText } from "lucide-react";

export interface UploadTask {
  id: string;
  filename: string;
  status: "pending" | "uploading" | "parsing" | "completed" | "failed";
  progress: number;
  message?: string;
  error?: string;
}

interface UploadProgressProps {
  tasks: UploadTask[];
}

const statusIcons = {
  pending: Clock,
  uploading: Loader2,
  parsing: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
};

const statusColors = {
  pending: "text-muted-foreground",
  uploading: "text-blue-500",
  parsing: "text-purple-500",
  completed: "text-green-500",
  failed: "text-destructive",
};

const statusLabels = {
  pending: "Pending",
  uploading: "Uploading",
  parsing: "Parsing",
  completed: "Completed",
  failed: "Failed",
};

export const UploadProgress: React.FC<UploadProgressProps> = ({ tasks }) => {
  if (tasks.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => {
          const StatusIcon = statusIcons[task.status];
          const isAnimating = task.status === "uploading" || task.status === "parsing";

          return (
            <div key={task.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <StatusIcon
                  className={`h-5 w-5 flex-shrink-0 ${statusColors[task.status]} ${
                    isAnimating ? "animate-spin" : ""
                  }`}
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm font-medium truncate">{task.filename}</p>
                    </div>
                    <Badge
                      variant={
                        task.status === "completed"
                          ? "default"
                          : task.status === "failed"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {statusLabels[task.status]}
                    </Badge>
                  </div>
                  {task.status !== "pending" && task.status !== "failed" && (
                    <Progress value={task.progress} className="h-2" />
                  )}
                  {task.message && (
                    <p className="text-xs text-muted-foreground">{task.message}</p>
                  )}
                  {task.error && (
                    <p className="text-xs text-destructive">{task.error}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

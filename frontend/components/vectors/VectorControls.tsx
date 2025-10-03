"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Download, RefreshCw } from "lucide-react";

interface VectorControlsProps {
  method: string;
  onMethodChange: (method: string) => void;
  dimensions: 2 | 3;
  onDimensionsChange: (dimensions: 2 | 3) => void;
  colorBy: "cluster" | "type";
  onColorByChange: (colorBy: "cluster" | "type") => void;
  pointCount: number;
  clusterCount?: number;
  onRefresh?: () => void;
  onExport?: () => void;
  isLoading?: boolean;
}

export const VectorControls: React.FC<VectorControlsProps> = ({
  method,
  onMethodChange,
  dimensions,
  onDimensionsChange,
  colorBy,
  onColorByChange,
  pointCount,
  clusterCount,
  onRefresh,
  onExport,
  isLoading = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Projection Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Projection Method</CardTitle>
          <CardDescription>Dimensionality reduction algorithm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="method">Algorithm</Label>
            <Select value={method} onValueChange={onMethodChange} disabled={isLoading}>
              <SelectTrigger id="method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="umap">UMAP</SelectItem>
                <SelectItem value="tsne">t-SNE</SelectItem>
                <SelectItem value="pca">PCA</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>UMAP:</strong> Fast, preserves global structure</p>
              <p><strong>t-SNE:</strong> Great for clusters, slower</p>
              <p><strong>PCA:</strong> Linear, fast, interpretable</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensions</Label>
            <Select
              value={dimensions.toString()}
              onValueChange={(value) => onDimensionsChange(Number(value) as 2 | 3)}
              disabled={isLoading}
            >
              <SelectTrigger id="dimensions">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2D</SelectItem>
                <SelectItem value="3">3D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="color-by">Color By</Label>
            <Select value={colorBy} onValueChange={onColorByChange} disabled={isLoading}>
              <SelectTrigger id="color-by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cluster">Cluster</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Points</span>
            <Badge variant="secondary">{pointCount}</Badge>
          </div>
          {clusterCount !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Clusters</span>
              <Badge variant="secondary">{clusterCount}</Badge>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Method</span>
            <Badge variant="outline">{method.toUpperCase()}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Dimensions</span>
            <Badge variant="outline">{dimensions}D</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Projection
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onExport}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

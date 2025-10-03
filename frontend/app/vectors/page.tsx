"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { VectorPlot, VectorPoint } from "@/components/vectors/VectorPlot";
import { VectorControls } from "@/components/vectors/VectorControls";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function VectorsPage() {
  const [points, setPoints] = useState<VectorPoint[]>([]);
  const [method, setMethod] = useState<string>("umap");
  const [dimensions, setDimensions] = useState<2 | 3>(2);
  const [colorBy, setColorBy] = useState<"cluster" | "type">("cluster");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVectorData();
  }, [method, dimensions]);

  const loadVectorData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getVectorProjection(method, dimensions);

      if (response.data.points && Array.isArray(response.data.points)) {
        // Transform API response to VectorPoint format
        const transformedPoints: VectorPoint[] = response.data.points.map((p: any, idx: number) => ({
          id: p.id || `point-${idx}`,
          x: p.x || p[0] || 0,
          y: p.y || p[1] || 0,
          z: dimensions === 3 ? (p.z || p[2] || 0) : undefined,
          label: p.label || p.text || `Point ${idx}`,
          cluster: p.cluster ?? idx % 5,
          type: p.type || "chunk",
        }));

        setPoints(transformedPoints);
      } else {
        // If no data from API, generate sample data for demonstration
        const samplePoints: VectorPoint[] = Array.from({ length: 50 }, (_, i) => ({
          id: `sample-${i}`,
          x: Math.random() * 20 - 10,
          y: Math.random() * 20 - 10,
          z: dimensions === 3 ? Math.random() * 20 - 10 : undefined,
          label: `Sample Point ${i + 1}`,
          cluster: Math.floor(Math.random() * 5),
          type: ["chunk", "entity", "document"][Math.floor(Math.random() * 3)],
        }));
        setPoints(samplePoints);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vector data");
      // Still set sample data on error for demo
      const samplePoints: VectorPoint[] = Array.from({ length: 50 }, (_, i) => ({
        id: `sample-${i}`,
        x: Math.random() * 20 - 10,
        y: Math.random() * 20 - 10,
        z: dimensions === 3 ? Math.random() * 20 - 10 : undefined,
        label: `Sample Point ${i + 1}`,
        cluster: Math.floor(Math.random() * 5),
        type: ["chunk", "entity", "document"][Math.floor(Math.random() * 3)],
      }));
      setPoints(samplePoints);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePointClick = (point: VectorPoint) => {
    console.log("Point clicked:", point);
    // TODO: Show point details in modal or sidebar
  };

  const handleExport = () => {
    const exportData = {
      points,
      method,
      dimensions,
      colorBy,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vector-projection-${method}-${dimensions}d-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clusterCount = new Set(points.map((p) => p.cluster)).size;

  return (
    <AppLayout>
      <div className="flex h-full">
        {/* Main Vector Plot Area */}
        <div className="flex-1 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Vector Space Explorer</h1>
              <p className="text-muted-foreground">
                Visualize document embeddings in 2D/3D space
              </p>
            </div>
            <Button onClick={loadVectorData} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Refresh
            </Button>
          </div>

          {error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error} (Showing sample data for demonstration)
              </AlertDescription>
            </Alert>
          )}

          <div className="h-[calc(100vh-250px)]">
            {isLoading && points.length === 0 ? (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">
                    Computing {method.toUpperCase()} projection...
                  </p>
                </div>
              </Card>
            ) : (
              <VectorPlot
                points={points}
                dimensions={dimensions}
                colorBy={colorBy}
                onPointClick={handlePointClick}
              />
            )}
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="w-80 border-l bg-background p-6 overflow-auto">
          <VectorControls
            method={method}
            onMethodChange={setMethod}
            dimensions={dimensions}
            onDimensionsChange={setDimensions}
            colorBy={colorBy}
            onColorByChange={setColorBy}
            pointCount={points.length}
            clusterCount={clusterCount}
            onRefresh={loadVectorData}
            onExport={handleExport}
            isLoading={isLoading}
          />
        </div>
      </div>
    </AppLayout>
  );
}

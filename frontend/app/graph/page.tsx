"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GraphVisualization, GraphData } from "@/components/graph/GraphVisualization";
import { GraphControls } from "@/components/graph/GraphControls";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function GraphPage() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [layout, setLayout] = useState<string>("cose");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGraphData();
  }, []);

  const loadGraphData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getGraphData();

      if (response.data.nodes && response.data.edges) {
        setGraphData({
          nodes: response.data.nodes,
          edges: response.data.edges,
        });
      } else {
        throw new Error("Invalid graph data format");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load graph data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodeClick = (node: any) => {
    console.log("Node clicked:", node);
    // TODO: Show node details in modal or sidebar
  };

  const handleEdgeClick = (edge: any) => {
    console.log("Edge clicked:", edge);
    // TODO: Show edge details
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // TODO: Implement graph search and highlight
  };

  const handleExport = () => {
    const exportData = {
      graph: graphData,
      exportedAt: new Date().toISOString(),
      layout,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `knowledge-graph-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="flex h-full">
        {/* Main Graph Area */}
        <div className="flex-1 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Knowledge Graph</h1>
              <p className="text-muted-foreground">
                Explore entities and relationships from your documents
              </p>
            </div>
            <Button onClick={loadGraphData} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Refresh
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="h-[calc(100vh-250px)]">
            {isLoading ? (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">Loading knowledge graph...</p>
                </div>
              </Card>
            ) : (
              <GraphVisualization
                data={graphData}
                layout={layout as any}
                onNodeClick={handleNodeClick}
                onEdgeClick={handleEdgeClick}
              />
            )}
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="w-80 border-l bg-background p-6 overflow-auto">
          <GraphControls
            layout={layout}
            onLayoutChange={setLayout}
            nodeCount={graphData.nodes.length}
            edgeCount={graphData.edges.length}
            onSearch={handleSearch}
            onExport={handleExport}
          />
        </div>
      </div>
    </AppLayout>
  );
}

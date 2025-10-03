"use client";

import React, { useEffect, useRef, useState } from "react";
import cytoscape, { Core, NodeSingular, EdgeSingular } from "cytoscape";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, Maximize2, RefreshCw } from "lucide-react";

export interface GraphNode {
  data: {
    id: string;
    label: string;
    type?: string;
    description?: string;
  };
}

export interface GraphEdge {
  data: {
    id: string;
    source: string;
    target: string;
    label?: string;
    weight?: number;
  };
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface GraphVisualizationProps {
  data: GraphData;
  onNodeClick?: (node: any) => void;
  onEdgeClick?: (edge: any) => void;
  layout?: "cose" | "circle" | "grid" | "breadthfirst" | "concentric";
}

export const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  data,
  onNodeClick,
  onEdgeClick,
  layout = "cose",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current || !data.nodes.length) return;

    // Initialize Cytoscape
    const cy = cytoscape({
      container: containerRef.current,
      elements: {
        nodes: data.nodes,
        edges: data.edges,
      },
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#6366f1",
            label: "data(label)",
            color: "#fff",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "12px",
            "font-weight": 600 as any,
            width: "60px",
            height: "60px",
            "border-width": 3,
            "border-color": "#4f46e5",
            "overlay-padding": "6px",
          },
        },
        {
          selector: "node:selected",
          style: {
            "background-color": "#8b5cf6",
            "border-color": "#7c3aed",
            "border-width": 4,
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#94a3b8",
            "target-arrow-color": "#94a3b8",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": "10px",
            color: "#64748b",
            "text-rotation": "autorotate",
            "text-margin-y": -10,
          },
        },
        {
          selector: "edge:selected",
          style: {
            "line-color": "#6366f1",
            "target-arrow-color": "#6366f1",
            width: 4,
          },
        },
      ],
      layout: {
        name: layout,
        animate: true,
        animationDuration: 500,
        fit: true,
        padding: 50,
      },
      minZoom: 0.1,
      maxZoom: 3,
      wheelSensitivity: 0.2,
    });

    // Event handlers
    cy.on("tap", "node", (event) => {
      const node = event.target;
      setSelectedNode({
        id: node.data("id"),
        label: node.data("label"),
        type: node.data("type"),
        description: node.data("description"),
      });
      onNodeClick?.(node.data());
    });

    cy.on("tap", "edge", (event) => {
      const edge = event.target;
      onEdgeClick?.(edge.data());
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [data, layout]);

  const handleZoomIn = () => {
    cyRef.current?.zoom(cyRef.current.zoom() * 1.2);
    cyRef.current?.center();
  };

  const handleZoomOut = () => {
    cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
    cyRef.current?.center();
  };

  const handleFit = () => {
    cyRef.current?.fit(undefined, 50);
  };

  const handleReset = () => {
    if (cyRef.current) {
      cyRef.current.layout({ name: layout, animate: true }).run();
      cyRef.current.fit(undefined, 50);
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Graph Container */}
      <div
        ref={containerRef}
        className="h-full w-full bg-muted/30 rounded-lg border"
      />

      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="secondary" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleFit}>
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleReset}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected Node Info */}
      {selectedNode && (
        <Card className="absolute bottom-4 left-4 p-4 max-w-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{selectedNode.label}</h3>
              {selectedNode.type && (
                <Badge variant="secondary">{selectedNode.type}</Badge>
              )}
            </div>
            {selectedNode.description && (
              <p className="text-sm text-muted-foreground">
                {selectedNode.description}
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setSelectedNode(null)}
            >
              Close
            </Button>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {data.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">No graph data available</p>
            <p className="text-sm text-muted-foreground">
              Upload and parse documents to see the knowledge graph
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

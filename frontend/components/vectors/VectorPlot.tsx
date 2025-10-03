"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Dynamically import Plot to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
});

export interface VectorPoint {
  id: string;
  x: number;
  y: number;
  z?: number;
  label: string;
  cluster?: number;
  type?: string;
}

interface VectorPlotProps {
  points: VectorPoint[];
  dimensions: 2 | 3;
  colorBy?: "cluster" | "type";
  onPointClick?: (point: VectorPoint) => void;
}

export const VectorPlot: React.FC<VectorPlotProps> = ({
  points,
  dimensions,
  colorBy = "cluster",
  onPointClick,
}) => {
  const plotData = useMemo(() => {
    if (points.length === 0) return [];

    // Group points by cluster or type
    const groups = new Map<string | number, VectorPoint[]>();
    points.forEach((point) => {
      const key = colorBy === "cluster" ? (point.cluster ?? 0) : (point.type ?? "default");
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(point);
    });

    // Create traces for each group
    const traces = Array.from(groups.entries()).map(([key, groupPoints]) => {
      if (dimensions === 3) {
        return {
          type: "scatter3d" as const,
          mode: "markers" as const,
          name: `${colorBy === "cluster" ? "Cluster" : "Type"} ${key}`,
          x: groupPoints.map((p) => p.x),
          y: groupPoints.map((p) => p.y),
          z: groupPoints.map((p) => p.z ?? 0),
          text: groupPoints.map((p) => p.label),
          hoverinfo: "text",
          marker: {
            size: 8,
            opacity: 0.8,
            line: {
              width: 0.5,
              color: "white",
            },
          },
        };
      } else {
        return {
          type: "scatter" as const,
          mode: "markers" as const,
          name: `${colorBy === "cluster" ? "Cluster" : "Type"} ${key}`,
          x: groupPoints.map((p) => p.x),
          y: groupPoints.map((p) => p.y),
          text: groupPoints.map((p) => p.label),
          hoverinfo: "text",
          marker: {
            size: 10,
            opacity: 0.7,
            line: {
              width: 1,
              color: "white",
            },
          },
        };
      }
    });

    return traces;
  }, [points, dimensions, colorBy]);

  const layout = useMemo(
    () => ({
      autosize: true,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: {
        color: "hsl(var(--foreground))",
      },
      scene: dimensions === 3 ? {
        xaxis: {
          title: "Component 1",
          gridcolor: "hsl(var(--border))",
        },
        yaxis: {
          title: "Component 2",
          gridcolor: "hsl(var(--border))",
        },
        zaxis: {
          title: "Component 3",
          gridcolor: "hsl(var(--border))",
        },
      } : undefined,
      xaxis: dimensions === 2 ? {
        title: "Component 1",
        gridcolor: "hsl(var(--border))",
        zeroline: false,
      } : undefined,
      yaxis: dimensions === 2 ? {
        title: "Component 2",
        gridcolor: "hsl(var(--border))",
        zeroline: false,
      } : undefined,
      margin: { l: 50, r: 50, t: 50, b: 50 },
      legend: {
        orientation: "v" as const,
        x: 1.02,
        y: 1,
      },
      hovermode: "closest",
    }),
    [dimensions]
  );

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ["lasso2d", "select2d"],
  };

  if (points.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No vector data available</p>
          <p className="text-sm text-muted-foreground">
            Upload and parse documents to see vector embeddings
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="h-full w-full">
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: "100%", height: "100%" }}
        onClick={(data: any) => {
          if (data.points && data.points.length > 0) {
            const pointIndex = data.points[0].pointIndex;
            const traceIndex = data.points[0].curveNumber;
            // Find the actual point from our data
            const point = points[pointIndex];
            if (point) {
              onPointClick?.(point);
            }
          }
        }}
      />
    </div>
  );
};

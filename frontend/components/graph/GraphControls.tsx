"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download } from "lucide-react";

interface GraphControlsProps {
  layout: string;
  onLayoutChange: (layout: string) => void;
  nodeCount: number;
  edgeCount: number;
  onSearch?: (query: string) => void;
  onExport?: () => void;
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  layout,
  onLayoutChange,
  nodeCount,
  edgeCount,
  onSearch,
  onExport,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Search Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Search entities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="icon" variant="secondary">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Layout Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Layout</CardTitle>
          <CardDescription>Choose graph layout algorithm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="layout">Algorithm</Label>
            <Select value={layout} onValueChange={onLayoutChange}>
              <SelectTrigger id="layout">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cose">Force-Directed (COSE)</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="breadthfirst">Breadth First</SelectItem>
                <SelectItem value="concentric">Concentric</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Graph Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Nodes</span>
            <Badge variant="secondary">{nodeCount}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Edges</span>
            <Badge variant="secondary">{edgeCount}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Density</span>
            <Badge variant="outline">
              {nodeCount > 0
                ? ((edgeCount / (nodeCount * (nodeCount - 1))) * 100).toFixed(1)
                : 0}
              %
            </Badge>
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
            onClick={onExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Graph
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

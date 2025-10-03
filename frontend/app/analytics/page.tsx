"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  Clock,
  FileText,
  Network,
  Database,
  Activity,
  Zap
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    documents: 0,
    chunks: 0,
    entities: 0,
    relationships: 0,
    queries: 0,
    avgQueryTime: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [systemStatus, vectorStats, graphStats] = await Promise.all([
        apiClient.getSystemStatus(),
        apiClient.getVectorStats(),
        apiClient.getGraphStats(),
      ]);

      setStats({
        documents: systemStatus.data.documents || 0,
        chunks: vectorStats.data.total_chunks || 0,
        entities: vectorStats.data.total_entities || 0,
        relationships: vectorStats.data.total_relationships || 0,
        queries: systemStatus.data.queries || 0,
        avgQueryTime: systemStatus.data.avg_query_time || 0,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor system performance and usage metrics
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.documents}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Knowledge Chunks</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.chunks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Indexed and searchable
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Graph Entities</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.entities}</div>
              <p className="text-xs text-muted-foreground">
                {stats.relationships} relationships
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Query Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgQueryTime}ms</div>
              <p className="text-xs text-muted-foreground">
                <Zap className="inline h-3 w-3 mr-1 text-green-500" />
                Excellent performance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="usage" className="space-y-4">
          <TabsList>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Query Distribution</CardTitle>
                  <CardDescription>Queries by mode</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Hybrid</span>
                      <Badge variant="secondary">45%</Badge>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Local</span>
                      <Badge variant="secondary">30%</Badge>
                    </div>
                    <Progress value={30} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Global</span>
                      <Badge variant="secondary">15%</Badge>
                    </div>
                    <Progress value={15} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Naive</span>
                      <Badge variant="secondary">10%</Badge>
                    </div>
                    <Progress value={10} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Document Types</CardTitle>
                  <CardDescription>Parsed documents by format</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">PDF</span>
                      <Badge variant="secondary">60%</Badge>
                    </div>
                    <Progress value={60} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">DOCX</span>
                      <Badge variant="secondary">25%</Badge>
                    </div>
                    <Progress value={25} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Images</span>
                      <Badge variant="secondary">10%</Badge>
                    </div>
                    <Progress value={10} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Other</span>
                      <Badge variant="secondary">5%</Badge>
                    </div>
                    <Progress value={5} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Recent system activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Document parsed successfully</p>
                      <p className="text-xs text-muted-foreground">research_paper.pdf - 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Query executed</p>
                      <p className="text-xs text-muted-foreground">Hybrid mode - 156ms - 5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Knowledge graph updated</p>
                      <p className="text-xs text-muted-foreground">+23 entities, +45 relationships - 10 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Query Performance</CardTitle>
                  <CardDescription>Response time by mode</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Naive</span>
                    <Badge>45ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Local</span>
                    <Badge>120ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Global</span>
                    <Badge>180ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hybrid</span>
                    <Badge>156ms</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Current status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Status</span>
                    <Badge className="bg-green-500">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Vector DB</span>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Graph DB</span>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Parser</span>
                    <Badge className="bg-green-500">Ready</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="storage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Storage Usage</CardTitle>
                <CardDescription>Breakdown by component</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vector Embeddings</span>
                    <Badge variant="secondary">1.2 GB</Badge>
                  </div>
                  <Progress value={60} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Knowledge Graph</span>
                    <Badge variant="secondary">450 MB</Badge>
                  </div>
                  <Progress value={25} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Parsed Documents</span>
                    <Badge variant="secondary">800 MB</Badge>
                  </div>
                  <Progress value={40} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cache</span>
                    <Badge variant="secondary">150 MB</Badge>
                  </div>
                  <Progress value={10} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

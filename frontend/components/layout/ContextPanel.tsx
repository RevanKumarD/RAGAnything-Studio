"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, FileText, MessageSquare, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContextPanelProps {
  onClose: () => void;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({ onClose }) => {
  return (
    <aside className="w-80 border-l bg-background flex flex-col">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <h2 className="font-semibold">Context</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sources" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b px-4">
          <TabsTrigger value="sources" className="gap-2">
            <FileText className="h-4 w-4" />
            Sources
          </TabsTrigger>
          <TabsTrigger value="context" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Context
          </TabsTrigger>
          <TabsTrigger value="info" className="gap-2">
            <Info className="h-4 w-4" />
            Info
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="sources" className="p-4 space-y-3 m-0">
            <div className="text-sm text-muted-foreground">
              <p className="mb-3">Active document sources:</p>
              <div className="space-y-2">
                <div className="rounded-lg border p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">research_paper.pdf</p>
                      <p className="text-xs mt-1">45 chunks • 12 entities</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">technical_docs.docx</p>
                      <p className="text-xs mt-1">78 chunks • 23 entities</p>
                    </div>
                    <Badge variant="outline">Indexed</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="context" className="p-4 space-y-3 m-0">
            <div className="text-sm text-muted-foreground">
              <p className="mb-3">Active query context:</p>
              <div className="space-y-2">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground mb-1">Query Mode</p>
                  <p className="font-medium text-foreground">Hybrid (Local + Global)</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground mb-1">VLM Enhanced</p>
                  <p className="font-medium text-foreground">Enabled</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground mb-1">Last Query</p>
                  <p className="font-medium text-foreground text-xs">
                    "Explain the main findings of the research"
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="info" className="p-4 space-y-3 m-0">
            <div className="text-sm text-muted-foreground">
              <p className="mb-3">System information:</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Documents</span>
                  <span className="font-medium text-foreground">24</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Chunks</span>
                  <span className="font-medium text-foreground">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Entities</span>
                  <span className="font-medium text-foreground">456</span>
                </div>
                <div className="flex justify-between">
                  <span>Relationships</span>
                  <span className="font-medium text-foreground">789</span>
                </div>
                <div className="flex justify-between">
                  <span>Embedding Dim</span>
                  <span className="font-medium text-foreground">3072</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
};

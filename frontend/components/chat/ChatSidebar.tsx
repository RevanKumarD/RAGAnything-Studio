"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings2, Trash2, Download } from "lucide-react";

interface ChatSettings {
  mode: "naive" | "local" | "global" | "hybrid";
  vlmEnhanced: boolean;
  temperature?: number;
  topK?: number;
}

interface ChatSidebarProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
  onClearChat?: () => void;
  onExportChat?: () => void;
  messageCount: number;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  settings,
  onSettingsChange,
  onClearChat,
  onExportChat,
  messageCount,
}) => {
  return (
    <div className="w-80 border-l bg-background flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          <h2 className="font-semibold">Chat Settings</h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Query Mode */}
        <div className="space-y-2">
          <Label htmlFor="query-mode">Query Mode</Label>
          <Select
            value={settings.mode}
            onValueChange={(value) =>
              onSettingsChange({ ...settings, mode: value as ChatSettings["mode"] })
            }
          >
            <SelectTrigger id="query-mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="naive">Naive</SelectItem>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Naive:</strong> Direct text retrieval</p>
            <p><strong>Local:</strong> Entity-aware search</p>
            <p><strong>Global:</strong> Graph-based reasoning</p>
            <p><strong>Hybrid:</strong> Best of all modes</p>
          </div>
        </div>

        <Separator />

        {/* VLM Enhancement */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="vlm-enhanced">VLM Enhancement</Label>
            <Switch
              id="vlm-enhanced"
              checked={settings.vlmEnhanced}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...settings, vlmEnhanced: checked })
              }
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Use vision-language models to understand images and diagrams in documents
          </p>
        </div>

        <Separator />

        {/* Advanced Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Advanced</h3>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="text-xs text-muted-foreground">
                {settings.temperature?.toFixed(2) || "0.70"}
              </span>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[settings.temperature || 0.7]}
              onValueChange={([value]) =>
                onSettingsChange({ ...settings, temperature: value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Higher values make output more creative
            </p>
          </div>

          {/* Top K */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="top-k">Top K Results</Label>
              <span className="text-xs text-muted-foreground">
                {settings.topK || 5}
              </span>
            </div>
            <Slider
              id="top-k"
              min={1}
              max={20}
              step={1}
              value={[settings.topK || 5]}
              onValueChange={([value]) =>
                onSettingsChange({ ...settings, topK: value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Number of relevant chunks to retrieve
            </p>
          </div>
        </div>

        <Separator />

        {/* Chat Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Session Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Messages</span>
              <Badge variant="secondary">{messageCount}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mode</span>
              <Badge variant="outline">{settings.mode}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VLM</span>
              <Badge variant={settings.vlmEnhanced ? "default" : "secondary"}>
                {settings.vlmEnhanced ? "On" : "Off"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onExportChat}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Chat
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={onClearChat}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Chat
        </Button>
      </div>
    </div>
  );
};

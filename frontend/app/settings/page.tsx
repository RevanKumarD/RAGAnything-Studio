"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings2, Save, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    // RAG Settings
    parser: "mineru",
    parseMethod: "auto",
    enableImageProcessing: true,
    enableTableProcessing: true,
    enableEquationProcessing: true,

    // LLM Settings
    llmModel: "gpt-4o",
    visionModel: "gpt-4o",
    embeddingModel: "text-embedding-3-large",
    temperature: 0.7,
    maxTokens: 4096,

    // API Settings
    openaiApiKey: "sk-...",
    openaiBaseUrl: "https://api.openai.com/v1",

    // Vector Settings
    embeddingDim: 3072,
    chunkSize: 512,
    chunkOverlap: 50,

    // Graph Settings
    enableGraphExtraction: true,
    maxGraphDepth: 3,
  });

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Configure RAG-Anything and system preferences
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="rag" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rag">RAG Settings</TabsTrigger>
            <TabsTrigger value="llm">LLM Models</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="rag" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Parser</CardTitle>
                <CardDescription>
                  Configure document parsing engine and methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="parser">Parser Engine</Label>
                    <Select
                      value={settings.parser}
                      onValueChange={(value) => setSettings({ ...settings, parser: value })}
                    >
                      <SelectTrigger id="parser">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mineru">MinerU</SelectItem>
                        <SelectItem value="docling">Docling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parse-method">Parse Method</Label>
                    <Select
                      value={settings.parseMethod}
                      onValueChange={(value) => setSettings({ ...settings, parseMethod: value })}
                    >
                      <SelectTrigger id="parse-method">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="ocr">OCR</SelectItem>
                        <SelectItem value="txt">Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-image">Image Processing</Label>
                      <p className="text-sm text-muted-foreground">
                        Extract and analyze images from documents
                      </p>
                    </div>
                    <Switch
                      id="enable-image"
                      checked={settings.enableImageProcessing}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, enableImageProcessing: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-table">Table Processing</Label>
                      <p className="text-sm text-muted-foreground">
                        Extract structured data from tables
                      </p>
                    </div>
                    <Switch
                      id="enable-table"
                      checked={settings.enableTableProcessing}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, enableTableProcessing: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-equation">Equation Processing</Label>
                      <p className="text-sm text-muted-foreground">
                        Parse mathematical equations and formulas
                      </p>
                    </div>
                    <Switch
                      id="enable-equation"
                      checked={settings.enableEquationProcessing}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, enableEquationProcessing: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="llm" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Language Models</CardTitle>
                <CardDescription>
                  Configure AI models for different tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="llm-model">LLM Model</Label>
                  <Select
                    value={settings.llmModel}
                    onValueChange={(value) => setSettings({ ...settings, llmModel: value })}
                  >
                    <SelectTrigger id="llm-model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">GPT-4O</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Used for text generation and query answering
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vision-model">Vision Model</Label>
                  <Select
                    value={settings.visionModel}
                    onValueChange={(value) => setSettings({ ...settings, visionModel: value })}
                  >
                    <SelectTrigger id="vision-model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">GPT-4O</SelectItem>
                      <SelectItem value="gpt-4-vision">GPT-4 Vision</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Used for image and diagram understanding
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="embedding-model">Embedding Model</Label>
                  <Select
                    value={settings.embeddingModel}
                    onValueChange={(value) => setSettings({ ...settings, embeddingModel: value })}
                  >
                    <SelectTrigger id="embedding-model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-embedding-3-large">text-embedding-3-large</SelectItem>
                      <SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem>
                      <SelectItem value="text-embedding-ada-002">text-embedding-ada-002</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Used for vector embeddings and similarity search
                  </p>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={settings.temperature}
                      onChange={(e) =>
                        setSettings({ ...settings, temperature: parseFloat(e.target.value) })
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Controls randomness (0-2)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-tokens">Max Tokens</Label>
                    <Input
                      id="max-tokens"
                      type="number"
                      value={settings.maxTokens}
                      onChange={(e) =>
                        setSettings({ ...settings, maxTokens: parseInt(e.target.value) })
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Maximum response length
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                API keys are stored locally and never sent to external servers except for API calls.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>OpenAI Configuration</CardTitle>
                <CardDescription>
                  Configure OpenAI API access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={settings.openaiApiKey}
                    onChange={(e) =>
                      setSettings({ ...settings, openaiApiKey: e.target.value })
                    }
                    placeholder="sk-..."
                  />
                  <p className="text-sm text-muted-foreground">
                    Your OpenAI API key for model access
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="base-url">Base URL</Label>
                  <Input
                    id="base-url"
                    value={settings.openaiBaseUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, openaiBaseUrl: e.target.value })
                    }
                    placeholder="https://api.openai.com/v1"
                  />
                  <p className="text-sm text-muted-foreground">
                    Use custom endpoint for OpenAI-compatible APIs
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vector Database</CardTitle>
                <CardDescription>
                  Configure vector embedding settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="embedding-dim">Embedding Dimension</Label>
                    <Input
                      id="embedding-dim"
                      type="number"
                      value={settings.embeddingDim}
                      onChange={(e) =>
                        setSettings({ ...settings, embeddingDim: parseInt(e.target.value) })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chunk-size">Chunk Size</Label>
                    <Input
                      id="chunk-size"
                      type="number"
                      value={settings.chunkSize}
                      onChange={(e) =>
                        setSettings({ ...settings, chunkSize: parseInt(e.target.value) })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chunk-overlap">Chunk Overlap</Label>
                    <Input
                      id="chunk-overlap"
                      type="number"
                      value={settings.chunkOverlap}
                      onChange={(e) =>
                        setSettings({ ...settings, chunkOverlap: parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Knowledge Graph</CardTitle>
                <CardDescription>
                  Configure graph extraction settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-graph">Enable Graph Extraction</Label>
                    <p className="text-sm text-muted-foreground">
                      Extract entities and relationships from documents
                    </p>
                  </div>
                  <Switch
                    id="enable-graph"
                    checked={settings.enableGraphExtraction}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, enableGraphExtraction: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graph-depth">Max Graph Depth</Label>
                  <Input
                    id="graph-depth"
                    type="number"
                    value={settings.maxGraphDepth}
                    onChange={(e) =>
                      setSettings({ ...settings, maxGraphDepth: parseInt(e.target.value) })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum relationship depth for graph traversal
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

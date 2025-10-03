"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatMessage, Message, Source } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Sparkles } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface ChatSettings {
  mode: "naive" | "local" | "global" | "hybrid";
  vlmEnhanced: boolean;
  temperature?: number;
  topK?: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    mode: "hybrid",
    vlmEnhanced: false,
    temperature: 0.7,
    topK: 5,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string, images?: File[]) => {
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      images: images?.map((img) => URL.createObjectURL(img)),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let result;

      // Check if multimodal query (with images)
      if (images && images.length > 0) {
        // Convert images to base64
        const imagePromises = images.map((img) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(img);
          });
        });

        const imageDataUrls = await Promise.all(imagePromises);
        const multimodalContent = imageDataUrls.map((dataUrl, idx) => ({
          type: "image_url",
          image_url: { url: dataUrl },
        }));

        result = await apiClient.multimodalQuery(
          content,
          settings.mode,
          multimodalContent
        );
      } else {
        // Regular query
        result = await apiClient.query(content, settings.mode, settings.vlmEnhanced);
      }

      if (result.data.success) {
        // Create assistant message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.data.answer || "I couldn't generate a response.",
          sources: result.data.sources?.map((source: any, idx: number) => ({
            id: `source-${idx}`,
            filename: source.filename || source.document_name || "Unknown",
            chunk_id: source.chunk_id,
            relevance_score: source.score || source.relevance_score,
            content: source.content || source.text,
          })),
          timestamp: new Date(),
          mode: settings.mode,
          vlm_enhanced: settings.vlmEnhanced,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(result.data.error || "Query failed");
      }
    } catch (error) {
      // Error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I encountered an error: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSourceClick = (source: Source) => {
    // Open source in documents page or modal
    console.log("Source clicked:", source);
    // TODO: Navigate to document viewer with highlight
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      setMessages([]);
    }
  };

  const handleExportChat = () => {
    // Export chat as JSON
    const chatData = {
      messages,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="flex h-full">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          {/* Messages Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-auto"
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center space-y-6 max-w-2xl">
                  <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">
                      Welcome to RAG-Anything Chat
                    </h2>
                    <p className="text-muted-foreground">
                      Ask questions about your documents and get AI-powered answers with
                      source citations
                    </p>
                  </div>

                  {/* Example Questions */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Try asking:</p>
                    <div className="grid gap-2">
                      <Button
                        variant="outline"
                        className="justify-start text-left h-auto py-3"
                        onClick={() =>
                          handleSendMessage("What are the main findings in the research paper?")
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">
                          What are the main findings in the research paper?
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start text-left h-auto py-3"
                        onClick={() =>
                          handleSendMessage("Summarize the key points from the documents")
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">
                          Summarize the key points from the documents
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start text-left h-auto py-3"
                        onClick={() =>
                          handleSendMessage("Explain the diagram on page 5")
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">
                          Explain the diagram on page 5
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onSourceClick={handleSourceClick}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t bg-background">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Settings Sidebar */}
        <ChatSidebar
          settings={settings}
          onSettingsChange={setSettings}
          onClearChat={handleClearChat}
          onExportChat={handleExportChat}
          messageCount={messages.length}
        />
      </div>
    </AppLayout>
  );
}

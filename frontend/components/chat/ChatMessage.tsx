"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Bot, FileText, ExternalLink, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

export interface Source {
  id: string;
  filename: string;
  chunk_id?: string;
  relevance_score?: number;
  content?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  images?: string[];
  timestamp: Date;
  mode?: string;
  vlm_enhanced?: boolean;
}

interface ChatMessageProps {
  message: Message;
  onSourceClick?: (source: Source) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSourceClick }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 p-6 transition-colors",
        isUser ? "bg-background" : "bg-muted/30"
      )}
    >
      {/* Avatar */}
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarFallback className={isUser ? "bg-primary" : "bg-purple-500"}>
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 space-y-3 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold">{isUser ? "You" : "Assistant"}</span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString()}
          </span>
          {message.mode && (
            <Badge variant="outline" className="text-xs">
              {message.mode}
            </Badge>
          )}
          {message.vlm_enhanced && (
            <Badge variant="secondary" className="text-xs">
              VLM Enhanced
            </Badge>
          )}
        </div>

        {/* User Images */}
        {isUser && message.images && message.images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {message.images.map((img, idx) => (
              <div
                key={idx}
                className="relative w-20 h-20 rounded-lg border overflow-hidden bg-muted"
              >
                <img
                  src={img}
                  alt={`Uploaded ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Message Content */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Sources:</p>
            <div className="grid grid-cols-1 gap-2">
              {message.sources.map((source) => (
                <Card
                  key={source.id}
                  className="p-3 hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onSourceClick?.(source)}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 justify-between">
                        <p className="text-sm font-medium truncate">{source.filename}</p>
                        {source.relevance_score && (
                          <Badge variant="secondary" className="text-xs">
                            {(source.relevance_score * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                      {source.content && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {source.content}
                        </p>
                      )}
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

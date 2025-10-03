"use client";

import { AppLayout } from "@/components/layout/AppLayout";

export default function ChatPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">AI Chat</h1>
        <p className="text-muted-foreground">
          Chat interface with multimodal queries and citations will be implemented here.
        </p>
      </div>
    </AppLayout>
  );
}

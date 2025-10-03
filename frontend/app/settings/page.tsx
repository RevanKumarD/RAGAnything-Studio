"use client";

import { AppLayout } from "@/components/layout/AppLayout";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <p className="text-muted-foreground">
          Settings panel for configuring RAG-Anything will be implemented here.
        </p>
      </div>
    </AppLayout>
  );
}

"use client";

import { AppLayout } from "@/components/layout/AppLayout";

export default function GraphPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Knowledge Graph</h1>
        <p className="text-muted-foreground">
          3D interactive knowledge graph visualization will be implemented here.
        </p>
      </div>
    </AppLayout>
  );
}

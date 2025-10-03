"use client";

import { AppLayout } from "@/components/layout/AppLayout";

export default function VectorsPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Vector Space</h1>
        <p className="text-muted-foreground">
          Vector embeddings visualization with UMAP, t-SNE, and clustering will be implemented here.
        </p>
      </div>
    </AppLayout>
  );
}

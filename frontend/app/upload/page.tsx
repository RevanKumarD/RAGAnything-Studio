"use client";

import { AppLayout } from "@/components/layout/AppLayout";

export default function UploadPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Upload Documents</h1>
        <p className="text-muted-foreground">
          Document upload interface will be implemented here with drag-and-drop,
          progress tracking, and real-time parsing updates.
        </p>
      </div>
    </AppLayout>
  );
}

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DocumentSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* File Icon Skeleton */}
          <Skeleton className="h-10 w-10 flex-shrink-0" />

          {/* File Info Skeleton */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex gap-3 mt-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* Actions Menu Skeleton */}
          <Skeleton className="h-8 w-8" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-5 w-20" />
      </CardFooter>
    </Card>
  );
};

export const DocumentGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <DocumentSkeleton key={i} />
      ))}
    </div>
  );
};

export const DocumentListSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <DocumentSkeleton key={i} />
      ))}
    </div>
  );
};

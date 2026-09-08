import { Skeleton } from "@/components/ui/skeleton";

export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <Skeleton className="h-9 w-9 rounded-md" />

      {/* Page Numbers */}
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-9 w-9 rounded-md" />
      ))}

      {/* Next Button */}
      <Skeleton className="h-9 w-9 rounded-md" />
    </div>
  );
}

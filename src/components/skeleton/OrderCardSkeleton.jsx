import { Skeleton } from "@/components/ui/skeleton";

export function OrderCardSkeleton() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-dvh">
      <div className="w-full lg:w-2/3 mx-auto border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24" /> {/* order number */}
            <Skeleton className="h-5 w-16 rounded-full" /> {/* status badge */}
          </div>
          <Skeleton className="h-5 w-40 mt-2" /> {/* package name */}
          <Skeleton className="h-3 w-32 mt-2" /> {/* ordered on date */}
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Total paid row */}
          <div className="flex items-baseline justify-between">
            <div>
              <Skeleton className="h-2.5 w-20" /> {/* "TOTAL PAID" label */}
              <div className="flex items-baseline gap-2 mt-1.5">
                <Skeleton className="h-7 w-20" /> {/* price */}
                <Skeleton className="h-4 w-14" /> {/* strikethrough price */}
              </div>
            </div>
            <Skeleton className="h-6 w-14 rounded-lg" /> {/* discount badge */}
          </div>

          {/* Discount terms line */}
          <Skeleton className="h-3 w-56" />

          {/* Payment info rows */}
          <div className="space-y-2.5 pt-1">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>

        {/* Footer button */}
        <div className="flex items-center justify-end px-4 pb-4">
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>
      </div>
    </div>
  );
}

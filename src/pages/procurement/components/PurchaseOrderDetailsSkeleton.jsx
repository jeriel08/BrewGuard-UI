import { Skeleton } from "@/components/ui/skeleton";

const PurchaseOrderDetailsSkeleton = () => {
  return (
    <div className="flex flex-col space-y-6 p-4 md:px-8 md:pt-4 pt-6 w-full h-full">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>

      {/* ShipmentInfo Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 border rounded-lg bg-card shadow-sm">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-6 w-[160px]" />
          </div>
        ))}
      </div>

      {/* ShipmentBatches Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-[140px]" />

        {/* Desktop Table Skeleton */}
        <div className="hidden md:block rounded-md border">
          <div className="p-4 space-y-3">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>

        {/* Mobile Card Skeleton */}
        <div className="md:hidden space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-5 w-[70px] rounded-full" />
              </div>
              <Skeleton className="h-4 w-[140px]" />
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetailsSkeleton;

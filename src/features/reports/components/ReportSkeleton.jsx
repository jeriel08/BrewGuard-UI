import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ReportSkeleton({ chartCount = 2, hasSecondRow = false }) {
  return (
    <div className="space-y-6">
      {/* Stat Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-[60px] mb-1" />
              <Skeleton className="h-3 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 Skeleton */}
      <div
        className={`grid gap-4 ${chartCount === 1 ? "md:grid-cols-1" : "md:grid-cols-1 lg:grid-cols-2"}`}
      >
        {Array.from({ length: chartCount }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-[160px] mb-1" />
              <Skeleton className="h-3 w-[220px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 2 Skeleton (optional) */}
      {hasSecondRow && (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-[160px] mb-1" />
                <Skeleton className="h-3 w-[220px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

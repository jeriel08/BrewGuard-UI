import { ActivityLogsTable } from "@/components/activity-logs/activity-logs-table";
import { columns } from "@/components/activity-logs/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuditLogs } from "@/features/audit/api/useAuditLogs";

const ActivityLogs = () => {
  const { data: logs, isLoading, isError, error } = useAuditLogs();

  return (
    <div className="space-y-6 p-4 md:px-8 md:pt-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
          <p className="text-muted-foreground">
            View system audit logs and user activities.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : isError ? (
        <div className="text-red-500">
          {error.message || "Failed to load activity logs."}
        </div>
      ) : (
        <ActivityLogsTable columns={columns} data={logs} />
      )}
    </div>
  );
};

export default ActivityLogs;

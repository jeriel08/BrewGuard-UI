import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ActivityLogCard = ({ log }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="font-semibold text-sm">ID: {log.id}</div>
        <span className="text-xs text-muted-foreground">{log.date}</span>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">User:</span>
          <span className="font-medium text-sm">{log.user}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Action:</span>
          <Badge variant="secondary">{log.action}</Badge>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Description:</span>
          <span className="text-sm">{log.description}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">IP Address:</span>
          <span className="text-xs font-mono">{log.ipAddress}</span>
        </div>
      </CardContent>
    </Card>
  );
};

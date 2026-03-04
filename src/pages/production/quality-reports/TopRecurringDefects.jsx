import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const severityVariant = (severity) => {
  switch (severity) {
    case "Critical":
      return "destructive";
    case "Major":
      return "default";
    case "Minor":
      return "secondary";
    default:
      return "outline";
  }
};

export const TopRecurringDefects = ({ data, loading, className }) => {
  return (
    <Card className={className || ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Top Recurring Defects
        </CardTitle>
        <Bug className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <ScrollArea className="h-[300px] pr-4">
            <ul className="space-y-3">
              {data.map((defect, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-medium truncate">
                      {defect.defectDescription}
                    </p>
                    <Badge
                      variant={severityVariant(defect.severity)}
                      className="mt-1 text-xs"
                    >
                      {defect.severity}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{defect.count}</span>
                    <p className="text-xs text-muted-foreground">occurrences</p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground">
            No defect data available.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

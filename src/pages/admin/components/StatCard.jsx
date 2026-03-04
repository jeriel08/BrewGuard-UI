import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  loading,
  className,
}) => {
  return (
    <Card className={`col-span-1 ${className || ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="text-2xl font-bold mb-1">{value}</div>
            <p className="text-xs text-muted-foreground mb-4">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

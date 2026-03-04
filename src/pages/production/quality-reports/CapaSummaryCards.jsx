import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

export const CapaSummaryCards = ({ data, loading }) => {
  const cards = [
    {
      title: "Total CAPAs Filed",
      value: data?.totalCapas ?? 0,
      icon: FileText,
      description: "All corrective actions",
    },
    {
      title: "Avg. Resolution Time",
      value: `${data?.avgResolutionDays ?? 0} days`,
      icon: Clock,
      description: "CAPA to completion",
    },
    {
      title: "Action Plan Completion",
      value: `${data?.actionPlanCompletionRate ?? 0}%`,
      icon: CheckCircle2,
      description: "Completed vs total",
      colorClass:
        (data?.actionPlanCompletionRate ?? 0) >= 80
          ? "text-green-500"
          : "text-amber-500",
    },
    {
      title: "Overdue Action Plans",
      value: data?.overdueActionPlans ?? 0,
      icon: AlertTriangle,
      description: "Past deadline",
      colorClass:
        (data?.overdueActionPlans ?? 0) > 0
          ? "text-red-500"
          : "text-muted-foreground",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon
              className={`h-4 w-4 ${card.colorClass || "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

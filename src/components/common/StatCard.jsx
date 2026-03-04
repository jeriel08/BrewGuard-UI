import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  loading,
  colorClass = "text-muted-foreground",
  change,
}) => {
  const renderChangeIndicator = () => {
    if (!change || change.changePercent === undefined) return null;

    const pct = change.changePercent;
    const isPositive = pct > 0;
    const isNeutral = pct === 0;

    if (isNeutral) {
      return (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Minus className="h-3 w-3" />
          <span>No change from previous period</span>
        </div>
      );
    }

    return (
      <div
        className={`flex items-center gap-1 text-xs ${isPositive ? "text-emerald-600" : "text-red-500"}`}
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        <span>
          {isPositive ? "+" : ""}
          {pct}% from previous period
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className={`h-4 w-4 ${colorClass}`} />}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {change ? (
              renderChangeIndicator()
            ) : (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;

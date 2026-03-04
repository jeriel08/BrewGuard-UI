import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { getCuppingScoreTrend } from "@/features/reports/reportService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const CuppingScoreTrendChart = ({ className }) => {
  const [filter, setFilter] = useState("30");

  const dateRange = React.useMemo(() => {
    const days = parseInt(filter);
    return { startDate: subDays(new Date(), days), endDate: new Date() };
  }, [filter]);

  const { data: rawData, isLoading } = useQuery({
    queryKey: ["cupping-score-trend", filter],
    queryFn: () => getCuppingScoreTrend(dateRange.startDate, dateRange.endDate),
  });

  const data = React.useMemo(() => {
    if (!rawData) return null;
    return Object.keys(rawData).map((key) => {
      const dateObj = new Date(key);
      let label;
      if (filter === "7") {
        label = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      } else {
        label = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
      return {
        label,
        averageScore: rawData[key],
      };
    });
  }, [rawData, filter]);

  return (
    <Card className={`col-span-1 md:col-span-1 ${className || ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">
            Cupping Score Trend
          </CardTitle>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Average cupping scores over time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px] h-8">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">This week</SelectItem>
              <SelectItem value="30">This month</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
          <TrendingUp className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : data && data.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorCuppingScore"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={
                    filter === "30"
                      ? 3
                      : filter === "90"
                        ? 9
                        : "preserveStartEnd"
                  }
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[60, 100]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    backgroundColor: "#fff",
                    color: "#000",
                  }}
                  formatter={(value) => [`${value}`, "Avg Score"]}
                />
                <Area
                  type="monotone"
                  dataKey="averageScore"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCuppingScore)"
                  name="Avg Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No cupping score data available for this period.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

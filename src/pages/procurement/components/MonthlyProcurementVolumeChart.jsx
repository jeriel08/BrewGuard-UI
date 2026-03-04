import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { getProcurementVolumeTrend } from "@/features/reports/reportService";
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

export const MonthlyProcurementVolumeChart = ({ className }) => {
  const [filter, setFilter] = useState("30");

  const dateRange = React.useMemo(() => {
    const days = parseInt(filter);
    return { startDate: subDays(new Date(), days), endDate: new Date() };
  }, [filter]);

  const { data: rawData, isLoading } = useQuery({
    queryKey: ["procurement-volume-trend", filter],
    queryFn: async () => {
      const result = await getProcurementVolumeTrend(
        dateRange.startDate,
        dateRange.endDate,
      );
      // Validate that the response is a JSON object, not HTML
      if (
        typeof result !== "object" ||
        result === null ||
        Array.isArray(result)
      ) {
        throw new Error("Invalid API response");
      }
      return result;
    },
    retry: 2,
  });

  const data = React.useMemo(() => {
    if (!rawData || typeof rawData !== "object") return null;
    return Object.keys(rawData).map((key) => {
      const dateObj = new Date(key + "T00:00:00");
      let label;
      if (isNaN(dateObj.getTime())) {
        label = key;
      } else if (filter === "7") {
        label = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      } else {
        label = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
      return {
        label,
        volume: rawData[key],
      };
    });
  }, [rawData, filter]);

  // Determine which tick indices to show
  const tickInterval = filter === "30" ? 4 : filter === "90" ? 10 : 0;

  return (
    <Card className={`col-span-1 md:col-span-2 min-w-0 ${className || ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">
            Procurement Volume Trend
          </CardTitle>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Daily batch intake in kg
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[120px] h-8">
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
          <div>
            <div
              className="w-full mt-4"
              style={{ minWidth: "100px", height: 300 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="volumeGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval={tickInterval}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      backgroundColor: "#fff",
                      color: "#000",
                    }}
                    formatter={(value) => [`${value} kg`, "Volume"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#volumeGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No procurement data available for this period.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

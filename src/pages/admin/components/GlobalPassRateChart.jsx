import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { getAdminPassRateTrend } from "@/features/reports/reportService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2 } from "lucide-react";
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
} from "recharts";

export const GlobalPassRateChart = ({ className }) => {
  const [filter, setFilter] = useState("30");

  const dateRange = React.useMemo(() => {
    const days = parseInt(filter);
    return { startDate: subDays(new Date(), days), endDate: new Date() };
  }, [filter]);

  const { data: rawData, isLoading } = useQuery({
    queryKey: ["admin-pass-rate-trend", filter],
    queryFn: () =>
      getAdminPassRateTrend(dateRange.startDate, dateRange.endDate),
  });

  const data = React.useMemo(() => {
    if (!rawData) return null;
    return Object.keys(rawData).map((key) => {
      const dateObj = new Date(key);
      let label = key;
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
        passRate: rawData[key],
      };
    });
  }, [rawData, filter]);

  const value = data && data.length > 0 ? data[data.length - 1].passRate : 0;

  return (
    <Card
      className={`col-span-1 md:col-span-2 lg:col-span-4 ${className || ""}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">
            Global Pass Rate Trend
          </CardTitle>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Quality inspection success
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">This week</SelectItem>
              <SelectItem value="30">This month</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="text-2xl font-bold mb-4">{value}%</div>

            {data && (
              <div className="h-[200px] w-full mt-2">
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
                        id="colorPassRate"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12 }}
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
                    <YAxis hide={true} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        backgroundColor: "#fff",
                        color: "#000",
                      }}
                      formatter={(value) => [`${value}%`, "Pass Rate"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="passRate"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPassRate)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

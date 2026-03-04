import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Truck } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const SupplierLeaderboardChart = ({
  data,
  totalSuppliers,
  loading,
  className,
}) => {
  return (
    <Card className={`col-span-1 md:col-span-2 min-w-0 ${className || ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Supplier Leaderboard
        </CardTitle>
        <Truck className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <div>
            <div className="text-2xl font-bold mb-1">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground mb-4">
              Top rated suppliers
            </p>

            <div
              className="w-full mt-2"
              style={{ minWidth: "100px", height: 250 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    data && data.length > 0
                      ? data
                      : [{ supplierName: "No Data", rating: 0 }]
                  }
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 40, // Space for Y-axis labels
                    bottom: 5,
                  }}
                >
                  <XAxis type="number" domain={[0, 5]} hide />
                  <YAxis
                    dataKey="supplierName"
                    type="category"
                    width={100}
                    tick={{ fontSize: 11 }}
                    interval={0}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      backgroundColor: "#fff",
                      color: "#000",
                    }}
                    formatter={(value) => [`${value} / 5.0`, "Rating"]}
                  />
                  <Bar
                    dataKey="rating"
                    fill="#f59e0b"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

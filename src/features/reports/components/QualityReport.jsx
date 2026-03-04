import React from "react";
import { useQualityReport } from "../api/useReports";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  ClipboardCheck,
  Percent,
  AlertOctagon,
  Clock,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import StatCard from "@/components/common/StatCard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export const QualityReport = ({ startDate, endDate }) => {
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQualityReport(startDate, endDate);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load quality report. {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Inspections"
          value={stats?.totalInspections}
          icon={ClipboardCheck}
          description="Within selected period"
          loading={isLoading}
          change={stats?.inspectionsChange}
        />
        <StatCard
          title="Pass Rate"
          value={`${stats?.passRate ?? 0}%`}
          icon={Percent}
          description="Inspection success rate"
          loading={isLoading}
          colorClass="text-green-500"
          change={stats?.passRateChange}
        />
        <StatCard
          title="Avg. Cupping Score"
          value={stats?.avgCuppingScore ?? 0}
          icon={AlertOctagon}
          description="Average quality score"
          loading={isLoading}
          change={stats?.cuppingChange}
        />
        <StatCard
          title="Avg. Turnaround"
          value={`${stats?.avgTurnaroundHours ?? 0} hrs`}
          icon={Clock}
          description="Receipt to inspection"
          loading={isLoading}
          change={stats?.turnaroundChange}
        />
      </div>

      {/* Monthly Pass Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Pass Rates</CardTitle>
          <CardDescription>
            Inspection pass rate trend within selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div id="chart-quality-pass-rate" className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyPassRates}>
                <defs>
                  <linearGradient
                    id="qualPassRateGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
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
                  fill="url(#qualPassRateGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Consistency */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Consistency</CardTitle>
          <CardDescription>
            Pass rate and cupping score by supplier within period
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.supplierConsistency}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="supplierName"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 100]}
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
                  formatter={(value, name) => {
                    if (name === "passRate") return [`${value}%`, "Pass Rate"];
                    return [value, "Avg Cupping"];
                  }}
                />
                <Bar
                  dataKey="passRate"
                  fill="#16a34a"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                  name="passRate"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

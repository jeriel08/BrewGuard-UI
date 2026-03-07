import { useProductionReport } from "../api/useReports";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Activity, AlertTriangle, FileText, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import StatCard from "@/components/common/StatCard";
import { ReportSkeleton } from "./ReportSkeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = [
  "#ef4444",
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
];

export const ManagerReport = ({ startDate, endDate }) => {
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useProductionReport(startDate, endDate);

  if (isLoading) {
    return <ReportSkeleton chartCount={2} hasSecondRow />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load production report. {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total CAPAs"
          value={stats?.totalCapas}
          icon={Activity}
          description="Within selected period"
          loading={isLoading}
          change={stats?.capasChange}
        />
        <StatCard
          title="Avg. Resolution"
          value={`${stats?.avgResolutionDays ?? 0} days`}
          icon={FileText}
          description="Average time to resolve"
          loading={isLoading}
          change={stats?.resolutionChange}
        />
        <StatCard
          title="Completion Rate"
          value={`${stats?.actionPlanCompletionRate ?? 0}%`}
          icon={CheckCircle}
          description="Action plan completion"
          loading={isLoading}
          colorClass="text-green-500"
          change={stats?.completionChange}
        />
        <StatCard
          title="Overdue Plans"
          value={stats?.overdueActionPlans}
          icon={AlertTriangle}
          description="Past deadline"
          loading={isLoading}
          colorClass={stats?.overdueActionPlans > 0 ? "text-red-500" : ""}
          change={stats?.overdueChange}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {/* NCR Severity Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>NCR Severity Breakdown</CardTitle>
            <CardDescription>
              Non-conformance severity distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              id="chart-production-ncr-severity"
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.ncrSeverityBreakdown}
                    dataKey="count"
                    nameKey="severity"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ severity, count }) => `${severity}: ${count}`}
                  >
                    {stats?.ncrSeverityBreakdown?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Action Plan Status */}
        <Card>
          <CardHeader>
            <CardTitle>Action Plan Status</CardTitle>
            <CardDescription>
              Status distribution of action plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              id="chart-production-action-status"
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.actionPlanStatusBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
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
                  />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {/* Monthly NCR Counts */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly NCR Trend</CardTitle>
            <CardDescription>Non-conformance count by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div id="chart-production-ncr-trend" className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyNcrCounts}>
                  <defs>
                    <linearGradient id="ncrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#ncrGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Recurring Defects */}
        <Card>
          <CardHeader>
            <CardTitle>Top Recurring Defects</CardTitle>
            <CardDescription>
              Most frequent defects within period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div id="chart-production-top-defects" className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.topRecurringDefects} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="defectDescription"
                    tick={{ fontSize: 10 }}
                    width={120}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      backgroundColor: "#fff",
                      color: "#000",
                    }}
                    formatter={(value) => [value, "Count"]}
                  />
                  <Bar
                    dataKey="count"
                    fill="#f59e0b"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

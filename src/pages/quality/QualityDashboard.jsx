import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getQualityStats } from "@/features/dashboard/dashboardService";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ClipboardCheck,
  Percent,
  AlertOctagon,
  Clock,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CuppingScoreTrendChart } from "./components/CuppingScoreTrendChart";

const QualityDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getQualityStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch quality stats", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:px-8 md:pt-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-muted-foreground">
          Good day,{" "}
          <span className="font-semibold text-foreground">
            {user?.firstName} {user?.lastName}
          </span>
          !
        </span>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Inspections
            </CardTitle>
            <ClipboardCheck
              className={`h-4 w-4 ${stats?.pendingInspectionsCount > 0 ? "text-orange-500" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pendingInspectionsCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Batches waiting for inspection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly Pass Rate
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.weeklyPassRate ?? 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average pass rate this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Defects Found
            </CardTitle>
            <AlertOctagon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalDefectsFound ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Defects recorded in inspections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Turnaround Time
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.averageTurnaroundTime ?? 0} hrs
            </div>
            <p className="text-xs text-muted-foreground">
              Time from receipt to inspection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Pending Inspections List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Inspections</CardTitle>
            <CardDescription>
              Batches that require immediate attention.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] overflow-y-auto pr-2">
              {stats?.pendingInspections &&
              stats.pendingInspections.length > 0 ? (
                <div className="space-y-4">
                  {stats.pendingInspections.map((batch) => (
                    <div
                      key={batch.batchId}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {batch.itemName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Batch #{batch.batchNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Received:{" "}
                          {batch.dateReceived
                            ? format(
                                new Date(batch.dateReceived),
                                "MMM dd, yyyy",
                              )
                            : "N/A"}
                        </p>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/inspections/new?batchId=${batch.batchId}`}>
                          Inspect
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground h-full">
                  <ClipboardCheck className="h-8 w-8 mb-2 opacity-20" />
                  <p>No pending inspections.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cupping Score Trend Chart */}
        <CuppingScoreTrendChart />
      </div>

      {/* Supplier Consistency Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Consistency</CardTitle>
          <CardDescription>
            Pass rate percentage by supplier (Top 5).
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
                  tickFormatter={(value) => `${value}%`}
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
                  formatter={(value) => [`${value}%`, "Pass Rate"]}
                />
                <Bar
                  dataKey="passRate"
                  fill="#16a34a"
                  radius={[4, 4, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityDashboard;

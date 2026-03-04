import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getManagerStats } from "@/features/dashboard/dashboardService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Activity,
  AlertTriangle,
  FileText,
  ClipboardCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DefectBreakdownChart } from "./components/DefectBreakdownChart";
import { MonthlyPassRateChart } from "./components/MonthlyPassRateChart";

const ProductionDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getManagerStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch manager stats", err);
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open CAPAs</CardTitle>
            <Activity
              className={`h-4 w-4 ${stats?.openCapas > 0 ? "text-red-500" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.openCapas ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Corrective actions in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical NCRs</CardTitle>
            <AlertTriangle
              className={`h-4 w-4 ${stats?.criticalNcrs > 0 ? "text-red-500" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.criticalNcrs ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              High severity non-conformances
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unresolved Action Plans
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.unresolvedActionPlans ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending action plans
            </p>
          </CardContent>
        </Card>

        <Link to="/capa-logs" className="block">
          <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approvals
              </CardTitle>
              <ClipboardCheck
                className={`h-4 w-4 ${stats?.pendingApprovals > 0 ? "text-amber-500" : "text-muted-foreground"}`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.pendingApprovals ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Action plans awaiting review
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <DefectBreakdownChart data={stats?.defectBreakdown} loading={loading} />
        <MonthlyPassRateChart />
      </div>
    </div>
  );
};

export default ProductionDashboard;

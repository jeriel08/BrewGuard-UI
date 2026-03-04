import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getProcurementStats } from "@/features/dashboard/dashboardService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/common/StatCard";
import {
  AlertTriangle,
  Package,
  Truck,
  ShoppingCart,
  List,
  Plus,
  CalendarCheck,
} from "lucide-react";
import { SupplierLeaderboardChart } from "../admin/components/SupplierLeaderboardChart";
import { MonthlyProcurementVolumeChart } from "./components/MonthlyProcurementVolumeChart";
import { ItemsNeedingReorderCard } from "./components/ItemsNeedingReorderCard";

const ProcurementDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getProcurementStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch procurement stats", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  /*
  const handleReorder = () => {
    navigate("/purchase-orders/new");
  };
  */

  return (
    <div className="flex-1 space-y-4 p-4 md:px-8 md:pt-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2"></div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-muted-foreground">
          Welcome back,{" "}
          <span className="font-semibold text-foreground">
            {user?.firstName} {user?.lastName}
          </span>
        </span>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockCount}
          icon={AlertTriangle}
          description="Items below reorder level"
          loading={loading}
          colorClass="text-red-500"
        />
        <StatCard
          title="Total Suppliers"
          value={stats?.totalSuppliers}
          icon={Truck}
          description="Active suppliers"
          loading={loading}
        />
        <StatCard
          title="Shipments This Month"
          value={stats?.shipmentsThisMonth}
          icon={Package}
          description="Received shipments"
          loading={loading}
        />
        <StatCard
          title="On-Time Delivery Rate"
          value={stats ? `${stats.onTimeDeliveryRate ?? 0}%` : "0%"}
          icon={CalendarCheck}
          description="Last 30 days"
          loading={loading}
          colorClass="text-green-500"
        />
      </div>

      {/* Action Needed Section */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mt-4">
        {/* Items Needing Reorder - Now using the new component */}
        <ItemsNeedingReorderCard
          items={stats?.itemsNeedingReorder}
          loading={loading}
          className="col-span-1"
        />
        <SupplierLeaderboardChart
          data={stats?.supplierLeaderboard}
          totalSuppliers={stats?.totalSuppliers}
          loading={loading}
          className="col-span-1 lg:col-span-1"
        />

        {/* Monthly Procurement Volume Chart - Full Width */}
        <MonthlyProcurementVolumeChart className="col-span-1 md:col-span-1 lg:col-span-2" />
      </div>
    </div>
  );
};

export default ProcurementDashboard;

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAdminStats } from "@/features/dashboard/dashboardService";
import {
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Download,
  Calendar as CalendarIcon,
} from "lucide-react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StatCard } from "./components/StatCard";
import { GlobalPassRateChart } from "./components/GlobalPassRateChart";
import { StockDistributionChart } from "./components/StockDistributionChart";
import { SupplierLeaderboardChart } from "./components/SupplierLeaderboardChart";
import { AdminReportTemplate } from "./components/AdminReportTemplate";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef(null);
  const reportTemplateRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleExportPdf = async () => {
    if (!reportTemplateRef.current) return;
    setIsExporting(true);

    try {
      // Ensure all charts have had a moment to render fully if they were just mounted/updated
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(reportTemplateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // "p" for portrait A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate height to maintain aspect ratio
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
      pdf.save("BrewGuard-Admin-Report.pdf");
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="flex-1 space-y-4 p-4 md:px-8 md:pt-4 pt-6 relative overflow-hidden"
      ref={dashboardRef}
    >
      {/* Hidden Reporting Template for PDF generation */}
      <AdminReportTemplate ref={reportTemplateRef} stats={stats} user={user} />

      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2"></div>
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
        {/* Top Row: Alerts, Active, Inspections, Employees */}
        <StatCard
          title="Critical Alerts"
          value={stats?.criticalAlertsCount}
          icon={AlertTriangle}
          description="Low stock & unresolved NCRs"
          loading={loading}
        />
        <StatCard
          title="Active Batches"
          value={stats?.totalActiveBatches}
          icon={Activity}
          description="Batches with stock > 0"
          loading={loading}
        />
        <StatCard
          title="Total Inspections"
          value={stats?.totalInspectionsConducted}
          icon={CheckCircle}
          description="All time inspections"
          loading={loading}
        />
        <StatCard
          title="Employees"
          value={stats?.totalEmployees}
          icon={Users}
          description="Total workforce"
          loading={loading}
        />

        {/* Middle Row: Global Pass Rate Area Chart (Full Width) */}
        <GlobalPassRateChart />

        {/* Bottom Row: Stock Donut and Supplier Leaderboard */}
        <StockDistributionChart
          data={stats?.stockBreakdown}
          totalStock={stats?.totalStockInKg}
          loading={loading}
        />

        <SupplierLeaderboardChart
          data={stats?.supplierLeaderboard}
          totalSuppliers={stats?.totalSuppliers}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

import { useProcurementReport } from "../api/useReports";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Truck, Package, CalendarCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import StatCard from "@/components/common/StatCard";
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
} from "recharts";

export const ProcurementReport = ({ startDate, endDate }) => {
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useProcurementReport(startDate, endDate);

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
          Failed to load procurement report. {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Purchase Orders"
          value={stats?.totalPurchaseOrders}
          icon={Package}
          description="Within selected period"
          loading={isLoading}
          change={stats?.purchaseOrdersChange}
        />
        <StatCard
          title="Total Shipments"
          value={stats?.totalShipments}
          icon={Truck}
          description="Received shipments"
          loading={isLoading}
          change={stats?.shipmentsChange}
        />
        <StatCard
          title="Items Received"
          value={
            stats?.totalItemsReceived
              ? `${Math.round(stats.totalItemsReceived)} kg`
              : "0 kg"
          }
          icon={Package}
          description="Total volume"
          loading={isLoading}
          change={stats?.volumeChange}
        />
        <StatCard
          title="On-Time Delivery Rate"
          value={`${stats?.onTimeDeliveryRate ?? 0}%`}
          icon={CalendarCheck}
          description="Within period"
          loading={isLoading}
          colorClass="text-green-500"
          change={stats?.onTimeChange}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {/* Procurement Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Procurement Volume</CardTitle>
            <CardDescription>
              Procurement volume within selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div id="chart-procurement-volume" className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyProcurementVolume}>
                  <defs>
                    <linearGradient
                      id="procVolGrad"
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
                    fill="url(#procVolGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Items by Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Top Items by Volume</CardTitle>
            <CardDescription>Most procured items within period</CardDescription>
          </CardHeader>
          <CardContent>
            <div id="chart-procurement-top-items" className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.topItemsByVolume} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="itemName"
                    tick={{ fontSize: 11 }}
                    width={100}
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
                    formatter={(value) => [`${value} kg`, "Volume"]}
                  />
                  <Bar
                    dataKey="totalQuantity"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Delivery Performance</CardTitle>
          <CardDescription>
            On-time delivery rate by supplier within period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            id="chart-procurement-supplier-perf"
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.supplierPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="supplierName"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
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
                  formatter={(value) => [`${value}%`, "On-Time Rate"]}
                />
                <Bar
                  dataKey="onTimeRate"
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

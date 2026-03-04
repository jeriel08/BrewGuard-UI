import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { branchService } from "@/features/branches/api/branchService";
import { useUsers } from "@/features/auth/api/useUsers";
import { useSettings } from "@/features/settings/api/useSettings";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Users, Activity, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "@/lib/axios";

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: branchService.getAllBranches,
  });

  const { data: users } = useUsers();

  // Reuse existing hook for settings
  const { data: settings } = useSettings();

  // New query for activity stats
  const [activityFilter, setActivityFilter] = useState("7");

  const { data: activityStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["audit-stats", activityFilter],
    queryFn: async () => {
      const { data } = await api.get(`/audit/stats?days=${activityFilter}`);
      return data;
    },
  });

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Branches
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active locations being monitored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registered users across all branches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>Activity logs over time</CardDescription>
            </div>
            <div>
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-[160px] h-8">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">This week</SelectItem>
                  <SelectItem value="30">This month</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pl-2 pt-4">
            <div className="h-[300px] w-full">
              {isLoadingStats ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      interval={
                        activityFilter === "30"
                          ? 3
                          : activityFilter === "90"
                            ? 9
                            : "preserveStartEnd"
                      }
                      tickFormatter={(value) => {
                        if (activityFilter === "7") {
                          return new Date(value).toLocaleDateString("en-US", {
                            weekday: "short",
                          });
                        }
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
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
                      formatter={(value) => [value, "Activities"]}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      barSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>System Settings Preview</CardTitle>
            <CardDescription>
              Snapshot of current configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Setting</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings?.slice(0, 5).map((setting) => (
                  <TableRow key={setting.key}>
                    <TableCell
                      className="font-medium truncate max-w-[150px]"
                      title={setting.key}
                    >
                      {setting.key}
                    </TableCell>
                    <TableCell
                      className="text-right truncate max-w-[100px]"
                      title={setting.value}
                    >
                      {setting.value.toString()}
                    </TableCell>
                  </TableRow>
                ))}
                {(!settings || settings.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-center text-muted-foreground"
                    >
                      No settings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

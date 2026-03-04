import React from "react";
import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "./admin/AdminDashboard";
import ProcurementDashboard from "./procurement/ProcurementDashboard";
import QualityDashboard from "./quality/QualityDashboard";
import ProductionDashboard from "./production/ProductionDashboard";
import SuperAdminDashboard from "./super-admin/Dashboard";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // or loading spinner, though ProtectedRoute should handle this
  }

  switch (user.role) {
    case "Super Admin":
      return <SuperAdminDashboard />;
    case "Administrator":
      return <AdminDashboard />;
    case "Admin":
      return <AdminDashboard />;
    case "Procurement Officer":
      return <ProcurementDashboard />;
    case "Quality Inspector":
      return <QualityDashboard />;
    case "Production Manager":
      return <ProductionDashboard />;
    default:
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p>Welcome, {user.name}!</p>
          <p className="text-gray-500 mt-2">
            Your role ({user.role}) does not have a specific dashboard layout
            yet.
          </p>
        </div>
      );
  }
};

export default Dashboard;

import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

// Layouts
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// --- LAZY LOAD PAGES (Industry Standard: Code Splitting) ---
// These files are only downloaded when the user visits the route.

// Auth
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const ForgotPasswordPage = lazy(
  () => import("@/pages/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const RoastingLog = lazy(() => import("@/pages/production/RoastingLog"));

// Dashboard & Account
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const AccountSettingsLayout = lazy(
  () => import("@/pages/Account/AccountSettingsLayout"),
);
const AccountDetailsPage = lazy(
  () => import("@/pages/Account/AccountDetailsPage"),
);
const ChangePasswordPage = lazy(
  () => import("@/pages/Account/ChangePasswordPage"),
);

// Admin
const ManageUsers = lazy(
  () => import("@/pages/admin/manage-users/ManageUsers"),
);
const AddUser = lazy(() => import("@/pages/admin/manage-users/AddUser"));
const EditUser = lazy(() => import("@/pages/admin/manage-users/EditUser"));
const ActivityLogs = lazy(
  () => import("@/pages/admin/activity-logs/ActivityLogs"),
);
const SystemSettings = lazy(
  () => import("@/pages/admin/settings/SystemSettings"),
);
const AdminReports = lazy(() => import("@/pages/admin/reports/AdminReports"));
const ItemDefinitions = lazy(
  () => import("@/pages/admin/inventory/ItemDefinitions"),
);

// Super Admin
const SuperAdminDashboard = lazy(() => import("@/pages/super-admin/Dashboard"));
const BranchList = lazy(
  () => import("@/pages/super-admin/branches/BranchList"),
);

// Features
// Note: If you haven't created these files yet, keep them as standard imports or dummy components
const Inventory = lazy(() => import("@/pages/inventory/Inventory")); // Admin only
const RawMaterials = lazy(() => import("@/pages/inventory/RawMaterials")); // Procurement Officer, Admin, Super Admin
const RawMaterialsInventory = lazy(
  () => import("@/pages/procurement/RawMaterialsInventory"),
);
const Inspections = lazy(
  () => import("@/pages/quality/inspections/Inspections"),
);
const CreateInspection = lazy(
  () => import("@/pages/quality/inspections/CreateInspection"),
);
const AddPurchaseOrder = lazy(
  () => import("@/pages/procurement/AddPurchaseOrder"),
);
const PurchaseOrders = lazy(() => import("@/pages/procurement/PurchaseOrders"));
const PurchaseOrderDetails = lazy(
  () => import("@/pages/procurement/PurchaseOrderDetails"),
);
const EditPurchaseOrder = lazy(
  () => import("@/pages/procurement/EditPurchaseOrder"),
);
const SupplierPage = lazy(() => import("@/pages/procurement/SupplierPage"));

const ViewInspectionDetails = lazy(
  () => import("@/pages/quality/inspections/ViewInspectionDetails"),
);

const Ncr = lazy(() => import("@/pages/quality/ncr/Ncr"));

// Production
const CapaLogs = lazy(() => import("@/pages/production/capa-logs/CapaLogs"));
const CreateCapaLog = lazy(
  () => import("@/pages/production/capa-logs/CreateCapaLog"),
);
const CapaLogDetails = lazy(
  () => import("@/pages/production/capa-logs/CapaLogDetails"),
);
const QualityReports = lazy(
  () => import("@/pages/production/quality-reports/QualityReports"),
);
const ProductInventory = lazy(
  () => import("@/pages/production/ProductInventory"),
);

// Suspense fallback — NavigationProgress in App.jsx handles the visual indicator
const PageLoader = () => null;

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* --- SECURE AREA --- */}
        <Route element={<AppLayout />}>
          {/* Accessible by ALL logged in users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/settings" element={<AccountSettingsLayout />}>
              <Route index element={<Navigate to="account" replace />} />
              <Route path="account" element={<AccountDetailsPage />} />
              <Route path="security" element={<ChangePasswordPage />} />
            </Route>
          </Route>

          {/* --- ADMIN MODULE --- */}
          <Route
            element={<ProtectedRoute allowedRoles={["Admin", "Super Admin"]} />}
          >
            <Route path="/users" element={<ManageUsers />} />
            <Route path="/users/add-user" element={<AddUser />} />
            <Route path="/users/edit-user/:id" element={<EditUser />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/item-definitions" element={<ItemDefinitions />} />
            <Route path="/inventory" element={<Inventory />} />
          </Route>

          {/* --- SUPER ADMIN MODULE --- */}
          <Route element={<ProtectedRoute allowedRoles={["Super Admin"]} />}>
            <Route path="/branches" element={<BranchList />} />
            <Route path="/activity-logs" element={<ActivityLogs />} />
            <Route path="/system-settings" element={<SystemSettings />} />
          </Route>

          {/* --- PROCUREMENT MODULE (Sprint 1) --- */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["Admin", "Procurement Officer"]} />
            }
          >
            <Route
              path="/procurement/inventory"
              element={<RawMaterialsInventory />}
            />
            <Route path="/raw-materials" element={<RawMaterials />} />
            <Route path="/suppliers" element={<SupplierPage />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/purchase-orders/new" element={<AddPurchaseOrder />} />
            <Route
              path="/purchase-orders/:id/edit"
              element={<EditPurchaseOrder />}
            />
            <Route
              path="/purchase-orders/:id"
              element={<PurchaseOrderDetails />}
            />
          </Route>

          {/* --- QUALITY MODULE (Sprint 2) --- */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Admin",
                  "Quality Inspector",
                  "Production Manager",
                  "Procurement Officer",
                ]}
              />
            }
          >
            <Route path="/inspections" element={<Inspections />} />
            <Route path="/inspections/new" element={<CreateInspection />} />
            <Route
              path="/inspections/:id"
              element={<ViewInspectionDetails />}
            />
            <Route path="/ncr" element={<Ncr />} />
          </Route>

          {/* --- PRODUCTION MODULE --- */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Admin",
                  "Production Manager",
                  "Procurement Officer",
                  "Quality Inspector",
                ]}
              />
            }
          >
            <Route path="/capa-logs" element={<CapaLogs />} />
            <Route path="/capa-logs/new" element={<CreateCapaLog />} />
            <Route path="/capa-logs/:id" element={<CapaLogDetails />} />
            <Route path="/quality-reports" element={<QualityReports />} />
            <Route path="/roasting-log" element={<RoastingLog />} />
            <Route
              path="/production/inventory"
              element={<ProductInventory />}
            />
          </Route>
        </Route>

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

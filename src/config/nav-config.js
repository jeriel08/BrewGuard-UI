import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  FileText,
  Truck,
  ShoppingCart,
  ClipboardCheck,
  AlertTriangle,
  BarChart,
  ListTodo,
  FileBarChart,
  Activity,
  Flame,
  Building2,
} from "lucide-react";

export const navConfig = {
  "Super Admin": [
    {
      group: "Overview",
      items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
    },
    {
      group: "Organization",
      items: [
        { title: "Branch Management", url: "/branches", icon: Building2 },
        { title: "User Management", url: "/users", icon: Users },
        { title: "Item Definitions", url: "/item-definitions", icon: Package },
      ],
    },
    {
      group: "Maintenance",
      items: [
        { title: "Activity Logs", url: "/activity-logs", icon: Activity },
        { title: "System Settings", url: "/system-settings", icon: Settings },
      ],
    },
  ],
  Admin: [
    {
      group: "Overview",
      items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
    },
    {
      group: "Management",
      items: [
        { title: "Item Definitions", url: "/item-definitions", icon: Package },
        { title: "Manage Users", url: "/users", icon: Users },
        { title: "Reports", url: "/reports", icon: FileText },
      ],
    },
  ],
  "Procurement Officer": [
    {
      group: "Overview",
      items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
    },
    {
      group: "Procurement",
      items: [
        { title: "Inventory", url: "/procurement/inventory", icon: Package },
        { title: "Raw Materials", url: "/raw-materials", icon: Package },
        { title: "Suppliers", url: "/suppliers", icon: Truck },
        {
          title: "Purchase Orders",
          url: "/purchase-orders",
          icon: ShoppingCart,
        },
      ],
    },
    {
      group: "Quality",
      items: [
        { title: "NCR", url: "/ncr", icon: AlertTriangle },
        { title: "CAPA Logs", url: "/capa-logs", icon: ListTodo },
      ],
    },
  ],

  "Quality Inspector": [
    {
      group: "Overview",
      items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
    },
    {
      group: "Quality Control",
      items: [
        { title: "Inspections", url: "/inspections", icon: ClipboardCheck },
        { title: "NCR", url: "/ncr", icon: AlertTriangle },
      ],
    },
  ],
  "Production Manager": [
    {
      group: "Overview",
      items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
    },
    {
      group: "Production",
      items: [
        {
          title: "Product Inventory",
          url: "/production/inventory",
          icon: Package,
        },
        { title: "Roasting Log", url: "/roasting-log", icon: Flame },
      ],
    },
    {
      group: "Quality Management",
      items: [
        { title: "NCR", url: "/ncr", icon: AlertTriangle },
        { title: "CAPA Logs", url: "/capa-logs", icon: ListTodo },
        {
          title: "Quality Reports",
          url: "/quality-reports",
          icon: FileBarChart,
        },
      ],
    },
  ],
};

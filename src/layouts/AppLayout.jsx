import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout() {
  const location = useLocation();
  const { user } = useAuth();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem
                className={
                  location.pathname === "/dashboard"
                    ? "block"
                    : "hidden md:block"
                }
              >
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {location.pathname
                .split("/")
                .filter((x) => x && x !== "dashboard")
                .map((segment, index, array) => {
                  // Handle numeric IDs
                  let segmentName = segment;
                  if (!isNaN(segment)) {
                    segmentName = "Details";
                  }

                  // Skip the "Details" breadcrumb if the previous segment was "edit-user"
                  if (
                    segmentName === "Details" &&
                    array[index - 1] === "edit-user"
                  ) {
                    return null;
                  }

                  const path = `/${array.slice(0, index + 1).join("/")}`;

                  // Determine if this is effectively the last item to show
                  // It's last if it's the actual last item, OR if the next item is a numeric ID (which we hide)
                  const isEffectivelyLast =
                    index === array.length - 1 ||
                    (index < array.length - 1 && !isNaN(array[index + 1]));

                  const breadcrumbNameMap = {
                    "edit-user": "Edit User",
                    "add-user": "Add User",
                    users: "Users",
                    inventory: "Inventory",
                    inspections: "Inspections",
                    "system-settings": "System Settings",
                    "purchase-orders": "Purchase Orders",
                    ncr: "NCR",
                    "capa-logs": "CAPA Logs",
                    "quality-reports": "Quality Reports",
                    new: "Add Purchase Order",
                  };

                  let name = breadcrumbNameMap[segmentName];

                  // Context-aware overrides
                  if (
                    segmentName === "new" &&
                    array[index - 1] === "inspections"
                  ) {
                    name = "Conduct Inspection";
                  }

                  if (
                    segmentName === "new" &&
                    array[index - 1] === "capa-logs"
                  ) {
                    name = "Create CAPA Log";
                  }

                  name =
                    name ||
                    (segmentName === "Details"
                      ? "Details"
                      : segmentName
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" "));

                  return (
                    <React.Fragment key={path}>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem
                        className={
                          isEffectivelyLast ? "block" : "hidden md:block"
                        }
                      >
                        {isEffectivelyLast ? (
                          <BreadcrumbPage>{name}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={path}>{name}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  );
                })}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden flex-col items-end md:flex mr-2">
              {user?.role && (
                <span className="text-sm font-semibold text-foreground leading-none">
                  {user.role}
                </span>
              )}
              {user?.branchName && (
                <span className="text-xs text-muted-foreground mt-1 leading-none">
                  {user.branchName}
                </span>
              )}
            </div>
            <ModeToggle />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-2">
          <Outlet />
          <Toaster />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

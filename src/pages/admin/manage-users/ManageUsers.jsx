import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { UsersDataTable } from "../../../components/manage-users/users-data-table";
import {
  Plus,
  Archive,
  RotateCcw,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/features/auth/api/useUsers";
import { useArchivedUsers } from "@/features/auth/api/useArchivedUsers";
import { useArchiveUser } from "@/features/auth/api/useArchiveUser";
import { useUnarchiveUser } from "@/features/auth/api/useUnarchiveUser";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionsCell } from "../../../components/manage-users/ActionsCell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUpdateUserStatus } from "@/features/auth/api/useUpdateUserStatus";
import { branchService } from "@/features/branches/api/branchService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ManageUsers = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState("active");
  const [userToArchive, setUserToArchive] = useState(null);

  const isSuperAdmin = currentUser?.role === "Super Admin";

  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: branchService.getAllBranches,
    enabled: isSuperAdmin,
  });

  const {
    data: activeUsers,
    isLoading: isLoadingActive,
    isError: isErrorActive,
    error: errorActive,
  } = useUsers();

  const {
    data: archivedUsers,
    isLoading: isLoadingArchived,
    isError: isErrorArchived,
    error: errorArchived,
  } = useArchivedUsers();

  const filteredActiveUsers = useMemo(() => {
    return activeUsers?.filter((u) => u.role !== "Super Admin") || [];
  }, [activeUsers]);

  const filteredArchivedUsers = useMemo(() => {
    return archivedUsers?.filter((u) => u.role !== "Super Admin") || [];
  }, [archivedUsers]);

  const archiveUserMutation = useArchiveUser();
  const unarchiveUserMutation = useUnarchiveUser();
  const updateUserStatusMutation = useUpdateUserStatus();

  const handleArchive = () => {
    if (!userToArchive) return;

    archiveUserMutation.mutate(userToArchive.id, {
      onSuccess: () => {
        toast.success("User archived successfully.");
        setUserToArchive(null);
      },
      onError: () => {
        toast.error("Failed to archive user.");
        setUserToArchive(null);
      },
    });
  };

  const handleRestore = (userId) => {
    unarchiveUserMutation.mutate(userId, {
      onSuccess: () => toast.success("User restored successfully."),
      onError: () => toast.error("Failed to restore user."),
    });
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="w-[50px]">{row.getValue("id")}</div>,
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4 hover:bg-sidebar-accent hover:text-primary"
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4 hover:bg-sidebar-accent hover:text-primary"
            >
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          return <span className="font-medium">{row.getValue("role")}</span>;
        },
      },
      {
        accessorKey: "branchName",
        header: "Branch",
        cell: ({ row }) => {
          return (
            <span className="font-medium text-muted-foreground">
              {row.getValue("branchName") || "N/A"}
            </span>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const isActive = row.getValue("isActive");
          return (
            <Badge variant="outline" className="gap-1.5">
              <span
                className={`size-1.5 rounded-full ${
                  isActive ? "bg-green-500" : "bg-red-500"
                }`}
                aria-hidden="true"
              />
              {isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
    ];

    const actionsColumn = {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        // Use ActionsCell for active users to reuse the confirmation dialogs
        if (currentTab === "active") {
          return <ActionsCell user={user} onArchive={setUserToArchive} />;
        }

        // For archived users, Admins/SuperAdmins can only restore
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.email)}
              >
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isSuperAdmin && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleRestore(user.id)}
                  disabled={unarchiveUserMutation.isPending}
                >
                  <RotateCcw className="h-4 w-4 hover:text-white" />
                  Restore User
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    };

    return [...baseColumns, actionsColumn];
  }, [
    currentTab,
    isSuperAdmin,
    archiveUserMutation.isPending,
    unarchiveUserMutation.isPending,
    updateUserStatusMutation.isPending,
  ]);

  return (
    <div className="space-y-6 p-4 md:px-8 md:pt-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>
          <p className="text-muted-foreground">
            View and manage user accounts and permissions.
          </p>
        </div>
        <Button onClick={() => navigate("/users/add-user")}>
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <Tabs
        defaultValue="active"
        value={currentTab}
        onValueChange={setCurrentTab}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="active">Active Users</TabsTrigger>
            <TabsTrigger value="archived">Archived Users</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="space-y-4">
          {isLoadingActive ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : isErrorActive ? (
            <div className="text-red-500">
              {errorActive.message || "Failed to load users."}
            </div>
          ) : (
            <UsersDataTable
              columns={columns}
              data={filteredActiveUsers}
              onArchive={setUserToArchive}
              branches={branches}
              isSuperAdmin={isSuperAdmin}
            />
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {isLoadingArchived ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : isErrorArchived ? (
            <div className="text-red-500">
              {errorArchived.message || "Failed to load archived users."}
            </div>
          ) : (
            <UsersDataTable
              columns={columns}
              data={filteredArchivedUsers}
              onArchive={setUserToArchive}
              branches={branches}
              isSuperAdmin={isSuperAdmin}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Archive Confirmation Dialog */}
      <Dialog
        open={!!userToArchive}
        onOpenChange={(open) => !open && setUserToArchive(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Archive</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive user{" "}
              <span className="font-medium text-foreground">
                {userToArchive?.firstName} {userToArchive?.lastName}
              </span>
              ? This action will also deactivate the user account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToArchive(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleArchive}
              disabled={archiveUserMutation.isPending}
            >
              Archive User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageUsers;

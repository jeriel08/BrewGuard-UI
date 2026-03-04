import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";
import { useUpdateUserStatus } from "@/features/auth/api/useUpdateUserStatus";
import { toast } from "sonner";
import { useState } from "react";

export const ActionsCell = ({ user, onArchive }) => {
  const navigate = useNavigate();
  const updateUserStatusMutation = useUpdateUserStatus();
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const handleStatusChange = () => {
    const newStatus = !user.isActive;
    updateUserStatusMutation.mutate(
      { userId: user.id, isActive: newStatus },
      {
        onSuccess: () => {
          toast.success(
            `User ${newStatus ? "activated" : "deactivated"} successfully.`,
          );
          setShowStatusDialog(false);
        },
        onError: (error) => {
          toast.error(error.response?.data || "Failed to update user status.");
        },
      },
    );
  };

  return (
    <>
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
          <DropdownMenuItem
            onClick={() => navigate(`/users/edit-user/${user.id}`)}
          >
            Edit User
          </DropdownMenuItem>
          {!user.isArchived && (
            <>
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={() => setShowStatusDialog(true)}
                disabled={updateUserStatusMutation.isPending}
              >
                {user.isActive ? "Deactivate User" : "Activate User"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={() => {
                  if (onArchive) onArchive(user);
                }}
              >
                Archive User
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {user.isActive ? "deactivate" : "activate"} user{" "}
              <span className="font-medium text-foreground">
                {user.firstName} {user.lastName}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant={user.isActive ? "destructive" : "default"}
              onClick={handleStatusChange}
              disabled={updateUserStatusMutation.isPending}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

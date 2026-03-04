import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { branchService } from "@/features/branches/api/branchService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  MoreHorizontal,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import AddBranchDialog from "./AddBranchDialog";
import EditBranchDialog from "./EditBranchDialog";
import { BranchDataCard } from "./BranchDataCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function BranchList() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [deletingBranchId, setDeletingBranchId] = useState(null);

  const queryClient = useQueryClient();

  const {
    data: branches,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["branches"],
    queryFn: branchService.getAllBranches,
  });

  const deleteMutation = useMutation({
    mutationFn: branchService.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch deleted successfully");
      setDeletingBranchId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete branch");
      setDeletingBranchId(null);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, branch }) =>
      branchService.updateBranch(id, {
        name: branch.name,
        location: branch.location,
        isActive: !branch.isActive,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch status updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update branch status");
    },
  });

  if (isError)
    return <div className="text-red-500">Failed to load branches</div>;

  return (
    <div className="space-y-6 p-4 md:px-8 md:pt-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Branches</h2>
          <p className="text-muted-foreground">
            Manage your organization's physical locations.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add Branch
        </Button>
      </div>

      <div className="rounded-md border hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : branches?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No branches found.
                </TableCell>
              </TableRow>
            ) : (
              branches?.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell>{branch.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1.5">
                      <span
                        className={`size-1.5 rounded-full ${
                          branch.isActive ? "bg-green-500" : "bg-zinc-400"
                        }`}
                        aria-hidden="true"
                      />
                      {branch.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
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
                          onClick={() => setEditingBranch(branch)}
                        >
                          <Pencil className="h-4 w-4 hover:text-white" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            toggleStatusMutation.mutate({
                              id: branch.id,
                              branch: branch,
                            })
                          }
                          className={
                            branch.isActive
                              ? "text-red-500 focus:bg-red-500 focus:text-white"
                              : "text-green-600 focus:bg-green-600 focus:text-white"
                          }
                        >
                          <div className="flex items-center">
                            {branch.isActive ? (
                              <>
                                <XCircle className="mr-2 h-4 w-4 hover:text-white" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4 hover:text-white" />
                                Activate
                              </>
                            )}
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </CardHeader>
              <CardContent className="grid gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-5 w-[80px] rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : branches?.length === 0 ? (
          <div className="text-center p-4 border rounded-md text-muted-foreground">
            No branches found.
          </div>
        ) : (
          branches?.map((branch) => (
            <BranchDataCard
              key={branch.id}
              branch={branch}
              onEdit={setEditingBranch}
              onToggleStatus={(b) =>
                toggleStatusMutation.mutate({
                  id: b.id,
                  branch: b,
                })
              }
            />
          ))
        )}
      </div>

      <AddBranchDialog open={isAddOpen} onOpenChange={setIsAddOpen} />

      <EditBranchDialog
        open={!!editingBranch}
        onOpenChange={(open) => !open && setEditingBranch(null)}
        branch={editingBranch}
      />

      <AlertDialog
        open={!!deletingBranchId}
        onOpenChange={() => setDeletingBranchId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              branch and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteMutation.mutate(deletingBranchId)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { branchService } from "@/features/branches/api/branchService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function EditBranchDialog({ open, onOpenChange, branch }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isActive, setIsActive] = useState(true);

  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (branch) {
      setName(branch.name);
      setLocation(branch.location);
      setIsActive(branch.isActive);
    }
  }, [branch]);

  const mutation = useMutation({
    mutationFn: (data) => branchService.updateBranch(branch.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch updated successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.title || "Failed to update branch");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !location) {
      toast.error("Please fill in all fields");
      return;
    }
    mutation.mutate({ name, location, isActive });
  };

  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Branch</DialogTitle>
              <DialogDescription>Update branch details.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className={!isDesktop ? "px-4" : ""}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="edit-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="active" className="text-right">
                    Active
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Checkbox
                      id="active"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <label
                      htmlFor="active"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Is Branch Active?
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pb-4 md:pb-0">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="sm:max-w-none">
            <SheetHeader className="text-left px-4 pt-4">
              <SheetTitle>Edit Branch</SheetTitle>
              <SheetDescription>Update branch details.</SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="px-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="edit-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="active" className="text-right">
                    Active
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Checkbox
                      id="active"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <label
                      htmlFor="active"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Is Branch Active?
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pb-4 md:pb-0">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

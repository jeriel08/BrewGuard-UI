import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { branchService } from "@/features/branches/api/branchService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function AddBranchDialog({ open, onOpenChange }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const mutation = useMutation({
    mutationFn: branchService.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch created successfully");
      onOpenChange(false);
      setName("");
      setLocation("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.title || "Failed to create branch");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !location) {
      toast.error("Please fill in all fields");
      return;
    }
    mutation.mutate({ name, location });
  };

  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
              <DialogDescription>
                Create a new branch location for the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className={!isDesktop ? "px-4" : ""}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. Downtown Roaster"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. 123 Main St"
                  />
                </div>
              </div>
              <div className="flex justify-end pb-4 md:pb-0">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Creating..." : "Create Branch"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="sm:max-w-none">
            <SheetHeader className="text-left px-4 pt-4">
              <SheetTitle>Add New Branch</SheetTitle>
              <SheetDescription>
                Create a new branch location for the system.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="px-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. Downtown Roaster"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. 123 Main St"
                  />
                </div>
              </div>
              <div className="flex justify-end pb-4 md:pb-0">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Creating..." : "Create Branch"}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

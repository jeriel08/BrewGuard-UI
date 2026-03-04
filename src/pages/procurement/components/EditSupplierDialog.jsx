import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { EditSupplierForm } from "./EditSupplierForm";

export function EditSupplierDialog({
  open,
  onOpenChange,
  supplier,
  onSupplierUpdated,
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSuccess = () => {
    onOpenChange(false);
    if (onSupplierUpdated) onSupplierUpdated();
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>
              Update the supplier details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <EditSupplierForm supplier={supplier} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Edit Supplier</SheetTitle>
          <SheetDescription>
            Update the supplier details below. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <EditSupplierForm
          className="px-4"
          supplier={supplier}
          onSuccess={handleSuccess}
        />
      </SheetContent>
    </Sheet>
  );
}

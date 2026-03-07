import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { EditItemForm } from "./EditItemForm";

export function EditItemDialog({ item, open, onOpenChange }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    onOpenChange(false);
    queryClient.invalidateQueries({ queryKey: ["items"] });
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update the item details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <EditItemForm item={item} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Edit Item</SheetTitle>
          <SheetDescription>
            Update the item details below. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <EditItemForm item={item} className="px-4" onSuccess={handleSuccess} />
      </SheetContent>
    </Sheet>
  );
}

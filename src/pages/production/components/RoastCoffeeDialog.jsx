import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Flame, PenLine } from "lucide-react";
import { RoastCoffeeForm } from "./RoastCoffeeForm";

export function RoastCoffeeDialog({
  rawMaterialBatches,
  finishedProductItems,
  onSubmit,
  editData,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSubmit = async (data) => {
    await onSubmit(data);
    setOpen(false);
  };

  const formContent = (
    <RoastCoffeeForm
      rawMaterialBatches={rawMaterialBatches}
      finishedProductItems={finishedProductItems}
      onSubmit={handleSubmit}
      onCancel={() => setOpen(false)}
      editData={editData}
    />
  );

  const isEdit = !!editData;

  const triggerButton = !isControlled ? (
    <Button variant={isEdit ? "ghost" : "default"}>
      {isEdit ? (
        <PenLine className="mr-2 h-4 w-4" />
      ) : (
        <Flame className="mr-2 h-4 w-4" />
      )}
      {isEdit ? "Edit Roast" : "Roast Coffee"}
    </Button>
  ) : null;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {!isControlled && (
          <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        )}
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Roasting Log" : "Roast Coffee Production"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update this production batch. Note that you can only edit batches pending inspection."
                : "Record a new production batch. Select raw materials used and the resulting finished product."}
            </DialogDescription>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {!isControlled && <SheetTrigger asChild>{triggerButton}</SheetTrigger>}
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Edit Roasting Log" : "Roast Coffee Production"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update this production batch. Note that you can only edit batches pending inspection."
              : "Record a new production batch. Select raw materials used and the resulting finished product."}
          </SheetDescription>
        </SheetHeader>
        {/* Pass explicit padding to match AddItemDialog style if needed, usually AddItemDialog uses className="px-4" */}
        <RoastCoffeeForm
          rawMaterialBatches={rawMaterialBatches}
          finishedProductItems={finishedProductItems}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          className="px-4 pb-6"
          editData={editData}
        />
      </SheetContent>
    </Sheet>
  );
}

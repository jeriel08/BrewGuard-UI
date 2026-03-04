import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Archive, RotateCcw } from "lucide-react";
import { EditSupplierDialog } from "./EditSupplierDialog"; // Assuming this path is correct relative to where SupplierActionsCell is

export const SupplierActionsCell = ({
  supplier,
  onSupplierUpdated,
  onArchive,
  onRestore,
  isArchived,
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

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
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 hover:text-white" /> Edit
          </DropdownMenuItem>
          {isArchived
            ? onRestore && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onRestore(supplier)}>
                    <RotateCcw className="h-4 w-4 hover:text-white" /> Restore
                  </DropdownMenuItem>
                </>
              )
            : onArchive && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onArchive(supplier)}
                    className="text-destructive focus:bg-destructive focus:text-white"
                  >
                    <Archive className="h-4 w-4 hover:text-white" /> Archive
                  </DropdownMenuItem>
                </>
              )}
        </DropdownMenuContent>
      </DropdownMenu>

      <EditSupplierDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog} // Ensure your dialog uses this prop
        supplier={supplier} // Pass full supplier object if needed
        onSupplierUpdated={onSupplierUpdated}
      />
    </>
  );
};

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditItemDialog } from "./EditItemDialog";
import { ViewItemDialog } from "./ViewItemDialog";

const ActionsCell = ({
  row,
  onItemUpdated,
  onArchive,
  onRestore,
  isArchived,
}) => {
  const item = row.original;
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

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
            onClick={() => navigator.clipboard.writeText(item.id.toString())}
          >
            Copy Item ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            Edit Item
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setViewOpen(true)}>
            View Details
          </DropdownMenuItem>
          {isArchived
            ? onRestore && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onRestore(item.id)}>
                    Restore Item
                  </DropdownMenuItem>
                </>
              )
            : onArchive && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onArchive(item.id)}
                    className="flex items-center gap-2 text-destructive focus:bg-destructive focus:text-white"
                  >
                    <Archive className="h-4 w-4" />
                    Archive Item
                  </DropdownMenuItem>
                </>
              )}
        </DropdownMenuContent>
      </DropdownMenu>

      <EditItemDialog
        item={item}
        open={editOpen}
        onOpenChange={setEditOpen}
        onItemUpdated={onItemUpdated}
      />

      <ViewItemDialog
        itemId={item.id}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
    </>
  );
};

export const createColumns = ({
  onItemUpdated,
  onArchive,
  onRestore,
  isArchived,
}) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 hover:bg-sidebar-accent hover:text-primary"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "unitOfMeasurement",
    header: "UoM",
  },
  {
    accessorKey: "reorderLevel",
    header: "Reorder Level",
  },
  {
    accessorKey: "standardCost",
    header: "Standard Cost",
    cell: ({ row }) => `₱${(row.getValue("standardCost") || 0).toFixed(2)}`,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ActionsCell
        row={row}
        onItemUpdated={onItemUpdated}
        onArchive={onArchive}
        onRestore={onRestore}
        isArchived={isArchived}
      />
    ),
  },
];

// Keep a default export for backwards compatibility
export const columns = createColumns({});

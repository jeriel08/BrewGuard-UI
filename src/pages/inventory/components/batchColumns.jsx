import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const batchColumns = [
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
    header: "Batch #",
  },
  {
    accessorKey: "itemName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 hover:bg-sidebar-accent hover:text-primary"
        >
          Item
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "supplierName",
    header: "Supplier",
  },
  {
    accessorKey: "currentQuantity",
    header: "Quantity",
  },
  {
    accessorKey: "actualUnitCost",
    header: "Unit Cost",
    cell: ({ row }) => `₱${(row.getValue("actualUnitCost") || 0).toFixed(2)}`,
  },
  {
    accessorKey: "dateReceived",
    header: "Received Date",
    cell: ({ row }) => {
      const dateValue = row.getValue("dateReceived");
      if (!dateValue) return "N/A";
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      let dotColor = "bg-slate-500";
      if (status === "Approved") dotColor = "bg-green-500";
      if (status === "Rejected") dotColor = "bg-destructive";
      if (status === "Depleted") dotColor = "bg-amber-500";

      return (
        <Badge variant="outline" className="pl-1.5 pr-2.5">
          <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${dotColor}`} />
          {status}
        </Badge>
      );
    },
  },
];

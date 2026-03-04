import { Button } from "@/components/ui/button";
import { ArrowUpDown, ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const pendingColumns = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-sidebar-accent hover:text-primary"
        >
          Batch ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
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
    cell: ({ row }) => {
      const supplier = row.getValue("supplierName");
      const isEmpty =
        !supplier || supplier === "N/A" || supplier === "Unknown Supplier";
      return isEmpty ? "-" : supplier;
    },
  },
  {
    id: "dateReceived",
    accessorFn: (row) =>
      row.dateReceived || row.DateReceived || row.createdAt || row.CreatedAt,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 hover:bg-sidebar-accent hover:text-primary"
        >
          Date Received
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("dateReceived");
      return date && !isNaN(new Date(date).getTime())
        ? format(new Date(date), "PPP")
        : "N/A";
    },
  },
  {
    accessorKey: "itemCategory",
    header: "Category",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      // Define dot color based on status (though currently likely "Pending Inspection")
      const dotColor =
        status === "Pending Inspection"
          ? "bg-gray-500"
          : status === "Approved"
            ? "bg-green-500"
            : "bg-red-500";

      return (
        <Badge variant="outline" className="gap-2">
          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const batch = row.original;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="icon" variant="ghost">
                <Link to={`/inspections/new?batchId=${batch.id}`}>
                  <ClipboardCheck className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Inspect Batch</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];

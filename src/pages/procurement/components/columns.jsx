import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { SupplierActionsCell } from "./SupplierActionsCell";

export const columns = ({ onRefresh, onArchive, onRestore, isArchived }) => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-sidebar-accent hover:text-primary"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "contactInfo",
    header: "Contact Info",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("rating");
      return <span>{rating}</span>;
    },
  },
  {
    accessorKey: "qualityScore",
    header: "Quality Score",
    cell: ({ row }) => {
      const score = row.getValue("qualityScore");
      return score !== null ? `${score}%` : "N/A";
    },
  },
  {
    accessorKey: "timelinessScore",
    header: "Timeliness Score",
    cell: ({ row }) => {
      const score = row.getValue("timelinessScore");
      return score !== null ? `${score}%` : "N/A";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <SupplierActionsCell
        supplier={row.original}
        onSupplierUpdated={onRefresh}
        onArchive={onArchive}
        onRestore={onRestore}
        isArchived={isArchived}
      />
    ),
  },
];

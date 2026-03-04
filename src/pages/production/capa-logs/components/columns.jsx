import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowUpDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns = [
  {
    id: "id",
    accessorFn: (row) => row.id || row.Id,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-sidebar-accent hover:text-primary"
        >
          CAPA ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    id: "ncrId",
    accessorFn: (row) => row.ncrId || row.NcrId,
    header: "NCR ID",
    cell: ({ row }) => (
      <div className="font-medium">#{row.getValue("ncrId")}</div>
    ),
  },
  {
    id: "rootCauseCategory",
    accessorFn: (row) => row.rootCauseCategory || row.RootCauseCategory,
    header: "Root Cause Category",
    cell: ({ row }) => {
      const category = row.getValue("rootCauseCategory");
      let dotClass = "bg-slate-500";
      if (category === "Material") dotClass = "bg-amber-500";
      else if (category === "Machine") dotClass = "bg-blue-500";
      else if (category === "Method") dotClass = "bg-purple-500";
      else if (category === "Manpower") dotClass = "bg-orange-500";

      return (
        <Badge variant="outline" className="pl-2 pr-3 gap-2 font-normal">
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          {category}
        </Badge>
      );
    },
  },
  {
    id: "managerName",
    accessorFn: (row) => row.managerName || row.ManagerName,
    header: "Manager",
  },
  {
    id: "dateCreated",
    accessorFn: (row) =>
      row.createdAt || row.CreatedAt || row.dateCreated || row.DateCreated,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 hover:bg-sidebar-accent hover:text-primary"
        >
          Date Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("dateCreated");
      if (!dateValue || isNaN(new Date(dateValue).getTime())) {
        return <div className="text-muted-foreground">N/A</div>;
      }
      return <div>{format(new Date(dateValue), "PPP")}</div>;
    },
  },
  {
    id: "ncrStatus",
    accessorFn: (row) => row.ncrStatus || row.NcrStatus,
    header: "NCR Status",
    cell: ({ row }) => {
      const status = row.getValue("ncrStatus");
      let dotClass = "bg-slate-500";

      if (status === "Pending") dotClass = "bg-blue-500";
      if (status === "Investigation In Progress") dotClass = "bg-purple-500";
      if (status === "Resolved") dotClass = "bg-green-500";

      return (
        <Badge variant="outline" className="pl-2 pr-3 gap-2 font-normal">
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const id = row.getValue("id");
      return (
        <div className="text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/capa-logs/${id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Show CAPA Log Details</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show CAPA Log Details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];

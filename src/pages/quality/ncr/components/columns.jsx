import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowUpDown, PenLine, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const getColumns = (user) => [
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
          NCR ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    id: "dateLogged",
    accessorFn: (row) => row.dateLogged || row.DateLogged,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 hover:bg-sidebar-accent hover:text-primary"
        >
          Date Logged
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("dateLogged");
      if (!dateValue || isNaN(new Date(dateValue).getTime())) {
        return <div className="text-muted-foreground">N/A</div>;
      }
      return <div>{format(new Date(dateValue), "PPP")}</div>;
    },
  },
  {
    id: "batchInfo",
    accessorFn: (row) => row.batchInfo || row.BatchInfo,
    header: "Batch Info",
  },

  {
    id: "severity",
    accessorFn: (row) => row.severity || row.Severity,
    header: "Severity",
    cell: ({ row }) => {
      const severity = row.getValue("severity");
      let dotClass = "bg-slate-500";
      if (severity === "Critical") dotClass = "bg-red-500";
      else if (severity === "Major") dotClass = "bg-orange-500";
      else if (severity === "Minor") dotClass = "bg-yellow-500";

      return (
        <Badge variant="outline" className="pl-2 pr-3 gap-2 font-normal">
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          {severity}
        </Badge>
      );
    },
  },
  {
    id: "status",
    accessorFn: (row) => row.status || row.Status,
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      let dotClass = "bg-slate-500";

      if (status === "Pending") dotClass = "bg-gray-500";
      if (status === "Analyzing") dotClass = "bg-purple-500";
      if (status === "Action Needed") dotClass = "bg-amber-500";
      if (
        status === "Investigation in Progress" ||
        status === "Investigation In Progress"
      )
        dotClass = "bg-blue-500";
      if (status === "Resolved" || status === "Closed")
        dotClass = "bg-green-500";

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
    cell: ({ row }) => {
      const id = row.getValue("id") || row.original?.Id || row.original?.id;
      const status =
        row.getValue("status") || row.original?.Status || row.original?.status;
      const capaId = row.original?.CapaId || row.original?.capaId;

      if (status === "Resolved") return null;

      const isInvestigating =
        status === "Investigation in Progress" ||
        status === "Investigation In Progress";

      if (isInvestigating && capaId) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/capa-logs/${capaId}`}>
                    <FileText className="h-4 w-4" />
                    <span className="sr-only">Show CAPA Log</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show CAPA Log</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      if (user?.role === "Quality Inspector") return null;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/capa-logs/new?ncrId=${id}`}>
                  <PenLine className="h-4 w-4 hover:text-white" />
                  <span className="sr-only">Write CAPA Log</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Write CAPA Log</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];

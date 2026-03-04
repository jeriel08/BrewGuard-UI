import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { PenLine, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function NcrDataCard({ data }) {
  const { user } = useAuth();
  const getSeverityDotClass = (severity) => {
    if (severity === "Critical") return "bg-red-500";
    if (severity === "Major") return "bg-orange-500";
    if (severity === "Minor") return "bg-yellow-500";
    return "bg-slate-500";
  };

  const getStatusDotClass = (status) => {
    if (status === "Pending") return "bg-gray-500";
    if (status === "Analyzing") return "bg-purple-500";
    if (status === "Action Needed") return "bg-amber-500";
    if (
      status === "Investigation in Progress" ||
      status === "Investigation In Progress"
    )
      return "bg-blue-500";
    if (status === "Resolved" || status === "Closed") return "bg-green-500";
    return "bg-slate-500";
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((ncr, index) => {
        // Safe access for properties
        const id = ncr.id || ncr.Id;
        const status = ncr.status || ncr.Status;
        const dateLogged = ncr.dateLogged || ncr.DateLogged;
        const batchInfo = ncr.batchInfo || ncr.BatchInfo;
        const defectDescription =
          ncr.defectDescription || ncr.DefectDescription;
        const severity = ncr.severity || ncr.Severity;

        const isInvestigating =
          status === "Investigation in Progress" ||
          status === "Investigation In Progress";

        return (
          <Card key={id || index} className="w-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  NCR #{id || "Unknown"}
                  {isInvestigating && (ncr.capaId || ncr.CapaId) ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                          >
                            <Link to={`/capa-logs/${ncr.capaId || ncr.CapaId}`}>
                              <FileText className="h-4 w-4 text-blue-600 hover:text-blue-700" />
                              <span className="sr-only">Show CAPA Log</span>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Show CAPA Log</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : status !== "Resolved" &&
                    status !== "Closed" &&
                    user?.role !== "Quality Inspector" ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                          >
                            <Link to={`/capa-logs/new?ncrId=${id}`}>
                              <PenLine className="h-4 w-4 text-emerald-600 hover:text-emerald-700" />
                              <span className="sr-only">Write CAPA Log</span>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Write CAPA Log</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : null}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="pl-2 pr-3 gap-2 font-normal"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${getStatusDotClass(
                      status,
                    )}`}
                  />
                  {status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {dateLogged && !isNaN(new Date(dateLogged).getTime())
                  ? format(new Date(dateLogged), "PPP")
                  : "N/A"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Batch:
                  </span>
                  <span className="text-sm font-medium">{batchInfo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Severity:
                  </span>
                  <Badge
                    variant="outline"
                    className="pl-2 pr-3 gap-2 font-normal"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${getSeverityDotClass(
                        severity,
                      )}`}
                    />
                    {severity}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

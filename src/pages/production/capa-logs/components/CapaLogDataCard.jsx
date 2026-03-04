import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export function CapaLogDataCard({ data }) {
  const getCategoryDotClass = (category) => {
    if (category === "Material") return "bg-amber-500";
    if (category === "Machine") return "bg-blue-500";
    if (category === "Method") return "bg-purple-500";
    if (category === "Manpower") return "bg-orange-500";
    return "bg-slate-500";
  };

  const getStatusDotClass = (status) => {
    if (status === "Pending") return "bg-blue-500";
    if (status === "Investigation In Progress") return "bg-purple-500";
    if (status === "Resolved") return "bg-green-500";
    return "bg-slate-500";
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((log, index) => {
        const id = log.id || log.Id;
        const ncrId = log.ncrId || log.NcrId;
        const rootCauseCategory =
          log.rootCauseCategory || log.RootCauseCategory;
        const managerName = log.managerName || log.ManagerName;
        const dateCreated = log.dateCreated || log.DateCreated;
        const ncrStatus = log.ncrStatus || log.NcrStatus;

        return (
          <Card key={id || index} className="w-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">
                  CAPA #{id || "Unknown"}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="pl-2 pr-3 gap-2 font-normal"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${getStatusDotClass(
                      ncrStatus,
                    )}`}
                  />
                  {ncrStatus}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                NCR #{ncrId} &middot;{" "}
                {dateCreated && !isNaN(new Date(dateCreated).getTime())
                  ? format(new Date(dateCreated), "PPP")
                  : "N/A"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Category:
                  </span>
                  <Badge
                    variant="outline"
                    className="pl-2 pr-3 gap-2 font-normal"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${getCategoryDotClass(
                        rootCauseCategory,
                      )}`}
                    />
                    {rootCauseCategory}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Manager:
                  </span>
                  <span className="text-sm font-medium">{managerName}</span>
                </div>
                <div className="pt-2">
                  <Link to={`/capa-logs/${id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      Show CAPA Log Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

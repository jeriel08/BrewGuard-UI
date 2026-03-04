import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { EmptyState } from "@/components/common/EmptyState";
import { ClipboardList } from "lucide-react";

export default function ActionPlanSection({ actionPlans }) {
  const getStatusDotClass = (status) => {
    if (status === "Pending") return "bg-blue-500";
    if (status === "In Progress") return "bg-amber-500";
    if (status === "Completed") return "bg-green-500";
    return "bg-slate-500";
  };

  if (!actionPlans || actionPlans.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Action Plans</h3>
          <p className="text-sm text-muted-foreground">
            Corrective and preventive action tasks.
          </p>
        </div>
        <EmptyState
          title="No Action Plans"
          description="No action plans have been assigned for this CAPA yet."
          icon={ClipboardList}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Action Plans</h3>
        <p className="text-sm text-muted-foreground">
          {actionPlans.length} action plan{actionPlans.length !== 1 ? "s" : ""}{" "}
          assigned.
        </p>
      </div>

      <div className="space-y-4">
        {actionPlans.map((plan) => {
          const id = plan.id || plan.Id;
          const description = plan.description || plan.Description;
          const assignedToName = plan.assignedToName || plan.AssignedToName;
          const deadline = plan.deadline || plan.Deadline;
          const status = plan.status || plan.Status;

          return (
            <Card key={id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Action Plan #{id}</CardTitle>
                  <Badge
                    variant="outline"
                    className="pl-2 pr-3 gap-2 font-normal"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${getStatusDotClass(status)}`}
                    />
                    {status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Description
                  </p>
                  <p className="text-sm mt-1">{description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Assigned To
                    </p>
                    <p className="text-sm font-semibold">
                      {assignedToName || "Unassigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Deadline
                    </p>
                    <p className="text-sm font-semibold">
                      {(() => {
                        if (!deadline || isNaN(new Date(deadline).getTime()))
                          return "N/A";
                        return format(new Date(deadline), "PPP");
                      })()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

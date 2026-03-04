import {
  LocateFixed,
  Briefcase,
  CalendarClock,
  User as UserIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/features/auth/api/getUsers";

export function CapaSummaryStep({ formData, selectedNcr }) {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (!formData || !selectedNcr) return null;

  const assignedUser = users?.find(
    (u) => u.id.toString() === formData.assignedTo?.toString(),
  );

  return (
    <div className="bg-background p-6 rounded-xl space-y-6 border shadow-sm text-sm max-w-3xl mx-auto custom-scrollbar">
      <div className="space-y-1 mb-2 border-b pb-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          CAPA Submission Review
        </h3>
        <p className="text-muted-foreground text-sm">
          Please review the details of your Corrective and Preventative Action
          log before submitting.
        </p>
      </div>

      {/* Target NCR & Category */}
      <div className="space-y-4">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground border-b pb-2 mb-3">
            <LocateFixed className="w-4 h-4 text-muted-foreground" />
            Root Cause Assessment
          </h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Original NCR
              </p>
              <p className="text-sm font-medium">NCR #{selectedNcr.id}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Category
              </p>
              <p className="text-sm font-medium">
                {formData.rootCauseCategory}
              </p>
            </div>
          </div>

          <div className="space-y-2 bg-muted/30 p-4 rounded-md border text-sm">
            <h5 className="font-medium text-foreground text-sm mb-3">
              5 Whys Analysis
            </h5>
            <div className="space-y-3">
              <div className="grid grid-cols-[60px_1fr] gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Why 1:
                </span>
                <span className="text-sm text-foreground">{formData.why1}</span>
              </div>
              <div className="grid grid-cols-[60px_1fr] gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Why 2:
                </span>
                <span className="text-sm text-foreground">{formData.why2}</span>
              </div>
              <div className="grid grid-cols-[60px_1fr] gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Why 3:
                </span>
                <span className="text-sm text-foreground">{formData.why3}</span>
              </div>
              <div className="grid grid-cols-[60px_1fr] gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Why 4:
                </span>
                <span className="text-sm text-foreground">{formData.why4}</span>
              </div>
              <div className="grid grid-cols-[60px_1fr] gap-2 pt-2 border-t mt-2">
                <span className="text-sm font-bold text-foreground">Root:</span>
                <span className="text-sm text-foreground font-medium">
                  {formData.why5}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 col-span-1 md:col-span-2">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground border-b pb-2 mb-3">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            Action Plans
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.correctiveAction && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Corrective Action
                </p>
                <div className="bg-muted/30 p-3 rounded-md border text-sm leading-relaxed min-h-[80px] whitespace-pre-wrap">
                  {formData.correctiveAction}
                </div>
              </div>
            )}
            {formData.preventiveAction && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Preventative Action
                </p>
                <div className="bg-muted/30 p-3 rounded-md border text-sm leading-relaxed min-h-[80px] whitespace-pre-wrap">
                  {formData.preventiveAction}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1 p-4 rounded-lg bg-muted/20 border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <UserIcon className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Assigned To
            </span>
          </div>
          <p className="font-medium text-sm text-foreground">
            {assignedUser
              ? `${assignedUser.firstName} ${assignedUser.lastName}`
              : formData.assignedTo}
          </p>
        </div>

        <div className="space-y-1 p-4 rounded-lg bg-muted/20 border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CalendarClock className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Target Due Date
            </span>
          </div>
          <p className="font-medium text-sm text-foreground">
            {formData.dueDate
              ? new Date(formData.dueDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

export default function AnalysisSection({ capaLog }) {
  const getCategoryDotClass = (category) => {
    if (category === "Material") return "bg-amber-500";
    if (category === "Machine") return "bg-blue-500";
    if (category === "Method") return "bg-purple-500";
    if (category === "Manpower") return "bg-orange-500";
    return "bg-slate-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Root Cause Analysis</h3>
        <p className="text-sm text-muted-foreground">
          5 Whys analysis and investigation details.
        </p>
      </div>

      {/* NCR Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Non-Conformance Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                NCR ID
              </p>
              <p className="text-sm font-semibold">
                #{capaLog.ncrId || capaLog.NcrId}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Batch Info
              </p>
              <p className="text-sm font-semibold">
                {capaLog.batchInfo || capaLog.BatchInfo}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Severity
              </p>
              <p className="text-sm font-semibold">
                {capaLog.severity || capaLog.Severity || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                NCR Status
              </p>
              <p className="text-sm font-semibold">
                {capaLog.ncrStatus || capaLog.NcrStatus}
              </p>
            </div>
          </div>
          {(capaLog.defectDescription || capaLog.DefectDescription) && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Defect Description
                </p>
                <p className="text-sm mt-1">
                  {capaLog.defectDescription || capaLog.DefectDescription}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Root Cause Category */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Root Cause Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" className="pl-2 pr-3 gap-2 font-normal">
            <span
              className={`h-2 w-2 rounded-full ${getCategoryDotClass(
                capaLog.rootCauseCategory || capaLog.RootCauseCategory,
              )}`}
            />
            {capaLog.rootCauseCategory || capaLog.RootCauseCategory}
          </Badge>
        </CardContent>
      </Card>

      {/* 5 Whys */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">5 Whys Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Why 1", value: capaLog.why1 || capaLog.Why1 },
            { label: "Why 2", value: capaLog.why2 || capaLog.Why2 },
            { label: "Why 3", value: capaLog.why3 || capaLog.Why3 },
            { label: "Why 4", value: capaLog.why4 || capaLog.Why4 },
            {
              label: "Why 5 (Root Cause)",
              value: capaLog.why5RootCause || capaLog.Why5RootCause,
              highlight: true,
            },
          ].map((item, index) => (
            <div key={index}>
              <p className="text-sm font-medium text-muted-foreground">
                {item.label}
              </p>
              <p
                className={`text-sm mt-1 ${item.highlight ? "font-semibold text-foreground" : ""}`}
              >
                {item.value || "N/A"}
              </p>
              {index < 4 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Investigation Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Investigated By
              </p>
              <p className="text-sm font-semibold">
                {capaLog.managerName || capaLog.ManagerName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Date Created
              </p>
              <p className="text-sm font-semibold">
                {(() => {
                  const d = capaLog.dateCreated || capaLog.DateCreated;
                  if (!d || isNaN(new Date(d).getTime())) return "N/A";
                  return format(new Date(d), "PPP");
                })()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

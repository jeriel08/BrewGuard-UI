import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const InspectionDataCard = ({ inspection }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Inspection #{inspection.id}
        </CardTitle>
        <Badge variant="outline" className="flex w-18 items-center">
          <span
            className={`h-2 w-2 rounded-full ${inspection.result === "Passed" ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="text-xs">{inspection.result}</span>
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1">
          <div className="text-sm">
            <span className="font-semibold">Batch:</span> {inspection.batchInfo}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Inspector:</span>{" "}
            {inspection.inspectorName}
          </div>
          {inspection.batch?.supplierName &&
            inspection.batch.supplierName !== "N/A" && (
              <div className="text-sm">
                <span className="font-semibold">Supplier:</span>{" "}
                {inspection.batch.supplierName}
              </div>
            )}
          <div className="text-sm">
            <span className="font-semibold">Date:</span>{" "}
            {inspection.inspectionDate &&
            !isNaN(new Date(inspection.inspectionDate).getTime())
              ? format(new Date(inspection.inspectionDate), "PPP")
              : "N/A"}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Score:</span>{" "}
            {parseFloat(inspection.cuppingScore).toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

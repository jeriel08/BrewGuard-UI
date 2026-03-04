import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ClipboardCheck } from "lucide-react";

export const PendingInspectionCard = ({ batch }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Batch #{batch.id}</CardTitle>
        <Badge variant="outline" className="gap-2 font-normal">
          <span
            className={`h-2 w-2 rounded-full ${
              batch.status === "Pending Inspection"
                ? "bg-gray-500"
                : batch.status === "Approved"
                  ? "bg-green-500"
                  : "bg-red-500"
            }`}
          />
          {batch.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1 mb-4">
          <div className="text-sm">
            <span className="font-semibold">Item:</span> {batch.itemName}
          </div>
          {batch.supplierName &&
            batch.supplierName !== "N/A" &&
            batch.supplierName !== "Unknown Supplier" && (
              <div className="text-sm">
                <span className="font-semibold">Supplier:</span>{" "}
                {batch.supplierName}
              </div>
            )}
          <div className="text-sm">
            <span className="font-semibold">Date Received:</span>{" "}
            {(batch.dateReceived ||
              batch.DateReceived ||
              batch.createdAt ||
              batch.CreatedAt) &&
            !isNaN(
              new Date(
                batch.dateReceived ||
                  batch.DateReceived ||
                  batch.createdAt ||
                  batch.CreatedAt,
              ).getTime(),
            )
              ? format(
                  new Date(
                    batch.dateReceived ||
                      batch.DateReceived ||
                      batch.createdAt ||
                      batch.CreatedAt,
                  ),
                  "PPP",
                )
              : "N/A"}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Quantity:</span>{" "}
            {batch.currentQuantity}
          </div>
        </div>
        <Button
          className="w-full"
          size="sm"
          onClick={() => navigate(`/inspections/new?batchId=${batch.id}`)}
        >
          <ClipboardCheck className="mr-2 h-4 w-4" />
          Conduct Inspection
        </Button>
      </CardContent>
    </Card>
  );
};

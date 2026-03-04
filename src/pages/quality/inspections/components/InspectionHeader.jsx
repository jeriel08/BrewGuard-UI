import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const InspectionHeader = ({ inspection }) => {
  const navigate = useNavigate();
  const isPass = inspection.result === "Passed";

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/inspections")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold tracking-tight">
            Inspection #{inspection.id}
          </h2>
          <p className="text-muted-foreground">
            Conducted on{" "}
            {inspection.inspectionDate &&
            !isNaN(new Date(inspection.inspectionDate).getTime())
              ? format(new Date(inspection.inspectionDate), "PPP")
              : "N/A"}
          </p>
        </div>
      </div>
      <Badge
        variant="outline"
        className={`flex items-center gap-1 px-3 py-1 text-sm ${
          isPass
            ? "border-green-500 text-green-600 bg-green-50"
            : "border-red-500 text-red-600 bg-red-50"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            isPass ? "bg-green-500" : "bg-red-500"
          }`}
        />
        {inspection.result}
      </Badge>
    </div>
  );
};

export default InspectionHeader;

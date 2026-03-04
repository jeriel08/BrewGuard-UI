import React from "react";

const InspectionRemarksDetails = ({ inspection }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Remarks</h3>
      <div className="rounded-md border p-4 bg-muted/50">
        <p className="text-sm whitespace-pre-wrap">
          {inspection.remarks || "No remarks provided."}
        </p>
      </div>
    </div>
  );
};

export default InspectionRemarksDetails;

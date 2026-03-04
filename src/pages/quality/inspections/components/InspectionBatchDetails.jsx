import React from "react";

const InspectionBatchDetails = ({ inspection }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Batch Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <span className="text-sm font-medium text-muted-foreground">
            Batch ID
          </span>
          <p className="text-base font-medium">#{inspection.batchId}</p>
        </div>
        <div className="space-y-1">
          <span className="text-sm font-medium text-muted-foreground">
            Item Name
          </span>
          <p className="text-base font-medium">
            {inspection.batch?.itemName || "N/A"}
          </p>
        </div>
        <div className="space-y-1">
          <span className="text-sm font-medium text-muted-foreground">
            Item Category
          </span>
          <p className="text-base font-medium">
            {inspection.batch?.itemCategory || "N/A"}
          </p>
        </div>
        <div className="space-y-1">
          <span className="text-sm font-medium text-muted-foreground">
            Supplier
          </span>
          <p className="text-base font-medium">
            {inspection.batch?.supplierName || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InspectionBatchDetails;

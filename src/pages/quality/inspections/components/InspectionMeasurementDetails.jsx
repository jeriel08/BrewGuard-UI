import React from "react";

const InspectionMeasurementDetails = ({ inspection }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Measurement</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <span className="text-sm font-medium text-muted-foreground">
            Moisture Content
          </span>
          <p className="text-base font-medium">{inspection.moistureContent}%</p>
        </div>

        {inspection.batch?.itemCategory !== "Raw Material" && (
          <>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Roast Color
              </span>
              <p className="text-base font-medium">
                {inspection.roastColor || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Cupping Score
              </span>
              <p className="text-base font-medium">{inspection.cuppingScore}</p>
            </div>
          </>
        )}

        <div className="space-y-1">
          <span className="text-sm font-medium text-muted-foreground">
            Defect Count
          </span>
          <p className="text-base font-medium">{inspection.defectCount}</p>
        </div>
      </div>
    </div>
  );
};

export default InspectionMeasurementDetails;

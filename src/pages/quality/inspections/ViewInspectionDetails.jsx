import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInspectionById } from "@/features/inspections/api/inspectionService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Components
import InspectionHeader from "./components/InspectionHeader";
import InspectionBatchDetails from "./components/InspectionBatchDetails";
import InspectionMeasurementDetails from "./components/InspectionMeasurementDetails";
import InspectionEvidenceDetails from "./components/InspectionEvidenceDetails";
import InspectionRemarksDetails from "./components/InspectionRemarksDetails";

const ViewInspectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const data = await getInspectionById(id);
        setInspection(data);
      } catch (error) {
        console.error("Failed to load inspection details", error);
        toast.error("Error", {
          description: "Failed to load inspection details.",
        });
        navigate("/inspections");
      } finally {
        setLoading(false);
      }
    };
    fetchInspection();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!inspection) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:px-8 md:pt-4 pt-6 w-full max-w-4xl mx-auto items-center">
      <InspectionHeader inspection={inspection} />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Inspection Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InspectionBatchDetails inspection={inspection} />

          <Separator />

          <InspectionMeasurementDetails inspection={inspection} />

          <Separator />

          <InspectionEvidenceDetails inspection={inspection} />

          <Separator />

          <InspectionRemarksDetails inspection={inspection} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewInspectionDetails;

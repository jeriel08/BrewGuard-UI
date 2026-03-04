import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getBatches } from "@/features/inventory/inventoryService";
import { submitInspection } from "@/features/inspections/api/inspectionService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BatchSection } from "./components/BatchSection";
import { MeasurementSection } from "./components/MeasurementSection";
import { EvidenceSection } from "./components/EvidenceSection";
import { RemarksSection } from "./components/RemarksSection";
import { InspectionSummaryDialog } from "./components/InspectionSummaryDialog";

const formSchema = z.object({
  batchId: z.string().min(1, "Batch is required"),
  moistureContent: z.coerce
    .number()
    .min(0, "Must be at least 0")
    .max(100, "Must be at most 100"),
  cuppingScore: z.coerce
    .number()
    .min(0, "Must be at least 0")
    .max(100, "Must be at most 100"),
  defectCount: z.coerce.number().min(0, "Must be non-negative"),
  secondaryDefects: z.coerce.number().min(0, "Must be non-negative").optional(),
  dominantDefect: z.string().optional(),
  roastColor: z.string().optional(), // Agtron scale input
  remarks: z.string().optional(),
  evidencePhoto: z.any().optional(),
});

const CreateInspection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get("batchId");

  // If no batchId, redirect back to inspections (safety check)
  useEffect(() => {
    if (!batchId) {
      toast.error("Invalid Access", {
        description: "No batch selected for inspection.",
      });
      navigate("/inspections");
    }
  }, [batchId, navigate]);

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loadingBatch, setLoadingBatch] = useState(true);
  const [preview, setPreview] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  // Define form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchId: batchId || "",
      moistureContent: 0,
      cuppingScore: 0,
      defectCount: 0,
      secondaryDefects: 0,
      dominantDefect: "",
      roastColor: "",
      remarks: "",
    },
  });

  // Fetch the SPECIFIC batch details
  // Note: currently getBatches fetches all.
  // Optimization: In real world, we'd have getBatchById endpoint.
  // For now, we fetch all and find.
  useEffect(() => {
    const fetchBatchDetails = async () => {
      if (!batchId) return;

      setLoadingBatch(true);
      try {
        const data = await getBatches();
        const batch = data.find((b) => b.id.toString() === batchId);

        if (batch) {
          setSelectedBatch(batch);
        } else {
          toast.error("Error", { description: "Batch not found." });
          navigate("/inspections");
        }
      } catch (error) {
        console.error("Failed to load batch details", error);
        toast.error("Error", {
          description: "Failed to load batch details.",
        });
      } finally {
        setLoadingBatch(false);
      }
    };
    fetchBatchDetails();
  }, [batchId, navigate]);

  const onSubmit = async (values) => {
    setPendingPayload(values);
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    if (!pendingPayload) return;
    try {
      const formData = new FormData();
      // Use batchId from URL param if available, otherwise form value, to ensure reliability
      formData.append("BatchId", parseInt(batchId || pendingPayload.batchId));

      // Optional fields - send only if present/valid or let backend handle nulls
      if (
        pendingPayload.moistureContent !== undefined &&
        pendingPayload.moistureContent !== null
      )
        formData.append("MoistureContent", pendingPayload.moistureContent);

      if (
        pendingPayload.cuppingScore !== undefined &&
        pendingPayload.cuppingScore !== null
      )
        formData.append("CuppingScore", pendingPayload.cuppingScore);

      if (
        pendingPayload.defectCount !== undefined &&
        pendingPayload.defectCount !== null
      )
        formData.append("DefectCount", pendingPayload.defectCount);

      if (
        pendingPayload.secondaryDefects !== undefined &&
        pendingPayload.secondaryDefects !== null
      ) {
        formData.append("SecondaryDefects", pendingPayload.secondaryDefects);
      }
      if (pendingPayload.roastColor)
        formData.append("RoastColor", pendingPayload.roastColor);
      if (pendingPayload.dominantDefect) {
        formData.append("DominantDefect", pendingPayload.dominantDefect);
      }

      // Handle Remarks with Dominant Defect info
      let finalRemarks = pendingPayload.remarks || "";
      if (pendingPayload.dominantDefect) {
        // Append defect info using bullet/formal style
        const defectInfo = `\n\nDefect Detected: ${pendingPayload.dominantDefect}`;
        finalRemarks += defectInfo;
      }
      if (finalRemarks) formData.append("Remarks", finalRemarks.trim());

      if (pendingPayload.evidencePhoto?.[0]) {
        formData.append("EvidencePhoto", pendingPayload.evidencePhoto[0]);
      }

      await submitInspection(formData);

      toast.success("Inspection Submitted", {
        description: "The quality inspection has been recorded.",
      });
      navigate("/inspections");
      setShowConfirm(false);
      setPendingPayload(null);
    } catch (error) {
      console.error(error);
      toast.error("Submission Failed", {
        description:
          typeof error.response?.data === "string"
            ? error.response.data
            : JSON.stringify(error.response?.data) ||
              "Could not submit inspection.",
      });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  if (loadingBatch) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:px-8 md:pt-4 pt-6 w-full max-w-4xl mx-auto items-center">
      <div className="flex flex-col gap-2 text-center w-full relative">
        <h2 className="text-3xl font-bold tracking-tight">
          Conduct Inspection
        </h2>
        <p className="text-muted-foreground">
          Submit detailed quality analysis for a coffee batch.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Inspection Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <BatchSection form={form} selectedBatch={selectedBatch} />

              <Separator />

              <MeasurementSection
                form={form}
                itemCategory={selectedBatch?.itemCategory}
              />

              <Separator />

              <EvidenceSection
                form={form}
                preview={preview}
                handlePhotoChange={handlePhotoChange}
              />

              <Separator />

              <RemarksSection form={form} />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/inspections")}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Inspection
            </Button>
          </div>
        </form>
      </Form>

      <InspectionSummaryDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        pendingPayload={pendingPayload}
        selectedBatch={selectedBatch}
        onConfirm={handleConfirmSubmit}
        loading={form.formState.isSubmitting}
      />
    </div>
  );
};

export default CreateInspection;

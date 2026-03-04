import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { RoastCoffeeSummaryDialog } from "./RoastCoffeeSummaryDialog";

/**
 * RoastCoffeeForm
 * @param {Object} props
 * @param {Array} props.rawMaterialBatches - List of available raw material batches
 * @param {Array} props.finishedProductItems - List of item definitions for Finished Products
 * @param {Function} props.onSubmit - Callback to handle form submission (async)
 * @param {Function} props.onCancel - Callback to close the form
 */
export function RoastCoffeeForm({
  rawMaterialBatches,
  finishedProductItems,
  onSubmit,
  onCancel,
  className,
  editData,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rawMaterialBatchId: editData?.sourceBatchId?.toString() || "",
    rawMaterialQuantityUsed:
      editData?.rawMaterialQuantityUsed?.toString() || "",
    producedItemId: editData?.itemId?.toString() || "",
    producedQuantity: editData?.initialQuantity?.toString() || "",
  });
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  // Filter batches to only show "Approved" ones, or the original source if editing
  const availableBatches = useMemo(() => {
    return rawMaterialBatches.filter(
      (batch) =>
        batch.status === "Approved" ||
        (editData && batch.id === editData.sourceBatchId),
    );
  }, [rawMaterialBatches, editData]);

  // Get selected batch details to valid quantity
  const selectedBatch = useMemo(() => {
    if (!formData.rawMaterialBatchId) return null;
    return availableBatches.find(
      (b) => b.id.toString() === formData.rawMaterialBatchId,
    );
  }, [formData.rawMaterialBatchId, availableBatches]);

  const validate = () => {
    const newErrors = {};

    if (!formData.rawMaterialBatchId)
      newErrors.rawMaterialBatchId = "Raw Material Batch is required";

    if (
      !formData.rawMaterialQuantityUsed ||
      formData.rawMaterialQuantityUsed <= 0
    )
      newErrors.rawMaterialQuantityUsed =
        "Quantity Used must be greater than 0";

    if (
      selectedBatch &&
      parseFloat(formData.rawMaterialQuantityUsed) >
        selectedBatch.currentQuantity + (editData?.rawMaterialQuantityUsed || 0)
    ) {
      newErrors.rawMaterialQuantityUsed = `Exceeds available quantity (${selectedBatch.currentQuantity + (editData?.rawMaterialQuantityUsed || 0)})`;
    }

    if (!formData.producedItemId)
      newErrors.producedItemId = "Produced Item is required";

    if (!formData.producedQuantity || formData.producedQuantity <= 0)
      newErrors.producedQuantity = "Produced Quantity must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedRawMaterial = availableBatches.find(
      (b) => b.id.toString() === formData.rawMaterialBatchId,
    );
    const selectedFinishedProduct = finishedProductItems.find(
      (i) => i.id.toString() === formData.producedItemId,
    );

    const payload = {
      rawMaterialBatchId: parseInt(formData.rawMaterialBatchId),
      rawMaterialName: selectedRawMaterial?.itemName || "Unknown Raw Material",
      rawMaterialUnit: selectedRawMaterial?.unitOfMeasurement || "kg",
      rawMaterialQuantityUsed: parseFloat(formData.rawMaterialQuantityUsed),
      producedItemId: parseInt(formData.producedItemId),
      producedItemName: selectedFinishedProduct?.name || "Unknown Product",
      producedItemUnit: selectedFinishedProduct?.unitOfMeasurement || "kg",
      producedQuantity: parseFloat(formData.producedQuantity),
    };

    setPendingPayload(payload);
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    if (!pendingPayload) return;
    setLoading(true);
    try {
      await onSubmit({
        rawMaterialBatchId: pendingPayload.rawMaterialBatchId,
        rawMaterialQuantityUsed: pendingPayload.rawMaterialQuantityUsed,
        producedItemId: pendingPayload.producedItemId,
        producedQuantity: pendingPayload.producedQuantity,
      });
      setShowConfirm(false);
      setPendingPayload(null);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className || ""}`}>
      {/* Raw Material Batch Select */}
      <div className="space-y-2">
        <Label htmlFor="rawMaterialBatchId">Raw Material Batch Used</Label>
        <Select
          onValueChange={(val) => handleChange("rawMaterialBatchId", val)}
          value={formData.rawMaterialBatchId}
        >
          <SelectTrigger id="rawMaterialBatchId" className="w-full">
            <SelectValue placeholder="Select raw material batch" />
          </SelectTrigger>
          <SelectContent position="popper">
            {availableBatches.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground text-center">
                No approved raw material batches available.
              </div>
            ) : (
              availableBatches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id.toString()}>
                  Batch #{batch.id} - {batch.itemName} (Qty:{" "}
                  {batch.currentQuantity})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.rawMaterialBatchId && (
          <p className="text-sm text-destructive">
            {errors.rawMaterialBatchId}
          </p>
        )}
      </div>

      {/* Quantity Used Input */}
      <div className="space-y-2">
        <Label htmlFor="rawMaterialQuantityUsed">Quantity Used</Label>
        <Input
          id="rawMaterialQuantityUsed"
          type="number"
          step="0.01"
          placeholder="Enter quantity to process"
          value={formData.rawMaterialQuantityUsed}
          onChange={(e) =>
            handleChange("rawMaterialQuantityUsed", e.target.value)
          }
        />
        {errors.rawMaterialQuantityUsed && (
          <p className="text-sm text-destructive">
            {errors.rawMaterialQuantityUsed}
          </p>
        )}
      </div>

      {/* Produced Item Select */}
      <div className="space-y-2">
        <Label htmlFor="producedItemId">Produced Item (Finished Good)</Label>
        <Select
          onValueChange={(val) => handleChange("producedItemId", val)}
          value={formData.producedItemId}
        >
          <SelectTrigger id="producedItemId" className="w-full">
            <SelectValue placeholder="Select finished product" />
          </SelectTrigger>
          <SelectContent position="popper">
            {finishedProductItems.map((item) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {item.name} ({item.unitOfMeasurement})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.producedItemId && (
          <p className="text-sm text-destructive">{errors.producedItemId}</p>
        )}
      </div>

      {/* Produced Quantity Input */}
      <div className="space-y-2">
        <Label htmlFor="producedQuantity">Produced Quantity</Label>
        <Input
          id="producedQuantity"
          type="number"
          step="0.01"
          placeholder="Enter output quantity"
          value={formData.producedQuantity}
          onChange={(e) => handleChange("producedQuantity", e.target.value)}
        />
        {errors.producedQuantity && (
          <p className="text-sm text-destructive">{errors.producedQuantity}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Roast Coffee
        </Button>
      </div>

      <RoastCoffeeSummaryDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        pendingPayload={pendingPayload}
        isEdit={!!editData}
        onConfirm={handleConfirmSubmit}
        loading={loading}
      />
    </form>
  );
}

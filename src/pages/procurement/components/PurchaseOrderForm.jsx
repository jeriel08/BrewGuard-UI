import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SupplierSelect } from "./SupplierSelect";
import { PurchaseOrderItems } from "./PurchaseOrderItems";
import { DatePicker } from "./DatePicker";
import { PurchaseOrderSummaryDialog } from "./PurchaseOrderSummaryDialog";

export function PurchaseOrderForm({
  suppliers = [],
  items = [],
  initialData = null,
  initialItemId = null,
  onSubmitAction,
  submitLabel = "Create Purchase Order",
  className,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      invoiceNumber: "",
      supplierId: null,
      expectedDeliveryDate: "",
      items: [
        {
          itemId: initialItemId ? Number(initialItemId) : null,
          quantityToSend: "",
          unitCost: "",
        },
      ],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        invoiceNumber: initialData.invoiceNumber || "",
        supplierId: initialData.supplierName
          ? suppliers.find((s) => s.name === initialData.supplierName)?.id ||
            null
          : null,
        expectedDeliveryDate: initialData.expectedDeliveryDate || "",
        items: initialData.batches?.map((batch) => ({
          itemId: items.find((i) => i.name === batch.itemName)?.id || null,
          quantityToSend: batch.initialQuantity || "",
          unitCost: batch.actualUnitCost || "",
        })) || [{ itemId: null, quantityToSend: "", unitCost: "" }],
      });
    }
  }, [initialData, items, suppliers, reset]);

  const watchSupplierId = watch("supplierId");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (!data.supplierId) {
        toast.error("Please select a supplier.");
        setError("supplierId", {
          type: "manual",
          message: "Supplier is required",
        });
        setLoading(false);
        return;
      }
      if (!data.expectedDeliveryDate) {
        toast.error("Please select an expected delivery date.");
        setError("expectedDeliveryDate", {
          type: "manual",
          message: "Date is required",
        });
        setLoading(false);
        return;
      }

      const selectedDate = new Date(data.expectedDeliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      // Only check past date if creating a new order (no initialData)
      if (!initialData && selectedDate < today) {
        toast.error("Expected delivery date cannot be in the past.");
        setLoading(false);
        return;
      }

      if (!data.items || data.items.length === 0) {
        toast.error("Please add at least one item.");
        setLoading(false);
        return;
      }

      const itemsHasError = data.items.some((item, index) => {
        let hasErr = false;
        if (!item.itemId) {
          setError(`items.${index}.itemId`, {
            type: "manual",
            message: "Item is required",
          });
          hasErr = true;
        }
        return hasErr;
      });

      if (itemsHasError) {
        setLoading(false);
        return;
      }

      const payload = {
        invoiceNumber: data.invoiceNumber,
        supplierId: parseInt(data.supplierId),
        supplierName:
          suppliers.find((s) => s.id === parseInt(data.supplierId))?.name ||
          "Unknown Supplier",
        expectedDeliveryDate: (() => {
          const d = new Date(data.expectedDeliveryDate);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        })(),
        items: data.items.map((item) => {
          const mapped = {
            itemId: parseInt(item.itemId),
            itemName:
              items.find((i) => i.id === parseInt(item.itemId))?.name ||
              "Unknown Item",
            quantity: parseFloat(item.quantityToSend),
          };
          if (
            item.unitCost != null &&
            !isNaN(item.unitCost) &&
            item.unitCost !== ""
          ) {
            mapped.unitCost = parseFloat(item.unitCost);
          }
          return mapped;
        }),
      };

      setPendingPayload(payload);
      setShowConfirm(true);
    } catch (error) {
      console.error("Validation error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!pendingPayload) return;
    setLoading(true);
    try {
      await onSubmitAction(pendingPayload);
    } catch (error) {
      console.error("Failed to submit PO", error);
      const errorMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.title || "Failed to process Purchase Order.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setPendingPayload(null);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("space-y-6 w-full text-left", className)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">
              Invoice Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="invoiceNumber"
              {...register("invoiceNumber", {
                required: "Invoice Number is required",
              })}
              placeholder="INV-2024-001"
              required
              aria-invalid={errors.invoiceNumber ? "true" : "false"}
            />
            {errors.invoiceNumber && (
              <p className="text-sm text-red-500">
                {errors.invoiceNumber.message}
              </p>
            )}
          </div>

          <DatePicker
            label="Expected Delivery Date"
            value={watch("expectedDeliveryDate")}
            onChange={(date) =>
              setValue("expectedDeliveryDate", date, { shouldValidate: true })
            }
            error={errors.expectedDeliveryDate?.message}
            required={true}
            disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
          />

          <SupplierSelect
            suppliers={suppliers}
            value={watchSupplierId}
            onChange={(val) => setValue("supplierId", val)}
            error={errors.supplierId?.message}
            required={true}
          />
        </div>

        <PurchaseOrderItems
          control={control}
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          items={items}
        />

        <div className="flex justify-center gap-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/purchase-orders")}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>

      <PurchaseOrderSummaryDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        pendingPayload={pendingPayload}
        initialData={initialData}
        onConfirm={handleConfirmSubmit}
        loading={loading}
      />
    </>
  );
}

import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PurchaseOrderItemRow } from "./PurchaseOrderItemRow";
import { Separator } from "@/components/ui/separator";

export function PurchaseOrderItems({
  control,
  register,
  setValue,
  watch,
  errors,
  items,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Items</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ itemId: "", quantityToSend: "", unitCost: "" })
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="space-y-4 border rounded-md p-4 bg-muted/20">
        {fields.map((field, index) => (
          <div key={field.id}>
            <PurchaseOrderItemRow
              index={index}
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
              items={items}
              remove={remove}
              isOnly={fields.length === 1}
            />
            {index < fields.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </div>
    </div>
  );
}

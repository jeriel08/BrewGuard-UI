import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { ItemSelect } from "./ItemSelect";

export function PurchaseOrderItemRow({
  index,
  field,
  register,
  setValue,
  watch,
  errors,
  items,
  remove,
  isOnly,
}) {
  const itemId = watch(`items.${index}.itemId`);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start md:pt-2">
      {/* Mobile Header */}
      <div className="col-span-12 flex items-center justify-between md:hidden pb-2">
        <h4 className="font-semibold text-sm text-muted-foreground">
          Item #{index + 1}
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive h-8 w-8"
          onClick={() => remove(index)}
          disabled={isOnly}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>

      <div className="col-span-12 md:col-span-5 space-y-2 flex flex-col">
        <Label>
          Item <span className="text-red-500">*</span>
        </Label>
        <ItemSelect
          items={items}
          value={itemId}
          onChange={(val) => {
            setValue(`items.${index}.itemId`, val, { shouldValidate: true });
            // Auto-populate unit cost from item's standard cost
            const selectedItem = items.find((i) => i.id === parseInt(val));
            if (selectedItem?.standardCost != null) {
              setValue(`items.${index}.unitCost`, selectedItem.standardCost);
            }
          }}
          error={errors?.items?.[index]?.itemId?.message}
          required={true}
        />
        {errors?.items?.[index]?.itemId && (
          <p className="text-sm text-red-500">
            {errors.items[index].itemId.message}
          </p>
        )}
      </div>
      <div className="col-span-12 md:col-span-3 space-y-2">
        <Label>
          Quantity <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          step="0.01"
          min="0.01"
          {...register(`items.${index}.quantityToSend`, {
            required: "Quantity is required",
            valueAsNumber: true,
            min: { value: 0.01, message: "Must be > 0" },
          })}
          placeholder="0.00"
          required
          aria-invalid={
            errors?.items?.[index]?.quantityToSend ? "true" : "false"
          }
        />
        {errors?.items?.[index]?.quantityToSend && (
          <p className="text-sm text-red-500">
            {errors.items[index].quantityToSend.message}
          </p>
        )}
      </div>
      <div className="col-span-12 md:col-span-3 space-y-2">
        <Label>Unit Cost (₱)</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          {...register(`items.${index}.unitCost`, {
            valueAsNumber: true,
            min: { value: 0, message: "Cannot be negative" },
          })}
          placeholder="Auto"
        />
        {errors?.items?.[index]?.unitCost && (
          <p className="text-sm text-red-500">
            {errors.items[index].unitCost.message}
          </p>
        )}
      </div>

      {/* Desktop Delete Button */}
      <div className="hidden md:flex col-span-1 flex-col items-center justify-end">
        <Label className="invisible">&nbsp;</Label>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive mt-2"
          onClick={() => remove(index)}
          disabled={isOnly}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
}

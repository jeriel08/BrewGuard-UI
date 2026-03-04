import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { addItem } from "@/features/inventory/inventoryService";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AddItemForm({ className, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleCreateItem = async (data) => {
    setLoading(true);
    try {
      await addItem(data);
      toast.success("Item created successfully!");
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to create item", error);
      toast.error("Failed to create item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleCreateItem)}
      className={cn("grid items-start gap-4 pb-6", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name", { required: true })}
          placeholder="Arabica Beans"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={(val) => setValue("category", val)} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Raw Material">Raw Material</SelectItem>
            <SelectItem value="Finished Goods">Finished Goods</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="unitOfMeasurement">UoM</Label>
        <Input
          id="unitOfMeasurement"
          {...register("unitOfMeasurement", { required: true })}
          placeholder="kg, pcs, liters"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="reorderLevel">Reorder Level</Label>
        <Input
          id="reorderLevel"
          type="number"
          min="0"
          {...register("reorderLevel", {
            required: "Reorder level is required",
            valueAsNumber: true,
            min: { value: 0, message: "Cannot be negative" },
          })}
          placeholder="10"
        />
        {errors.reorderLevel && (
          <p className="text-sm text-red-500">{errors.reorderLevel.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="standardCost">Standard Cost (₱)</Label>
        <Input
          id="standardCost"
          type="number"
          step="0.01"
          min="0"
          {...register("standardCost", {
            required: "Standard cost is required",
            valueAsNumber: true,
            min: { value: 0, message: "Cannot be negative" },
          })}
          placeholder="0.00"
        />
        {errors.standardCost && (
          <p className="text-sm text-red-500">{errors.standardCost.message}</p>
        )}
      </div>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Item
      </Button>
    </form>
  );
}

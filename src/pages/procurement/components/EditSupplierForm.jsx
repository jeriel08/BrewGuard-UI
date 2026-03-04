import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateSupplier } from "@/features/suppliers/supplierService";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function EditSupplierForm({ className, supplier, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: supplier?.name || "",
      contactInfo: supplier?.contactInfo || "",
    },
  });

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        contactInfo: supplier.contactInfo,
      });
    }
  }, [supplier, reset]);

  const handleUpdateSupplier = async (data) => {
    setLoading(true);
    try {
      await updateSupplier(supplier.id, data);
      toast.success("Supplier updated successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to update supplier", error);
      toast.error("Failed to update supplier. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleUpdateSupplier)}
      className={cn("grid items-start gap-4 pb-6", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name", { required: true })}
          placeholder="Supplier Name"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">This field is required</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="contactInfo">Contact Info</Label>
        <Input
          id="contactInfo"
          {...register("contactInfo", { required: true })}
          placeholder="Phone Number or Email"
        />
        {errors.contactInfo && (
          <span className="text-red-500 text-sm">This field is required</span>
        )}
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update Supplier
      </Button>
    </form>
  );
}

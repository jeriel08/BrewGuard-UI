import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addSupplier } from "@/features/suppliers/supplierService";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AddSupplierForm({ className, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleCreateSupplier = async (data) => {
    setLoading(true);
    // Assuming backend handles ID generation and initial scores
    try {
      await addSupplier(data);
      toast.success("Supplier created successfully!");
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to create supplier", error);
      toast.error("Failed to create supplier. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleCreateSupplier)}
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
        Save Supplier
      </Button>
    </form>
  );
}

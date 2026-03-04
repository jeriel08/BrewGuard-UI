import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const BatchSection = ({ form, selectedBatch }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Batch Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <FormLabel>Batch ID</FormLabel>
          <Input
            readOnly
            disabled
            value={selectedBatch?.id || ""}
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Item Name</FormLabel>
          <Input
            readOnly
            disabled
            value={selectedBatch?.itemName || ""}
            placeholder="Auto-filled"
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Supplier</FormLabel>
          <Input
            readOnly
            disabled
            value={selectedBatch?.supplierName || ""}
            placeholder="Auto-filled"
            className="bg-muted"
          />
        </div>

        {/* Hidden Field for Form Submission */}
        <FormField
          control={form.control}
          name="batchId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

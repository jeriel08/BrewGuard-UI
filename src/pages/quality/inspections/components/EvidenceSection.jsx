import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const EvidenceSection = ({ form, preview, handlePhotoChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Evidence (If Applicable)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="evidencePhoto"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Upload Photo</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    {...fieldProps}
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const files = event.target.files;
                      onChange(files);
                      handlePhotoChange(event);
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription>Select an image file.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {preview && (
          <div className="md:col-span-1">
            <FormLabel>Preview</FormLabel>
            <div className="mt-2 w-full overflow-hidden rounded-md border">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={preview}
                  alt="Evidence preview"
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

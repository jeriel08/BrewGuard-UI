import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MeasurementSection = ({ form, itemCategory }) => {
  const isRawMaterial = itemCategory === "Raw Material";
  const isFinishedGoods = itemCategory === "Finished Goods";
  // If category is unknown or neither, we might want to show all or minimal.
  // Let's assume if it's explicitly one, we hide others. If unknown, we show all for safety.
  const showAll = !isRawMaterial && !isFinishedGoods;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Measurement</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Moisture Content - Applicable to ALL */}
        <FormField
          control={form.control}
          name="moistureContent"
          render={({ field }) => {
            // Define constraints and helper text based on category
            let maxVal = 100;
            let helperText = "";

            if (isRawMaterial) {
              maxVal = 20;
              helperText =
                "Target Range: 9.0%-12.0%. Values above 13.0 will be auto-rejected.";
            } else if (isFinishedGoods) {
              maxVal = 10;
              helperText = "Target Range: 1.0%-3.0%. Max 5.0%.";
            }

            return (
              <FormItem>
                <FormLabel>Moisture Content (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min={0}
                    max={maxVal}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty string to let user delete content
                      // Prevent negative sign manually
                      if (value.includes("-")) return;

                      if (
                        value === "" ||
                        (parseFloat(value) >= 0 && parseFloat(value) <= maxVal)
                      ) {
                        field.onChange(e);
                      }
                    }}
                  />
                </FormControl>
                {helperText && (
                  <p className="text-[0.8rem] text-muted-foreground">
                    {helperText}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Defect Count - Raw Material Only */}
        {(isRawMaterial || showAll) && (
          <>
            <FormField
              control={form.control}
              name="defectCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Defects (Critical)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <p className="text-[0.8rem] text-muted-foreground">
                    e.g. Mold, Insect Damage
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secondaryDefects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Defects (Quality)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <p className="text-[0.8rem] text-muted-foreground">
                    e.g. Broken/Chipped Beans
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dominant Defect Dropdown - Appears if ANY defect is entered */}
            {(form.watch("defectCount") > 0 ||
              form.watch("secondaryDefects") > 0) && (
              <FormField
                control={form.control}
                name="dominantDefect"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dominant Defect Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dominant defect" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mold / Fungus">
                          Mold / Fungus
                        </SelectItem>
                        <SelectItem value="Insect Damage">
                          Insect Damage
                        </SelectItem>
                        <SelectItem value="Foreign Matter">
                          Foreign Matter
                        </SelectItem>
                        <SelectItem value="Black / Sour Beans">
                          Black / Sour Beans
                        </SelectItem>
                        <SelectItem value="Broken / Chipped">
                          Broken / Chipped
                        </SelectItem>
                        <SelectItem value="Other / Mixed">
                          Other / Mixed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </>
        )}

        {/* Roast Color - Finished Goods Only */}
        {(isFinishedGoods || showAll) && (
          <FormField
            control={form.control}
            name="roastColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roast Color (Agtron Scale)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 55" {...field} />
                </FormControl>
                <p className="text-[0.8rem] text-muted-foreground">
                  Acceptable Range: 35 - 75 (Agtron)
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Cupping Score - Finished Goods Only */}
        {(isFinishedGoods || showAll) && (
          <FormField
            control={form.control}
            name="cuppingScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cupping Score (0-100)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <p className="text-[0.8rem] text-muted-foreground">
                  Minimum: 80
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserSelect } from "@/components/common/UserSelect";
import { DatePicker } from "@/pages/procurement/components/DatePicker";

export function ActionPlanForm({
  formData,
  setFormData,
  handleInputChange,
  user,
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader>
          <CardTitle>Action Plan</CardTitle>
          <CardDescription>
            Define the steps taken to resolve the issue and prevent recurrence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="correctiveAction">Corrective Action</Label>
            <Textarea
              id="correctiveAction"
              placeholder="What action was taken immediately to fix the non-conformance?"
              value={formData.correctiveAction}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preventiveAction">Preventative Action</Label>
            <Textarea
              id="preventiveAction"
              placeholder="What action will be taken to prevent recurrence in the future?"
              value={formData.preventiveAction}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col justify-end">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <UserSelect
                value={formData.assignedTo}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, assignedTo: val }))
                }
                roleFilter={
                  user?.role === "Procurement Officer"
                    ? ["Procurement Officer", "Staff"]
                    : undefined
                }
              />
            </div>
            <DatePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  dueDate: date ? date.toISOString() : "",
                }))
              }
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

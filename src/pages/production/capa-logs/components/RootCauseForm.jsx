import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export function RootCauseForm({
  formData,
  setFormData,
  handleInputChange,
  ncrIdParam,
  selectedNcr,
  loadingNcr,
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader>
          <CardTitle>NCR Details</CardTitle>
          <CardDescription>
            Link this CAPA to a specific Non-Conformance Report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ncrId">NCR ID</Label>
              <Input
                id="ncrId"
                value={ncrIdParam || ""}
                placeholder="Select NCR"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>Severity</Label>
              {loadingNcr ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input value={selectedNcr?.severity || "N/A"} disabled />
              )}
            </div>
            <div className="space-y-2">
              <Label>Batch Info</Label>
              {loadingNcr ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input value={selectedNcr?.batchInfo || "N/A"} disabled />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rootCauseCategory">Root Cause Category</Label>
              <Select
                value={formData.rootCauseCategory}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    rootCauseCategory: value,
                  }))
                }
              >
                <SelectTrigger id="rootCauseCategory">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manpower">Manpower</SelectItem>
                  <SelectItem value="Machine">Machine</SelectItem>
                  <SelectItem value="Material">Material</SelectItem>
                  <SelectItem value="Method">Method</SelectItem>
                  <SelectItem value="Measurement">Measurement</SelectItem>
                  <SelectItem value="Environment">Environment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5 Whys Analysis</CardTitle>
          <CardDescription>
            Perform a step-by-step root cause investigation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="why1">1. Why did the defect occur?</Label>
            <Textarea
              id="why1"
              placeholder="State the immediate problem..."
              value={formData.why1}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="why2">2. Why did that happen?</Label>
            <Textarea
              id="why2"
              placeholder="..."
              value={formData.why2}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="why3">3. Why did that happen?</Label>
            <Textarea
              id="why3"
              placeholder="..."
              value={formData.why3}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="why4">4. Why did that happen?</Label>
            <Textarea
              id="why4"
              placeholder="..."
              value={formData.why4}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="why5">5. Root Cause (Why did that happen?)</Label>
            <Textarea
              id="why5"
              placeholder="Specify the fundamental root cause..."
              value={formData.why5}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

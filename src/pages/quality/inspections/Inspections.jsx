import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getInspections,
  voidInspection,
} from "@/features/inspections/api/inspectionService";
import { getBatches } from "@/features/inventory/inventoryService";
import { InspectionsDataTable } from "./components/InspectionsDataTable";
import { PendingInspectionsTable } from "./components/PendingInspectionsTable";
import { columns } from "./components/columns";
import { pendingColumns } from "./components/pendingColumns";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus, ClipboardList, ClipboardCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/EmptyState";

const Inspections = () => {
  const [inspections, setInspections] = useState([]);
  const [pendingBatches, setPendingBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const [inspectionsData, batchesData] = await Promise.all([
        getInspections(),
        getBatches(),
      ]);
      setInspections(inspectionsData);

      // Filter for pending batches
      const pending = batchesData.filter(
        (b) => b.status === "Pending Inspection",
      );
      setPendingBatches(pending);
    } catch (err) {
      console.error("Failed to load data", err);
      setError("Failed to load inspections data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoidInspection = async (id) => {
    // Basic confirmation - can be improved with a Dialog later
    if (!window.confirm("Are you sure you want to void this inspection?"))
      return;

    try {
      await voidInspection(id);
      toast.success("Inspection Voided", {
        description: `Inspection #${id} has been voided.`,
      });
      fetchInspections();
    } catch (err) {
      toast.error("Error", {
        description: "Failed to void inspection.",
      });
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  return (
    <div className="space-y-6 p-4 md:px-8 md:pt-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inspections</h2>
          <p className="text-muted-foreground">
            Manage quality inspections and view history.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full bg-slate-100" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              {pendingBatches.length === 0 ? (
                <EmptyState
                  icon={ClipboardList}
                  title="No pending inspections"
                  description="Great job! There are no batches waiting for quality inspection right now."
                />
              ) : (
                <PendingInspectionsTable
                  columns={pendingColumns}
                  data={pendingBatches}
                />
              )}
            </TabsContent>
            <TabsContent value="history">
              {inspections.length === 0 ? (
                <EmptyState
                  icon={ClipboardCheck}
                  title="No inspection history"
                  description="You haven't recorded any quality inspections yet."
                />
              ) : (
                <InspectionsDataTable
                  columns={() => columns(handleVoidInspection)}
                  data={inspections}
                  onRefresh={fetchInspections}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Inspections;

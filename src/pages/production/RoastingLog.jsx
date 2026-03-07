import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getItems,
  getBatches,
  createProductionBatch,
  updateProductionBatch,
  getArchivedBatches,
  archiveBatch,
  unarchiveBatch,
} from "@/features/inventory/inventoryService";
import { BatchesDataTable } from "@/pages/inventory/components/BatchesDataTable";
import { batchColumns } from "@/pages/inventory/components/batchColumns";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Flame, Archive, RotateCcw } from "lucide-react"; // Using Flame for Roasting
import { EmptyState } from "@/components/common/EmptyState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoastCoffeeDialog } from "./components/RoastCoffeeDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const RoastingLog = () => {
  const queryClient = useQueryClient();
  const [editingBatch, setEditingBatch] = useState(null);
  const [currentBatchTab, setCurrentBatchTab] = useState("active");

  // Archiving confirmation state
  const [batchToArchive, setBatchToArchive] = useState(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ["inventoryItems"],
    queryFn: getItems,
  });

  const {
    data: batches = [],
    isLoading: loadingBatches,
    isError: errorBatches,
  } = useQuery({
    queryKey: ["batches"],
    queryFn: getBatches,
  });

  const { data: archivedBatches = [] } = useQuery({
    queryKey: ["archivedBatches"],
    queryFn: getArchivedBatches,
  });

  // Filter items for Finished Products only
  const finishedProductItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.category === "Finished Product" ||
        item.category === "Finished Goods",
    );
  }, [items]);

  // Filter batches for Finished Products only
  const finishedProductBatches = useMemo(() => {
    const finishedProductNames = new Set(
      finishedProductItems.map((i) => i.name),
    );
    return batches.filter((batch) => finishedProductNames.has(batch.itemName));
  }, [batches, finishedProductItems]);

  const archivedFinishedProductBatches = useMemo(() => {
    const finishedProductNames = new Set(
      finishedProductItems.map((i) => i.name),
    );
    return archivedBatches.filter((batch) =>
      finishedProductNames.has(batch.itemName),
    );
  }, [archivedBatches, finishedProductItems]);

  // Filter batches for Raw Materials (Source of roasting)
  const rawMaterialBatches = useMemo(() => {
    // Determine raw material item names first
    const rawMaterialItemNames = new Set(
      items
        .filter(
          (item) =>
            item.category === "Raw Material" ||
            item.category === "Raw Materials",
        )
        .map((i) => i.name),
    );
    // Filter batches that match these names AND have quantity > 0 or are the source batch of the edited entry
    return batches.filter(
      (batch) =>
        rawMaterialItemNames.has(batch.itemName) &&
        (batch.currentQuantity > 0 ||
          (editingBatch && batch.id === editingBatch.sourceBatchId)),
    );
  }, [batches, items, editingBatch]);

  const handleRoastCoffee = async (data) => {
    try {
      await createProductionBatch(data);
      toast.success("Coffee Roasted Successfully", {
        description: `Produced ${data.producedQuantity} units.`,
      });
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      queryClient.invalidateQueries({ queryKey: ["archivedBatches"] });
    } catch (error) {
      console.error("Failed to roast coffee", error);
      toast.error("Error", {
        description:
          error.response?.data || "Failed to create production batch.",
      });
    }
  };

  const handleEditBatch = (batch) => {
    setEditingBatch(batch);
  };

  const handleUpdateRoast = async (data) => {
    try {
      await updateProductionBatch(editingBatch.id, data);
      toast.success("Roasting Log Updated", {
        description: `Successfully updated the production batch.`,
      });
      setEditingBatch(null);
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      queryClient.invalidateQueries({ queryKey: ["archivedBatches"] });
    } catch (error) {
      console.error("Failed to update roasting log", error);
      toast.error("Error", {
        description:
          error.response?.data || "Failed to update production batch.",
      });
    }
  };

  const handleArchiveClick = (id) => {
    setBatchToArchive(id);
    setIsArchiveModalOpen(true);
  };

  const confirmArchiveBatch = async () => {
    if (!batchToArchive) return;
    try {
      await archiveBatch(batchToArchive);
      toast.success("Roasting log archived successfully");
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      queryClient.invalidateQueries({ queryKey: ["archivedBatches"] });
    } catch (error) {
      toast.error("Failed to archive roasting log");
      console.error(error);
    } finally {
      setIsArchiveModalOpen(false);
      setBatchToArchive(null);
    }
  };

  const handleRestoreBatch = async (id) => {
    try {
      await unarchiveBatch(id);
      toast.success("Roasting log restored successfully");
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      queryClient.invalidateQueries({ queryKey: ["archivedBatches"] });
    } catch (error) {
      toast.error("Failed to restore roasting log");
      console.error(error);
    }
  };

  const extendedColumns = useMemo(() => {
    const totalCostColumn = {
      accessorKey: "actualUnitCost",
      header: "Total Cost",
      cell: ({ row }) => {
        const unitCost = row.getValue("actualUnitCost") || 0;
        const quantity = row.original.currentQuantity || 0;
        return `₱${(unitCost * quantity).toFixed(2)}`;
      },
    };

    const actionColumn = {
      id: "actions",
      cell: ({ row }) => {
        const batch = row.original;

        if (currentBatchTab === "archived") {
          return (
            <div className="flex h-8 justify-center items-center">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRestoreBatch(batch.id)}
                      className="h-8 w-8"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Restore Batch</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        }

        return (
          <div className="flex items-center space-x-2">
            {batch.status === "Pending Inspection" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditBatch(batch)}
                    >
                      <PenLine className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Batch</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {batch.status === "Approved" && (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleArchiveClick(batch.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Archive Batch</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
    };

    const baseColumns = batchColumns.filter(
      (c) =>
        c.accessorKey !== "dateReceived" &&
        c.accessorKey !== "supplierName" &&
        c.accessorKey !== "actualUnitCost",
    );

    return [...baseColumns, totalCostColumn, actionColumn];
  }, [currentBatchTab]);

  return (
    <div className="space-y-6 p-4 md:px-8 md:pt-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Roasting Log</h2>
          <p className="text-muted-foreground">
            Track production batches and finished goods.
          </p>
        </div>
        <div>
          <RoastCoffeeDialog
            rawMaterialBatches={rawMaterialBatches}
            finishedProductItems={finishedProductItems}
            onSubmit={handleRoastCoffee}
          />

          {editingBatch && (
            <RoastCoffeeDialog
              open={!!editingBatch}
              onOpenChange={(isOpen) => !isOpen && setEditingBatch(null)}
              rawMaterialBatches={rawMaterialBatches}
              finishedProductItems={finishedProductItems}
              onSubmit={handleUpdateRoast}
              editData={editingBatch}
            />
          )}
        </div>
      </div>

      <AlertDialog
        open={isArchiveModalOpen}
        onOpenChange={setIsArchiveModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Roasting Log</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this roasting log? It will be
              moved to the Archived Batches tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!batchToArchive}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmArchiveBatch}
              disabled={!batchToArchive}
            >
              Archive Log
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs
        defaultValue="active"
        value={currentBatchTab}
        onValueChange={setCurrentBatchTab}
        className="space-y-4"
      >
        <TabsList className="mb-2 grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="active">Active Batches</TabsTrigger>
          <TabsTrigger value="archived">Archived Batches</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {loadingBatches ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full bg-slate-100" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : errorBatches ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorBatches}</AlertDescription>
            </Alert>
          ) : finishedProductBatches.length === 0 ? (
            <EmptyState
              icon={Flame}
              title="No roasting logs yet"
              description="No finished product batches found. Start by roasting some coffee!"
            />
          ) : (
            <BatchesDataTable
              columns={extendedColumns}
              data={finishedProductBatches}
              onEdit={handleEditBatch}
              onArchive={handleArchiveClick}
              isArchived={false}
            />
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {loadingBatches ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : errorBatches ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorBatches}</AlertDescription>
            </Alert>
          ) : archivedFinishedProductBatches.length === 0 ? (
            <EmptyState
              icon={Archive}
              title="No archived roasting logs"
              description="Archived finished product batches will appear here."
            />
          ) : (
            <BatchesDataTable
              columns={extendedColumns}
              data={archivedFinishedProductBatches}
              onRestore={handleRestoreBatch}
              isArchived={true}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoastingLog;

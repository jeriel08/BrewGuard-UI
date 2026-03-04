import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  getItems,
  getBatches,
  getArchivedBatches,
  archiveBatch,
  unarchiveBatch,
} from "@/features/inventory/inventoryService";
import { BatchesDataTable } from "./components/BatchesDataTable";
import { batchColumns } from "./components/batchColumns";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Package, Plus, Archive, RotateCcw } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const RawMaterials = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "Super Admin";

  const [items, setItems] = useState([]);
  const [batches, setBatches] = useState([]);
  const [archivedBatches, setArchivedBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [errorBatches, setErrorBatches] = useState(null);
  const [currentBatchTab, setCurrentBatchTab] = useState("active");

  const fetchItems = async () => {
    try {
      const activeItems = await getItems();
      setItems(activeItems);
    } catch (err) {
      console.error("Failed to load items for raw materials filter", err);
    }
  };

  const fetchBatches = async () => {
    setLoadingBatches(true);
    try {
      const [activeData, archivedData] = await Promise.all([
        getBatches(),
        getArchivedBatches(),
      ]);
      setBatches(activeData);
      setArchivedBatches(archivedData);
    } catch (err) {
      console.error("Failed to load batches", err);
      setErrorBatches("Failed to load batches. Please try again.");
    } finally {
      setLoadingBatches(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchBatches();
  }, []);

  const handleArchiveBatch = async (id) => {
    try {
      await archiveBatch(id);
      toast.success("Batch archived successfully");
      fetchBatches();
    } catch (error) {
      toast.error("Failed to archive batch");
      console.error(error);
    }
  };

  const handleRestoreBatch = async (id) => {
    try {
      await unarchiveBatch(id);
      toast.success("Batch restored successfully");
      fetchBatches();
    } catch (error) {
      toast.error("Failed to restore batch");
      console.error(error);
    }
  };

  // Filter items for Raw Materials only (used for filtering batches by raw material)
  const rawMaterialItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.category === "Raw Material" || item.category === "Raw Materials",
    );
  }, [items]);

  const rawMaterialNames = useMemo(
    () => new Set(rawMaterialItems.map((i) => i.name)),
    [rawMaterialItems],
  );

  // Filter batches for Raw Materials only
  const activeRawMaterialBatches = useMemo(() => {
    return batches.filter((batch) => rawMaterialNames.has(batch.itemName));
  }, [batches, rawMaterialNames]);

  const archivedRawMaterialBatches = useMemo(() => {
    return archivedBatches.filter((batch) =>
      rawMaterialNames.has(batch.itemName),
    );
  }, [archivedBatches, rawMaterialNames]);

  const currentBatchColumns = useMemo(() => {
    const actionColumn = {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const batch = row.original;
        if (currentBatchTab === "archived") {
          return isSuperAdmin ? (
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
          ) : null;
        }

        // Only show Archive if Quantity is 0 or Status is Rejected
        if (batch.currentQuantity === 0 || batch.status === "Rejected") {
          return (
            <div className="flex h-8 justify-center items-center">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleArchiveBatch(batch.id)}
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
            </div>
          );
        }
        return null;
      },
    };
    return [...batchColumns, actionColumn];
  }, [currentBatchTab, isSuperAdmin]);

  return (
    <div className="space-y-6 p-4 md:px-8 md:pt-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Raw Materials</h2>
          <p className="text-muted-foreground">
            Manage your raw material batches.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link to="/purchase-orders/new">
              <Plus className="h-4 w-4" /> Add Batch
            </Link>
          </Button>
        </div>
      </div>

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
          ) : activeRawMaterialBatches.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No active batches"
              description="Active batches will appear here."
              action={
                <Button asChild>
                  <Link to="/purchase-orders/new">
                    <Plus className="h-4 w-4" /> Add Batch
                  </Link>
                </Button>
              }
            />
          ) : (
            <BatchesDataTable
              columns={currentBatchColumns}
              data={activeRawMaterialBatches}
              onArchive={handleArchiveBatch}
              isArchived={false}
              isSuperAdmin={isSuperAdmin}
            />
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {loadingBatches ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : archivedRawMaterialBatches.length === 0 ? (
            <EmptyState
              icon={Archive}
              title="No archived batches"
              description="Archived batches will appear here."
            />
          ) : (
            <BatchesDataTable
              columns={currentBatchColumns}
              data={archivedRawMaterialBatches}
              onRestore={handleRestoreBatch}
              isArchived={true}
              isSuperAdmin={isSuperAdmin}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RawMaterials;

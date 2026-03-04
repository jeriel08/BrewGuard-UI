import React, { useEffect, useState } from "react";
import {
  getSuppliers,
  getArchivedSuppliers,
  archiveSupplier,
  unarchiveSupplier,
} from "@/features/suppliers/supplierService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { SupplierDataTable } from "./components/SupplierDataTable";
import { columns } from "./components/columns";
import { AddSupplierDialog } from "./components/AddSupplierDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Package, Archive } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/common/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SupplierPage = () => {
  const { user } = useAuth();
  const [activeSuppliers, setActiveSuppliers] = useState([]);
  const [archivedSuppliers, setArchivedSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState("active");
  const [supplierToArchive, setSupplierToArchive] = useState(null);
  const [supplierToRestore, setSupplierToRestore] = useState(null);

  const isSuperAdmin = user?.role === "Super Admin";

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const [active, archived] = await Promise.all([
        getSuppliers(),
        getArchivedSuppliers(),
      ]);
      setActiveSuppliers(active);
      setArchivedSuppliers(archived);
    } catch (err) {
      console.error("Failed to load suppliers", err);
      setError("Failed to load suppliers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleArchive = async () => {
    if (!supplierToArchive) return;
    try {
      await archiveSupplier(supplierToArchive.id);
      toast.success("Supplier archived successfully");
      setSupplierToArchive(null);
      fetchSuppliers();
    } catch (error) {
      toast.error("Failed to archive supplier");
    }
  };

  const handleRestore = async () => {
    if (!supplierToRestore) return;
    try {
      await unarchiveSupplier(supplierToRestore.id);
      toast.success("Supplier restored successfully");
      setSupplierToRestore(null);
      fetchSuppliers();
    } catch (error) {
      toast.error("Failed to restore supplier");
    }
  };

  return (
    <div className="space-y-6 p-4 md:px-8 md:pt-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <p className="text-muted-foreground">
            Manage your suppliers and their details.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AddSupplierDialog onSupplierAdded={fetchSuppliers} />
        </div>
      </div>

      <Tabs
        defaultValue="active"
        value={currentTab}
        onValueChange={setCurrentTab}
        className="space-y-4"
      >
        <TabsList className="mb-2 grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="active">Active Suppliers</TabsTrigger>
          <TabsTrigger value="archived">Archived Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full bg-slate-100" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : activeSuppliers.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No active suppliers"
              description="Active suppliers will appear here."
              action={<AddSupplierDialog onSupplierAdded={fetchSuppliers} />}
            />
          ) : (
            <SupplierDataTable
              columns={columns}
              data={activeSuppliers}
              onRefresh={fetchSuppliers}
              onArchive={setSupplierToArchive}
              isArchived={false}
            />
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : archivedSuppliers.length === 0 ? (
            <EmptyState
              icon={Archive}
              title="No archived suppliers"
              description="Archived suppliers will appear here."
            />
          ) : (
            <SupplierDataTable
              columns={columns}
              data={archivedSuppliers}
              onRefresh={fetchSuppliers}
              onRestore={isSuperAdmin ? setSupplierToRestore : null}
              isArchived={true}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Archive Confirmation Dialog */}
      <Dialog
        open={!!supplierToArchive}
        onOpenChange={(open) => !open && setSupplierToArchive(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Archive</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive{" "}
              <span className="font-medium text-foreground">
                {supplierToArchive?.name}
              </span>
              ? This supplier will be moved to the archived list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSupplierToArchive(null)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleArchive}>
              Archive Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog
        open={!!supplierToRestore}
        onOpenChange={(open) => !open && setSupplierToRestore(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Restore</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore{" "}
              <span className="font-medium text-foreground">
                {supplierToRestore?.name}
              </span>
              ? This supplier will be moved back to the active list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSupplierToRestore(null)}
            >
              Cancel
            </Button>
            <Button variant="default" onClick={handleRestore}>
              Restore Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierPage;

import React, { useEffect, useState } from "react";
import {
  getItems,
  getArchivedItems,
  archiveItem,
  unarchiveItem,
} from "@/features/inventory/inventoryService";
import { ItemsDataTable } from "./components/ItemsDataTable";
import { createColumns } from "./components/columns"; // Use named import
import { AddItemDialog } from "./components/AddItemDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Inventory = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "Super Admin";

  // Items State
  const [items, setItems] = useState([]);
  const [archivedItems, setArchivedItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [errorItems, setErrorItems] = useState(null);
  const [currentItemTab, setCurrentItemTab] = useState("active");

  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const [active, archived] = await Promise.all([
        getItems(),
        getArchivedItems(),
      ]);
      setItems(active);
      setArchivedItems(archived);
    } catch (err) {
      console.error("Failed to load inventory items", err);
      setErrorItems("Failed to load items. Please try again.");
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // --- Handlers ---

  const handleArchiveItem = async (id) => {
    try {
      await archiveItem(id);
      toast.success("Item archived successfully");
      fetchItems();
    } catch (error) {
      toast.error("Failed to archive item");
      console.error(error);
    }
  };

  const handleRestoreItem = async (id) => {
    try {
      await unarchiveItem(id);
      toast.success("Item restored successfully");
      fetchItems();
    } catch (error) {
      toast.error("Failed to restore item");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 p-4 md:px-8 md:pt-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">Manage your items.</p>
        </div>
        <div className="flex items-center space-x-2">
          <AddItemDialog onItemAdded={fetchItems} />
        </div>
      </div>

      <div className="space-y-4">
        <Tabs
          defaultValue="active"
          value={currentItemTab}
          onValueChange={setCurrentItemTab}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="active">Active Items</TabsTrigger>
              <TabsTrigger value="archived">Archived Items</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active">
            {loadingItems ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : errorItems ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorItems}</AlertDescription>
              </Alert>
            ) : (
              <ItemsDataTable
                columns={createColumns} // Pass function reference
                data={items}
                onItemUpdated={fetchItems}
                onArchive={handleArchiveItem}
                isArchived={false}
              />
            )}
          </TabsContent>

          <TabsContent value="archived">
            {loadingItems ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <ItemsDataTable
                columns={createColumns}
                data={archivedItems}
                onItemUpdated={fetchItems} // Ideally edit is disabled for archived, checks in ActionsCell
                onRestore={isSuperAdmin ? handleRestoreItem : null}
                isArchived={true}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Inventory;

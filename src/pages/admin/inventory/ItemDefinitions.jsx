import React, { useEffect, useState } from "react";
import { getItems } from "@/features/inventory/inventoryService";
import { ItemsDataTable } from "@/pages/inventory/components/ItemsDataTable";
import { createColumns } from "@/pages/inventory/components/columns";
import { AddItemDialog } from "@/pages/inventory/components/AddItemDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Package } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ItemDefinitions = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("raw-material");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getItems();
      setItems(data);
    } catch (err) {
      console.error("Failed to load inventory items", err);
      setError("Failed to load inventory items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const rawMaterials = items.filter(
    (item) =>
      item.category === "Raw Material" || item.category === "Raw Materials",
  );
  const finishedGoods = items.filter(
    (item) =>
      item.category === "Finished Good" || item.category === "Finished Goods",
  );

  return (
    <div className="space-y-6 p-4 md:px-8 md:pt-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Item Definitions
          </h2>
          <p className="text-muted-foreground">
            Manage global item definitions and details.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AddItemDialog onItemAdded={fetchItems} />
        </div>
      </div>

      <div className="space-y-4">
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
        ) : (
          <Tabs
            defaultValue="raw-material"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="mb-2 grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="raw-material">Raw Materials</TabsTrigger>
              <TabsTrigger value="finished-goods">Finished Goods</TabsTrigger>
            </TabsList>
            <TabsContent value="raw-material" className="space-y-4">
              {rawMaterials.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No Raw Materials"
                  description="No raw materials defined. Add a new item with 'Raw Material' category."
                  action={<AddItemDialog onItemAdded={fetchItems} />}
                />
              ) : (
                <ItemsDataTable
                  columns={createColumns}
                  data={rawMaterials}
                  onItemUpdated={fetchItems}
                />
              )}
            </TabsContent>
            <TabsContent value="finished-goods" className="space-y-4">
              {finishedGoods.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No Finished Goods"
                  description="No finished goods defined. Add a new item with 'Finished Goods' category."
                  action={<AddItemDialog onItemAdded={fetchItems} />}
                />
              ) : (
                <ItemsDataTable
                  columns={createColumns}
                  data={finishedGoods}
                  onItemUpdated={fetchItems}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ItemDefinitions;

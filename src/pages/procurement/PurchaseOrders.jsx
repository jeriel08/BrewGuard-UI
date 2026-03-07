import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Archive, PackageSearch, ArchiveX } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { EmptyState } from "@/components/common/EmptyState";
import PurchaseOrdersTable from "./components/PurchaseOrdersTable";
import PurchaseOrderCard from "./components/PurchaseOrderCard";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  getShipments,
  getArchivedShipments,
  archiveShipment,
  unarchiveShipment,
} from "@/features/inventory/inventoryService";
import { useAuth } from "@/context/AuthContext";

const PurchaseOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [activeData, setActiveData] = useState([]);
  const [archivedData, setArchivedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("all");
  const [currentTab, setCurrentTab] = useState("active");

  // Archive confirmation state
  const [orderToArchive, setOrderToArchive] = useState(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const isSuperAdmin = user?.role === "Super Admin";

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const [active, archived] = await Promise.all([
        getShipments(),
        getArchivedShipments(),
      ]);
      setActiveData(active);
      setArchivedData(archived);
    } catch (error) {
      console.error("Failed to fetch shipments", error);
      toast.error("Failed to load purchase orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleArchive = (id) => {
    setOrderToArchive(id);
    setIsArchiveModalOpen(true);
  };

  const confirmArchive = async () => {
    if (!orderToArchive) return;
    try {
      await archiveShipment(orderToArchive);
      toast.success("Order archived successfully");
      fetchShipments();
    } catch (error) {
      toast.error("Failed to archive order");
    } finally {
      setIsArchiveModalOpen(false);
      setOrderToArchive(null);
    }
  };

  const handleRestore = async (id) => {
    try {
      await unarchiveShipment(id);
      toast.success("Order restored successfully");
      fetchShipments();
    } catch (error) {
      toast.error("Failed to restore order");
    }
  };

  const currentData = currentTab === "active" ? activeData : archivedData;

  const uniqueSuppliers = Array.from(
    new Set(currentData.map((item) => item.supplierName)),
  ).filter(Boolean);

  const filteredData = currentData.filter((item) => {
    const matchesSearch = item.invoiceNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSupplier =
      filterSupplier === "all" || item.supplierName === filterSupplier;
    return matchesSearch && matchesSupplier;
  });

  return (
    <div className="flex flex-col space-y-6 gap-4 p-4 md:px-8 md:pt-4 pt-6 w-full h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Purchase Orders</h2>
          <p className="text-muted-foreground">
            Manage and view incoming shipments.
          </p>
        </div>
        <Button onClick={() => navigate("/purchase-orders/new")}>
          <Plus className="h-4 w-4" /> Add Purchase Order
        </Button>
      </div>

      <div>
        <Tabs
          defaultValue="active"
          value={currentTab}
          onValueChange={setCurrentTab}
        >
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="archived">Archived Orders</TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center my-4">
            <Input
              placeholder="Search by Invoice #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:w-[300px]"
            />
            <Select value={filterSupplier} onValueChange={setFilterSupplier}>
              <SelectTrigger className="sm:w-[200px] sm:ml-auto">
                <SelectValue placeholder="Filter by Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {uniqueSuppliers.map((supplier) => (
                  <SelectItem key={supplier} value={supplier}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : filteredData.length === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="No active purchase orders"
                description={
                  searchQuery || filterSupplier !== "all"
                    ? "We couldn't find any active orders matching your filters."
                    : "You don't have any active purchase orders yet."
                }
                action={
                  !(searchQuery || filterSupplier !== "all") && (
                    <Button onClick={() => navigate("/purchase-orders/new")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Purchase Order
                    </Button>
                  )
                }
              />
            ) : (
              <>
                {isDesktop ? (
                  <PurchaseOrdersTable
                    data={filteredData}
                    isArchivedView={false}
                    onArchive={handleArchive}
                    onUpdateSuccess={fetchShipments}
                  />
                ) : (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {filteredData.map((shipment) => (
                      <PurchaseOrderCard
                        key={shipment.id}
                        shipment={shipment}
                        onUpdateSuccess={fetchShipments}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="archived" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
              </div>
            ) : filteredData.length === 0 ? (
              <EmptyState
                icon={ArchiveX}
                title="No archived purchase orders"
                description="You don't have any archived purchase orders at the moment."
              />
            ) : (
              <>
                {isDesktop ? (
                  <PurchaseOrdersTable
                    data={filteredData}
                    isArchivedView={true}
                    onRestore={isSuperAdmin ? handleRestore : null}
                    onUpdateSuccess={fetchShipments}
                  />
                ) : (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {filteredData.map((shipment) => (
                      <PurchaseOrderCard
                        key={shipment.id}
                        shipment={shipment}
                        onUpdateSuccess={fetchShipments}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog
        open={isArchiveModalOpen}
        onOpenChange={setIsArchiveModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Purchase Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this purchase order? It will be
              moved to the Archived Orders tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!orderToArchive}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmArchive}
              disabled={!orderToArchive}
            >
              Archive Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PurchaseOrders;

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { getSuppliers } from "@/features/suppliers/supplierService";
import { getItems } from "@/features/inventory/inventoryService";
import { PurchaseOrderForm } from "./components/PurchaseOrderForm";
import { receiveShipment } from "@/features/suppliers/supplierService";

const AddPurchaseOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initItemId = searchParams.get("itemId");

  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersData, itemsData] = await Promise.all([
          getSuppliers(),
          getItems(),
        ]);
        setSuppliers(suppliersData);
        // Filter items to only show Raw Materials for Purchase Orders
        const rawMaterials = itemsData.filter(
          (item) => item.category === "Raw Material",
        );
        setItems(rawMaterials);
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("Failed to load suppliers or items.");
      }
    };
    fetchData();
  }, []);

  const handleCreatePurchaseOrder = async (payload) => {
    await receiveShipment(payload);
    toast.success("Purchase Order created successfully!");
    navigate("/purchase-orders");
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:px-8 md:pt-4 pt-6 w-full max-w-3xl mx-auto items-center">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Add Purchase Order
        </h2>
        <p className="text-muted-foreground">
          Record a new incoming shipment/purchase order.
        </p>
      </div>

      <PurchaseOrderForm
        suppliers={suppliers}
        items={items}
        initialItemId={initItemId}
        onSubmitAction={handleCreatePurchaseOrder}
        submitLabel="Create Purchase Order"
      />
    </div>
  );
};

export default AddPurchaseOrder;

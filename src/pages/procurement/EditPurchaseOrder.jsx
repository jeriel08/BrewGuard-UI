import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getSuppliers } from "@/features/suppliers/supplierService";
import {
  getItems,
  getShipmentById,
  updateShipment,
} from "@/features/inventory/inventoryService";
import { PurchaseOrderForm } from "./components/PurchaseOrderForm";
import { Loader2 } from "lucide-react";

const EditPurchaseOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersData, itemsData, shipmentData] = await Promise.all([
          getSuppliers(),
          getItems(),
          getShipmentById(id),
        ]);
        setSuppliers(suppliersData);
        // Filter items to only show Raw Materials for Purchase Orders
        const rawMaterials = itemsData.filter(
          (item) => item.category === "Raw Material",
        );
        setItems(rawMaterials);
        setInitialData(shipmentData);

        if (shipmentData.status !== "Pending") {
          toast.error("You can only edit pending purchase orders.");
          navigate("/purchase-orders");
        }
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error(
          "Failed to load purchase order details, suppliers or items.",
        );
        navigate("/purchase-orders");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, navigate]);

  const handleUpdatePurchaseOrder = async (payload) => {
    await updateShipment(id, payload);
    toast.success("Purchase Order updated successfully!");
    navigate("/purchase-orders");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:px-8 md:pt-4 pt-6 w-full max-w-3xl mx-auto items-center">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Edit Purchase Order
        </h2>
        <p className="text-muted-foreground">
          Modify details of an existing pending shipment.
        </p>
      </div>

      {initialData && (
        <PurchaseOrderForm
          suppliers={suppliers}
          items={items}
          initialData={initialData}
          onSubmitAction={handleUpdatePurchaseOrder}
          submitLabel="Update Purchase Order"
        />
      )}
    </div>
  );
};

export default EditPurchaseOrder;

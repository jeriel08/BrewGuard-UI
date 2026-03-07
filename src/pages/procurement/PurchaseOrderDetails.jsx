import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ShipmentInfo from "./components/ShipmentInfo";
import ShipmentBatches from "./components/ShipmentBatches";
import PurchaseOrderDetailsSkeleton from "./components/PurchaseOrderDetailsSkeleton";

const PurchaseOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: shipment,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["shipment", id],
    queryFn: async () => {
      const response = await api.get(`/inventory/shipments/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <PurchaseOrderDetailsSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-red-500 font-medium">
          Failed to load purchase order details.
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 p-4 md:px-8 md:pt-4 pt-6 w-full h-full">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <ShipmentInfo shipment={shipment} />
      <ShipmentBatches batches={shipment.batches} />
    </div>
  );
};

export default PurchaseOrderDetails;

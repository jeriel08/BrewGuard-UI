import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Truck, Edit } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const PurchaseOrderCard = ({ shipment }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {shipment.invoiceNumber}
        </CardTitle>
        <Truck className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-xs text-muted-foreground">Supplier</div>
          <div className="text-lg font-bold">{shipment.supplierName}</div>

          <div className="text-xs text-muted-foreground mt-2">
            Date Received
          </div>
          <div>
            {shipment.dateReceived
              ? format(new Date(shipment.dateReceived), "PPP")
              : "N/A"}
          </div>

          {shipment.status === "Pending" ? (
            <div className="flex flex-col gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/purchase-orders/${shipment.id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Order
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/purchase-orders/${shipment.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" /> View Details
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => navigate(`/purchase-orders/${shipment.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" /> View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderCard;

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const ShipmentInfo = ({ shipment }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-500";
      case "Received":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Invoice #</p>
        <p className="text-lg font-semibold">{shipment.invoiceNumber}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Status</p>
        <Badge variant="outline" className="gap-2 text-sm px-3 py-1 mt-1">
          <span
            className={`h-2.5 w-2.5 rounded-full ${getStatusColor(shipment.status)}`}
          />
          {shipment.status}
        </Badge>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Supplier</p>
        <p className="text-lg font-semibold">{shipment.supplierName}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Date Created
        </p>
        <p className="font-medium">
          {shipment.dateReceived
            ? format(new Date(shipment.dateReceived), "PPP")
            : "-"}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Expected Delivery
        </p>
        <p className="font-medium">
          {shipment.expectedDeliveryDate
            ? format(new Date(shipment.expectedDeliveryDate), "PPP")
            : "-"}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Received By</p>
        <div className="flex flex-col">
          <span className="font-medium">{shipment.receivedBy || "-"}</span>
          {shipment.receivedAt && (
            <span className="text-xs text-muted-foreground">
              {format(new Date(shipment.receivedAt), "PPP p")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentInfo;

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const ShipmentBatchCard = ({ batch }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Batch #{batch.id}</CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold">{batch.itemName}</div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <div className="text-xs text-muted-foreground">Initial Qty</div>
              <div className="font-medium">{batch.initialQuantity}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Current Qty</div>
              <div className="font-medium">{batch.currentQuantity}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Unit Cost</div>
              <div className="font-medium">
                ₱{(batch.actualUnitCost || 0).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <div>
                <Badge variant="outline" className="gap-2 text-xs px-3 py-1">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      batch.status === "Approved"
                        ? "bg-green-500"
                        : batch.status === "Failed" ||
                            batch.status === "Rejected"
                          ? "bg-red-500"
                          : batch.status === "Depleted"
                            ? "bg-orange-500"
                            : "bg-gray-500"
                    }`}
                  />
                  {batch.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentBatchCard;

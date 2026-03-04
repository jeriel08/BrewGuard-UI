import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ShipmentBatchesTable = ({ batches }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Batch ID</TableHead>
          <TableHead>Item Name</TableHead>
          <TableHead>Initial Qty</TableHead>
          <TableHead>Current Qty</TableHead>
          <TableHead>Unit Cost</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {batches && batches.length > 0 ? (
          batches.map((batch) => (
            <TableRow key={batch.id}>
              <TableCell className="font-medium">#{batch.id}</TableCell>
              <TableCell className="font-medium">{batch.itemName}</TableCell>
              <TableCell>{batch.initialQuantity}</TableCell>
              <TableCell>{batch.currentQuantity}</TableCell>
              <TableCell>₱{(batch.actualUnitCost || 0).toFixed(2)}</TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No items found in this shipment.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ShipmentBatchesTable;

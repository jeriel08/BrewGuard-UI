import ShipmentBatchesTable from "./ShipmentBatchesTable";
import ShipmentBatchCard from "./ShipmentBatchCard";

const ShipmentBatches = ({ batches }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">Items (Batches)</h2>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <ShipmentBatchesTable batches={batches} />
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {batches && batches.length > 0 ? (
          batches.map((batch) => (
            <ShipmentBatchCard key={batch.id} batch={batch} />
          ))
        ) : (
          <div className="text-center p-4 border rounded-md text-muted-foreground">
            No items found in this shipment.
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentBatches;

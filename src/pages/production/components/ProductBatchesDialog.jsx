import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { getBatchesByItemId } from "@/features/inventory/inventoryService";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const ProductBatchesDialog = ({ open, onOpenChange, product }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data, isLoading } = useQuery({
    queryKey: ["productBatches", product?.id],
    queryFn: () => getBatchesByItemId(product.id),
    enabled: !!product?.id && open,
  });

  const batches = Array.isArray(data) ? data : [];

  // Content Component to be shared between Dialog and Sheet
  const BatchesContent = () => (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-amber-700" />
        </div>
      ) : batches.length === 0 ? (
        <div className="text-center p-4 text-muted-foreground">
          No batch history found for this product.
        </div>
      ) : (
        <ScrollArea className="h-[60vh] md:h-[500px] w-full rounded-md border p-4">
          <div className="space-y-4">
            {batches.map((batch, index) => (
              <div key={batch.id}>
                <div className="flex items-start justify-between">
                  <div className="grid gap-1">
                    <div className="font-semibold text-base">
                      Batch #{batch.id}: {batch.currentQuantity}{" "}
                      {product?.unitOfMeasurement || "kg"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Received:{" "}
                      {batch.dateReceived
                        ? format(new Date(batch.dateReceived), "PPP")
                        : "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Supplier: {batch.supplierName}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`gap-2 ${
                      batch.status === "Approved"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : batch.status === "Depleted"
                          ? "bg-orange-100 text-orange-800 border-orange-200"
                          : batch.status === "Rejected" ||
                              batch.status === "Failed"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        batch.status === "Approved"
                          ? "bg-green-500"
                          : batch.status === "Depleted"
                            ? "bg-orange-500"
                            : batch.status === "Rejected" ||
                                batch.status === "Failed"
                              ? "bg-red-500"
                              : "bg-gray-500"
                      }`}
                    />
                    {batch.status}
                  </Badge>
                </div>
                {index < batches.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Batch History - {product?.name}</DialogTitle>
            <DialogDescription>
              History of batches for this product.
            </DialogDescription>
          </DialogHeader>
          <BatchesContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh]" showCloseButton={false}>
        <SheetHeader className="text-left pt-6">
          <SheetTitle>Batch History - {product?.name}</SheetTitle>
          <SheetDescription>
            History of batches for this product.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <BatchesContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductBatchesDialog;

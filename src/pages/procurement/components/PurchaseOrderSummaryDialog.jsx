import { Loader2, Package, Calendar, FileText, Building2 } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

export function PurchaseOrderSummaryDialog({
  open,
  onOpenChange,
  pendingPayload,
  initialData,
  onConfirm,
  loading,
}) {
  if (!pendingPayload) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Purchase Order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {initialData ? "update" : "create"} this
            purchase order? Please review the details below before confirming.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted/50 p-4 rounded-lg space-y-4 my-2 border">
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <FileText className="w-4 h-4 mr-2" />
                <span>Invoice Number</span>
              </div>
              <p className="font-medium text-foreground">
                {pendingPayload.invoiceNumber}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <Building2 className="w-4 h-4 mr-2" />
                <span>Supplier</span>
              </div>
              <p
                className="font-medium text-foreground truncate"
                title={pendingPayload.supplierName}
              >
                {pendingPayload.supplierName}
              </p>
            </div>

            <div className="col-span-2 space-y-1">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Expected Delivery</span>
              </div>
              <p className="font-medium text-foreground">
                {new Date(
                  pendingPayload.expectedDeliveryDate,
                ).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center text-muted-foreground text-sm">
              <Package className="w-4 h-4 mr-2" />
              <span>Items ({pendingPayload.items.length})</span>
            </div>
            <ul className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
              {pendingPayload.items.map((it, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-background p-2.5 rounded-md border text-sm shadow-sm"
                >
                  <span className="font-medium truncate mr-3 text-foreground">
                    {it.itemName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {it.unitCost != null && (
                      <span className="text-muted-foreground whitespace-nowrap bg-muted px-2 py-0.5 rounded text-xs font-medium border">
                        ₱{Number(it.unitCost).toFixed(2)}
                      </span>
                    )}
                    <span className="text-muted-foreground whitespace-nowrap bg-muted px-2 py-0.5 rounded text-xs font-medium border">
                      Qty: {it.quantity}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

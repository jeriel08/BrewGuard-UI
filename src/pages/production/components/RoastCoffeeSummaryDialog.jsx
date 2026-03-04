import { Loader2, PackageOpen, Package, ArrowRight, Flame } from "lucide-react";
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

export function RoastCoffeeSummaryDialog({
  open,
  onOpenChange,
  pendingPayload,
  isEdit,
  onConfirm,
  loading,
}) {
  if (!pendingPayload) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[450px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Flame className="w-5 h-5 mr-2 text-orange-500" />
            Confirm Roasting Log
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {isEdit ? "update" : "create"} this
            production batch? Please review the details below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted/50 p-4 rounded-xl space-y-4 my-2 border">
          <div className="flex flex-col space-y-4 relative">
            {/* Input Section */}
            <div className="flex items-start gap-3 bg-background p-3 rounded-lg border shadow-sm">
              <div className="bg-orange-100 p-2 rounded-full mt-1">
                <PackageOpen className="w-4 h-4 text-orange-600" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Raw Material Input
                </p>
                <p
                  className="font-medium text-foreground truncate"
                  title={pendingPayload.rawMaterialName}
                >
                  {pendingPayload.rawMaterialName}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Batch #{pendingPayload.rawMaterialBatchId}
                  </span>
                  <span className="font-medium bg-muted px-2 py-0.5 rounded border">
                    {pendingPayload.rawMaterialQuantityUsed}{" "}
                    {pendingPayload.rawMaterialUnit}
                  </span>
                </div>
              </div>
            </div>

            {/* Arrow linking input and output */}
            <div className="absolute left-7 top-[62px] bottom-[62px] w-0.5 bg-border -z-10 hidden sm:block"></div>
            <div className="flex justify-center -my-2 sm:hidden">
              <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
            </div>

            {/* Output Section */}
            <div className="flex items-start gap-3 bg-background p-3 rounded-lg border shadow-sm relative">
              <div className="hidden sm:flex absolute -top-[1.2rem] left-[1.3rem] bg-background border p-1 rounded-full shadow-sm">
                <ArrowRight className="w-3 h-3 text-muted-foreground rotate-90" />
              </div>
              <div className="bg-amber-100 p-2 rounded-full mt-1">
                <Package className="w-4 h-4 text-amber-600" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Finished Product Output
                </p>
                <p
                  className="font-medium text-foreground truncate"
                  title={pendingPayload.producedItemName}
                >
                  {pendingPayload.producedItemName}
                </p>
                <div className="flex justify-end items-center text-sm">
                  <span className="font-medium bg-muted px-2 py-0.5 rounded border text-amber-700">
                    + {pendingPayload.producedQuantity}{" "}
                    {pendingPayload.producedItemUnit}
                  </span>
                </div>
              </div>
            </div>
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
            className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-600"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Roast
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

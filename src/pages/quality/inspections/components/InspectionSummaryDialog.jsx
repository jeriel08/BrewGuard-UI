import {
  Loader2,
  ClipboardCheck,
  AlertTriangle,
  FileText,
  Activity,
  ImageIcon,
} from "lucide-react";
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

export function InspectionSummaryDialog({
  open,
  onOpenChange,
  pendingPayload,
  selectedBatch,
  onConfirm,
  loading,
}) {
  if (!pendingPayload || !selectedBatch) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[550px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <ClipboardCheck className="w-5 h-5 mr-2 text-primary" />
            Confirm Quality Inspection
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to submit the inspection findings for this batch.
            Please confirm the details below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted/50 p-4 rounded-xl space-y-4 my-2 border text-sm">
          {/* Target Info */}
          <div className="flex items-start gap-3 bg-background p-3 rounded-lg border shadow-sm">
            <div className="bg-primary/10 p-2 rounded-full mt-1">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {selectedBatch.itemName}
              </p>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  Batch #{selectedBatch.id}
                </span>
                {selectedBatch.supplierName &&
                  selectedBatch.supplierName !== "Unknown Supplier" &&
                  selectedBatch.supplierName !== "N/A" && (
                    <span className="text-muted-foreground">
                      {selectedBatch.supplierName}
                    </span>
                  )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Single Measurements card — always full width */}
            <div className="col-span-2 space-y-3 bg-background p-3 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 font-medium text-muted-foreground pb-2 border-b">
                <Activity className="w-4 h-4" />
                Measurements
              </div>

              {selectedBatch.itemCategory === "Raw Material" && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Moisture Content
                    </span>
                    <span className="font-medium">
                      {pendingPayload.moistureContent}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-muted-foreground">Total Defects</span>
                    <span className="font-medium text-amber-600">
                      {pendingPayload.defectCount}
                    </span>
                  </div>
                  {pendingPayload.secondaryDefects > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Secondary Defects
                      </span>
                      <span className="font-medium text-amber-600">
                        {pendingPayload.secondaryDefects}
                      </span>
                    </div>
                  )}
                  {pendingPayload.dominantDefect && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Dominant Defect
                      </span>
                      <span
                        className="font-medium text-amber-700 truncate max-w-[55%] text-right"
                        title={pendingPayload.dominantDefect}
                      >
                        {pendingPayload.dominantDefect}
                      </span>
                    </div>
                  )}
                </>
              )}

              {selectedBatch.itemCategory === "Finished Goods" && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Roast Color (Agtron)
                    </span>
                    <span className="font-medium">
                      {pendingPayload.roastColor || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Moisture Content
                    </span>
                    <span className="font-medium">
                      {pendingPayload.moistureContent}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cupping Score</span>
                    <span className="font-medium">
                      {pendingPayload.cuppingScore} / 100
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Remarks & Evidence */}
          {(pendingPayload.remarks || pendingPayload.evidencePhoto?.[0]) && (
            <div className="bg-background pt-3 pb-3 px-3 rounded-lg border shadow-sm space-y-2">
              {pendingPayload.remarks && (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Remarks</p>
                  <p className="text-sm line-clamp-2">
                    {pendingPayload.remarks}
                  </p>
                </div>
              )}
              {pendingPayload.evidencePhoto?.[0] && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-2 mt-2">
                  <ImageIcon className="w-4 h-4" />1 Image Attached
                </div>
              )}
            </div>
          )}
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
            Confirm Inspection
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

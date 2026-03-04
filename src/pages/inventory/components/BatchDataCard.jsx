import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export function BatchDataCard({
  batch,
  onArchive,
  onRestore,
  isArchived,
  isSuperAdmin,
  onEdit,
}) {
  let dotColor = "bg-slate-500";
  if (batch.status === "Approved") dotColor = "bg-green-500";
  if (batch.status === "Rejected") dotColor = "bg-destructive";
  if (batch.status === "Depleted") dotColor = "bg-amber-500";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">
            Batch #{batch.id}
          </CardTitle>
          <Badge variant="outline" className="pl-1.5 pr-2.5">
            <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${dotColor}`} />
            {batch.status}
          </Badge>
        </div>
        <div className="flex items-center space-x-1">
          {onEdit && batch.status === "Pending Inspection" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(batch)}
                  >
                    <PenLine className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Batch</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Item:</span>
            <span className="text-sm font-medium">{batch.itemName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Supplier:</span>
            <span className="text-sm font-medium">{batch.supplierName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Quantity:</span>
            <span className="text-sm font-medium">{batch.currentQuantity}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Unit Cost:</span>
            <span className="text-sm font-medium">
              ₱{(batch.actualUnitCost || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

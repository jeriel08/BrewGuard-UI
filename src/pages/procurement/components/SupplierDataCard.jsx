import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Activity, Clock, Edit, Archive, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditSupplierDialog } from "./EditSupplierDialog";
import { useAuth } from "@/context/AuthContext";

export function SupplierDataCard({
  supplier,
  onSupplierUpdated,
  onArchive,
  onRestore,
  isArchived,
}) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "Super Admin";

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            {supplier.name}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {isArchived
              ? isSuperAdmin &&
                onRestore && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRestore(supplier)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )
              : onArchive && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onArchive(supplier)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.contactInfo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Rating:</span>
              <span>{supplier.rating}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span>
                Quality:{" "}
                {supplier.qualityScore !== null
                  ? `${supplier.qualityScore}%`
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                Timeliness:{" "}
                {supplier.timelinessScore !== null
                  ? `${supplier.timelinessScore}%`
                  : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditSupplierDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        supplier={supplier}
        onSupplierUpdated={onSupplierUpdated}
      />
    </>
  );
}

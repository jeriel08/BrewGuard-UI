import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getItemById } from "@/features/inventory/inventoryService";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

function ItemDetailContent({ itemId }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getItemById(itemId);
        setItem(data);
      } catch (err) {
        console.error("Failed to fetch item details", err);
        setError("Failed to load item details.");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) fetchItem();
  }, [itemId]);

  if (loading) {
    return (
      <div className="space-y-4 py-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive py-4">{error}</p>;
  }

  if (!item) return null;

  const details = [
    { label: "ID", value: item.id },
    { label: "Name", value: item.name },
    { label: "Category", value: item.category, isBadge: true },
    { label: "Unit of Measurement", value: item.unitOfMeasurement },
    { label: "Reorder Level", value: item.reorderLevel },
    {
      label: "Standard Cost",
      value: `₱${(item.standardCost || 0).toFixed(2)}`,
    },
    {
      label: "Created By",
      value: item.createdByName,
    },
    {
      label: "Created At",
      value: item.createdAt ? new Date(item.createdAt).toLocaleString() : null,
    },
    {
      label: "Updated By",
      value: item.updatedByName,
    },
    {
      label: "Updated At",
      value: item.updatedAt ? new Date(item.updatedAt).toLocaleString() : null,
    },
  ];

  return (
    <div className="grid gap-3 py-4">
      {details.map(
        (detail) =>
          detail.value != null && (
            <div
              key={detail.label}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-muted-foreground">
                {detail.label}
              </span>
              {detail.isBadge ? (
                <Badge variant="outline">{detail.value}</Badge>
              ) : (
                <span className="text-sm font-medium text-right max-w-[60%]">
                  {detail.value}
                </span>
              )}
            </div>
          ),
      )}
    </div>
  );
}

export function ViewItemDialog({ itemId, open, onOpenChange }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
            <DialogDescription>
              View full details for this inventory item.
            </DialogDescription>
          </DialogHeader>
          <ItemDetailContent itemId={itemId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Item Details</SheetTitle>
          <SheetDescription>
            View full details for this inventory item.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <ItemDetailContent itemId={itemId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

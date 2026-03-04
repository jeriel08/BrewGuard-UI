import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EditItemDialog } from "./EditItemDialog";
import { ViewItemDialog } from "./ViewItemDialog";

export function ItemDataCard({ item, onItemUpdated }) {
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(item.id.toString())
                }
              >
                Copy Item ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                Edit item
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setViewOpen(true)}>
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Category:</span>
              <Badge variant="outline">{item.category}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Unit:</span>
              <span className="text-sm font-medium">
                {item.unitOfMeasurement}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Reorder Level:
              </span>
              <span className="text-sm font-medium">{item.reorderLevel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Standard Cost:
              </span>
              <span className="text-sm font-medium">
                ₱{(item.standardCost || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditItemDialog
        item={item}
        open={editOpen}
        onOpenChange={setEditOpen}
        onItemUpdated={onItemUpdated}
      />

      <ViewItemDialog
        itemId={item.id}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
    </>
  );
}

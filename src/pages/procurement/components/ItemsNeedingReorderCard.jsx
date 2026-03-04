import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Plus, List } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ItemsNeedingReorderCard = ({ items, loading, className }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isProcurementOfficer = user?.role === "Procurement Officer";

  const handleReorder = (itemId) => {
    navigate(`/purchase-orders/new?itemId=${itemId}`);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Items Needing Reorder
        </CardTitle>
        <CardDescription>
          Inventory items that have reached their reorder level.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
        ) : items && items.length > 0 ? (
          <ScrollArea className={items.length > 3 ? "h-[320px] pr-4" : ""}>
            <div className="grid gap-4">
              {items.map((item, index) => (
                <Item
                  key={item.id || item.Id || index}
                  variant="outline"
                  className="p-4 rounded-lg"
                >
                  <ItemContent>
                    <ItemTitle>
                      {typeof item === "string" ? item : item.name || item.Name}
                    </ItemTitle>
                    <ItemDescription>
                      {typeof item === "string"
                        ? "Legacy Data (Restart Backend)"
                        : `ID: ${item.id || item.Id} | Category: ${
                            item.category || item.Category
                          }`}
                    </ItemDescription>
                  </ItemContent>
                  {isProcurementOfficer && (
                    <ItemActions>
                      <Button
                        size="sm"
                        onClick={() => handleReorder(item.id || item.Id)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Reorder
                      </Button>
                    </ItemActions>
                  )}
                </Item>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <List className="h-8 w-8 mb-2 opacity-20" />
            <p>No items need reordering right now.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

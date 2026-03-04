import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductStatusBadge from "./ProductStatusBadge";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

const ProductInventoryCard = ({ product, onClick }) => {
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">#{product.id}</CardTitle>
        <ProductStatusBadge status={product.status} />
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="text-2xl font-bold">{product.name}</div>
          <p className="text-sm text-muted-foreground">
            Total Quantity:{" "}
            <span className="font-medium text-foreground">
              {product.totalQuantity}
            </span>
          </p>
          <Button variant="outline" size="sm" className="w-full mt-2">
            <History className="mr-2 h-4 w-4" /> View History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductInventoryCard;

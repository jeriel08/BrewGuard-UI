import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RawMaterialStatusBadge from "./RawMaterialStatusBadge";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

const RawMaterialsInventoryCard = ({ material, onClick }) => {
  const cost = material.unitCost;
  const trend = material.unitCostTrend;

  let TrendIcon = null;
  let trendColor = "";

  if (trend === "up") {
    TrendIcon = TrendingUp;
    trendColor = "text-red-500";
  } else if (trend === "down") {
    TrendIcon = TrendingDown;
    trendColor = "text-green-500";
  } else if (trend === "same") {
    TrendIcon = Minus;
    trendColor = "text-gray-400";
  }

  const formatCurrency = (amount) => {
    if (amount == null) return "N/A";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">#{material.id}</CardTitle>
        <RawMaterialStatusBadge status={material.status} />
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="text-base font-semibold truncate">
            {material.name}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total Quantity:
            </span>
            <span className="font-medium text-sm">
              {material.totalQuantity}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Latest Cost:</span>
            <div className="flex items-center gap-1 font-medium text-sm">
              {formatCurrency(cost)}
              {TrendIcon && <TrendIcon className={`h-4 w-4 ${trendColor}`} />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RawMaterialsInventoryCard;

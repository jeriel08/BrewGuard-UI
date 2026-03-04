import { Badge } from "@/components/ui/badge";

const RawMaterialStatusBadge = ({ status }) => {
  let colorClass = "bg-gray-500";

  switch (status) {
    case "In Stock":
      colorClass = "bg-green-500";
      break;
    case "Low Stock":
      colorClass = "bg-orange-500";
      break;
    case "Out of Stock":
      colorClass = "bg-red-500";
      break;
    default:
      colorClass = "bg-gray-500";
  }

  return (
    <Badge variant="outline" className="gap-2">
      <span className={`h-2 w-2 rounded-full ${colorClass}`} />
      {status}
    </Badge>
  );
};

export default RawMaterialStatusBadge;

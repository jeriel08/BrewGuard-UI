import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Loader2, PackageSearch } from "lucide-react";
import RawMaterialsInventoryTable from "./components/RawMaterialsInventoryTable";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/EmptyState";

const RawMaterialsInventory = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: materials = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["rawMaterialsInventory"],
    queryFn: async () => {
      const response = await api.get("/inventory/raw-materials");
      return response.data;
    },
  });

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500 font-medium">
          Failed to load raw materials inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 p-4 md:px-8 md:pt-4 pt-6 w-full h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Raw Materials Inventory
          </h2>
          <p className="text-muted-foreground">
            Manage raw materials and monitor stock levels.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:max-w-[300px]"
        />
        {filteredMaterials.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No materials found"
            description={
              searchQuery
                ? "No raw materials matched your search."
                : "There are no raw materials in the inventory."
            }
          />
        ) : (
          <RawMaterialsInventoryTable data={filteredMaterials} />
        )}
      </div>
    </div>
  );
};

export default RawMaterialsInventory;

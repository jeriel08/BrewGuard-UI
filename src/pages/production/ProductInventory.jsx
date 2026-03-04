import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Loader2, PackageSearch } from "lucide-react";
import ProductInventoryTable from "./components/ProductInventoryTable";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/EmptyState";

const ProductInventory = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["productInventory"],
    queryFn: async () => {
      const response = await api.get("/inventory/products");
      return response.data;
    },
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
          Failed to load product inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 p-4 md:px-8 md:pt-4 pt-6 w-full h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Product Inventory
          </h2>
          <p className="text-muted-foreground">
            Manage finished goods and monitor stock levels.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:max-w-[300px]"
        />
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No products found"
            description={
              searchQuery
                ? "No products matched your search."
                : "There are no products in the inventory."
            }
          />
        ) : (
          <ProductInventoryTable data={filteredProducts} />
        )}
      </div>
    </div>
  );
};

export default ProductInventory;

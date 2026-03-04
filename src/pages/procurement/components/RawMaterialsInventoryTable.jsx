import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RawMaterialStatusBadge from "./RawMaterialStatusBadge";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import RawMaterialsInventoryCard from "./RawMaterialsInventoryCard";
import RawMaterialBatchesDialog from "./RawMaterialBatchesDialog";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, TrendingDown, TrendingUp, Minus } from "lucide-react";

const RawMaterialsInventoryTable = ({ data }) => {
  const [sorting, setSorting] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRowClick = (material) => {
    setSelectedMaterial(material);
    setDialogOpen(true);
  };

  const formatCurrency = (amount) => {
    if (amount == null) return "N/A";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const columns = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-sidebar-accent hover:text-primary"
          >
            Material ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">#{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 hover:bg-sidebar-accent hover:text-primary"
          >
            Material Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "totalQuantity",
      header: "Total Quantity",
    },
    {
      accessorKey: "unitCost",
      header: "Latest Unit Cost",
      cell: ({ row }) => {
        const cost = row.getValue("unitCost");
        const trend = row.original.unitCostTrend;

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

        return (
          <div className="flex items-center gap-2">
            <span>{formatCurrency(cost)}</span>
            {TrendIcon && <TrendIcon className={`h-4 w-4 ${trendColor}`} />}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <RawMaterialStatusBadge status={row.getValue("status")} />
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="rounded-md border hidden md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No raw materials found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {table.getRowModel().rows?.length ? (
          table
            .getRowModel()
            .rows.map((row) => (
              <RawMaterialsInventoryCard
                key={row.id}
                material={row.original}
                onClick={() => handleRowClick(row.original)}
              />
            ))
        ) : (
          <div className="text-center p-4 text-muted-foreground border rounded-md">
            No raw materials found.
          </div>
        )}
      </div>

      <DataTablePagination table={table} />

      {selectedMaterial && (
        <RawMaterialBatchesDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          material={selectedMaterial}
        />
      )}
    </div>
  );
};
export default RawMaterialsInventoryTable;

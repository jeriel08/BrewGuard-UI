import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, Users } from "lucide-react";
import { UserDataCard } from "./UserDataCard";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { EmptyState } from "@/components/common/EmptyState";

export function UsersDataTable({
  columns,
  data,
  onArchive,
  branches = [],
  isSuperAdmin = false,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  const roles = [
    "Admin",
    "Procurement Officer",
    "Quality Inspector",
    "Production Manager",
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Search users..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="w-full md:max-w-sm"
        />

        <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:flex-wrap md:items-center">
          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-auto md:ml-auto justify-between"
              >
                <span className="truncate max-w-[100px] md:max-w-none text-left">
                  {table.getColumn("role")?.getFilterValue() ? (
                    <>Role: {table.getColumn("role")?.getFilterValue()}</>
                  ) : (
                    <>Role: All</>
                  )}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={table.getColumn("role")?.getFilterValue() ?? "All"}
                onValueChange={(value) =>
                  table
                    .getColumn("role")
                    ?.setFilterValue(value === "All" ? undefined : value)
                }
              >
                <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
                {roles.map((role) => (
                  <DropdownMenuRadioItem key={role} value={role}>
                    {role}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Branch Filter (Super Admin Only) */}
          {isSuperAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto md:ml-auto justify-between"
                >
                  <span className="truncate max-w-[120px] md:max-w-none text-left">
                    {table.getColumn("branchName")?.getFilterValue() ? (
                      <>
                        Branch:{" "}
                        {table.getColumn("branchName")?.getFilterValue()}
                      </>
                    ) : (
                      <>Branch: All</>
                    )}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={
                    table.getColumn("branchName")?.getFilterValue() ?? "All"
                  }
                  onValueChange={(value) =>
                    table
                      .getColumn("branchName")
                      ?.setFilterValue(value === "All" ? undefined : value)
                  }
                >
                  <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
                  {branches.map((branch) => (
                    <DropdownMenuRadioItem key={branch.id} value={branch.name}>
                      {branch.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto md:ml-auto">
                Status:{" "}
                {table.getColumn("isActive")?.getFilterValue() === undefined
                  ? "All"
                  : table.getColumn("isActive")?.getFilterValue()
                    ? "Active"
                    : "Inactive"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={
                  table.getColumn("isActive")?.getFilterValue() === undefined
                    ? "All"
                    : table.getColumn("isActive")?.getFilterValue()
                      ? "Active"
                      : "Inactive"
                }
                onValueChange={(value) => {
                  let filterValue;
                  if (value === "All") filterValue = undefined;
                  else if (value === "Active") filterValue = true;
                  else if (value === "Inactive") filterValue = false;

                  table.getColumn("isActive")?.setFilterValue(filterValue);
                }}
              >
                <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Active">
                  Active
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Inactive">
                  Inactive
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

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
                <TableCell colSpan={columns.length} className="h-auto p-0">
                  <EmptyState
                    icon={Users}
                    title="No users found"
                    description="No users match your current filters. Try changing or clearing them."
                    className="border-0 min-h-[300px]"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {table.getRowModel().rows?.length ? (
          table
            .getRowModel()
            .rows.map((row) => (
              <UserDataCard
                key={row.id}
                user={row.original}
                onArchive={onArchive}
              />
            ))
        ) : (
          <EmptyState
            icon={Users}
            title="No users found"
            description="No users match your current filters."
            className="min-h-[250px]"
          />
        )}
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}

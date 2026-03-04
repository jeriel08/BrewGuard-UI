import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const BranchDataCard = ({ branch, onEdit, onToggleStatus }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="font-semibold text-lg">{branch.name}</div>
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
              onClick={() => onEdit(branch)}
              className="focus:bg-primary focus:text-primary-foreground"
            >
              <Pencil className="h-4 w-4 text-primary" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onToggleStatus(branch)}
              className={
                branch.isActive
                  ? "text-red-500 focus:bg-red-500 focus:text-white"
                  : "text-green-600 focus:bg-green-600 focus:text-white"
              }
            >
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-current" />
                {branch.isActive ? "Deactivate" : "Activate"}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="grid gap-2 mt-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Location:</span>
          <span className="font-medium text-sm text-right">
            {branch.location}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-muted-foreground text-sm">Status:</span>
          <Badge variant="outline" className="gap-1.5">
            <span
              className={`size-1.5 rounded-full ${
                branch.isActive ? "bg-green-500" : "bg-zinc-400"
              }`}
              aria-hidden="true"
            />
            {branch.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

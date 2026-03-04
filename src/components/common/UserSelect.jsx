import { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUsers } from "@/features/auth/api/useUsers";
import { Skeleton } from "@/components/ui/skeleton";

function UserList({ users, value, searchQuery, onSelect, roleFilter }) {
  const filtered = useMemo(
    () =>
      users.filter((user) => {
        if (
          roleFilter &&
          roleFilter.length > 0 &&
          !roleFilter.includes(user.role)
        )
          return false;
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      }),
    [users, searchQuery, roleFilter],
  );

  if (filtered.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        No personnel found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1" role="listbox">
      {filtered.map((user) => {
        const isSelected = user.id.toString() === value?.toString();
        const fullName = `${user.firstName} ${user.lastName}`;
        const role = user.role;
        return (
          <button
            key={user.id}
            type="button"
            role="option"
            aria-selected={isSelected}
            className={cn(
              "group flex flex-col items-start gap-0.5 rounded-sm px-2 py-2 text-sm cursor-pointer outline-none transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:bg-accent focus-visible:text-accent-foreground",
              isSelected && "bg-primary text-primary-foreground",
            )}
            onClick={() => onSelect(user)}
          >
            <div className="flex items-center w-full">
              <Check
                className={cn(
                  "mr-2 h-4 w-4 shrink-0",
                  isSelected ? "opacity-100" : "opacity-0",
                )}
              />
              <span className="truncate font-medium">{fullName}</span>
            </div>
            <span
              className={cn(
                "ml-6 text-xs transition-colors",
                isSelected
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground group-hover:text-accent-foreground",
              )}
            >
              {role}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function UserSelect({ value, onChange, roleFilter }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const searchInputRef = useRef(null);

  const { data: usersData, isLoading, isError } = useUsers();
  const users = usersData || [];

  const selectedUser = users.find((u) => u.id.toString() === value?.toString());

  const handleSelect = (user) => {
    onChange(user.id.toString());
    setOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }
  if (isError) {
    return <div className="text-red-500 text-sm">Error loading users</div>;
  }

  const searchContent = (
    <div className="flex flex-col gap-2 mt-1">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          placeholder="Search personnel..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          className="pl-8"
        />
      </div>
      <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
        <UserList
          users={users}
          value={value}
          searchQuery={searchQuery}
          onSelect={handleSelect}
          roleFilter={roleFilter}
        />
      </div>
    </div>
  );

  const triggerButton = (
    <Button
      type="button"
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={cn(
        "w-full justify-between font-normal hover:bg-transparent hover:text-foreground",
        !selectedUser && "text-muted-foreground",
      )}
    >
      <span className="truncate">
        {selectedUser
          ? `${selectedUser.firstName} ${selectedUser.lastName}`
          : "Select personnel..."}
      </span>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-2"
          align="start"
        >
          {searchContent}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div
        onClick={() => setOpen(true)}
        className="inline-flex w-full cursor-pointer"
      >
        {triggerButton}
      </div>
      <SheetContent side="bottom" className="h-[50vh]">
        <SheetHeader>
          <SheetTitle>Select Personnel</SheetTitle>
        </SheetHeader>
        <div className="px-4 pt-2 pb-4 flex-1 overflow-hidden">
          {searchContent}
        </div>
      </SheetContent>
    </Sheet>
  );
}

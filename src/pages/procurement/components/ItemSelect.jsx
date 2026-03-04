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

function ItemList({ items, value, searchQuery, onSelect }) {
  const filtered = useMemo(
    () =>
      items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [items, searchQuery],
  );

  if (filtered.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        No items found.
      </div>
    );
  }

  return (
    <div className="flex flex-col" role="listbox">
      {filtered.map((item) => {
        const isSelected = item.id.toString() === value?.toString();
        return (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={isSelected}
            className={cn(
              "group flex items-center gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer outline-none transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:bg-accent focus-visible:text-accent-foreground",
              isSelected && "bg-primary text-primary-foreground",
            )}
            onClick={() => onSelect(item)}
          >
            <Check
              className={cn(
                "h-4 w-4 shrink-0",
                isSelected ? "opacity-100" : "opacity-0",
              )}
            />
            <span className="truncate">
              {item.name}
              <span
                className={cn(
                  "ml-1 transition-colors",
                  isSelected
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-accent-foreground",
                )}
              >
                ({item.unitOfMeasurement})
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function ItemSelect({ items, value, onChange, error, required }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const searchInputRef = useRef(null);

  const selectedItem = items.find((i) => i.id.toString() === value?.toString());

  const handleSelect = (item) => {
    onChange(item.id);
    setOpen(false);
    setSearchQuery("");
  };

  // Auto-focus the search input when the popover/sheet opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const searchContent = (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          className="pl-8"
        />
      </div>
      <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
        <ItemList
          items={items}
          value={value}
          searchQuery={searchQuery}
          onSelect={handleSelect}
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
      aria-invalid={error ? "true" : "false"}
      className={cn(
        "w-full justify-between font-normal hover:bg-transparent hover:text-foreground",
        error && "border-red-500 ring-red-500",
      )}
    >
      <span
        className={cn("truncate", !selectedItem && "text-muted-foreground")}
      >
        {selectedItem
          ? `${selectedItem.name} (${selectedItem.unitOfMeasurement})`
          : "Select item..."}
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
          <SheetTitle>Select Item</SheetTitle>
        </SheetHeader>
        <div className="px-4 pt-2 pb-4 flex-1 overflow-hidden">
          {searchContent}
        </div>
      </SheetContent>
    </Sheet>
  );
}

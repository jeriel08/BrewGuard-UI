import React, { useState } from "react";
import {
  format,
  subDays,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfMonth,
  endOfWeek,
  endOfYear,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DateRangePicker({ className, date, setDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Today");

  // Initialize with current date range if none provided
  const selectedDate = date || {
    from: new Date(),
    to: new Date(),
  };

  const handleSelectPreset = (days, type = "past") => {
    const today = new Date();
    let from = today;
    let to = today;

    switch (type) {
      case "past":
        if (days === 1) {
          // Yesterday
          from = subDays(today, 1);
          to = subDays(today, 1);
        } else if (days === 0) {
          // Today
          from = today;
          to = today;
        } else {
          from = subDays(today, days - 1);
          to = today;
        }
        break;
      case "week":
        from = startOfWeek(today, { weekStartsOn: 1 });
        to = endOfWeek(today, { weekStartsOn: 1 });
        break;
      case "thisMonth":
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      case "lastMonth":
        const lastMonth = subDays(startOfMonth(today), 1);
        from = startOfMonth(lastMonth);
        to = endOfMonth(lastMonth);
        break;
      case "year":
        from = startOfYear(today);
        to = endOfYear(today);
        break;
    }

    setDate({ from, to });
    setIsOpen(false);
  };

  const presetOptions = [
    { label: "Today", action: () => handleSelectPreset(0) },
    { label: "Yesterday", action: () => handleSelectPreset(1) },
    { label: "This Week", action: () => handleSelectPreset(null, "week") },
    { label: "Last 7 Days", action: () => handleSelectPreset(7) },
    { label: "Last 28 Days", action: () => handleSelectPreset(28) },
    {
      label: "This Month",
      action: () => handleSelectPreset(null, "thisMonth"),
    },
    {
      label: "Last Month",
      action: () => handleSelectPreset(null, "lastMonth"),
    },
    { label: "This Year", action: () => handleSelectPreset(null, "year") },
  ];

  const dateLabel = selectedDate?.from
    ? selectedDate.to
      ? `${format(selectedDate.from, "LLL dd, y")} - ${format(selectedDate.to, "LLL dd, y")}`
      : format(selectedDate.from, "LLL dd, y")
    : "Pick a date range";

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "justify-center md:justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                    "px-3 md:px-4",
                  )}
                >
                  <CalendarIcon className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline-flex">{dateLabel}</span>
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent className="md:hidden">
              <p>{dateLabel}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent className="w-auto p-0" align="end" side="bottom">
          <div className="flex flex-col sm:flex-row">
            {/* Desktop preset buttons */}
            <div className="hidden sm:flex flex-col gap-1 p-3 sm:w-40 sm:min-w-40 border-e">
              {presetOptions.map((preset) => (
                <Button
                  key={preset.label}
                  variant={
                    selectedLabel === preset.label ? "secondary" : "ghost"
                  }
                  className="justify-start text-sm px-2 py-1.5 h-auto font-normal text-muted-foreground hover:text-white"
                  onClick={() => {
                    setSelectedLabel(preset.label);
                    preset.action();
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            {/* Mobile preset dropdown */}
            <div className="sm:hidden p-3 pb-0">
              <Select
                value={selectedLabel}
                onValueChange={(value) => {
                  const preset = presetOptions.find((p) => p.label === value);
                  if (preset) {
                    setSelectedLabel(value);
                    preset.action();
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preset range..." />
                </SelectTrigger>
                <SelectContent>
                  {presetOptions.map((preset) => (
                    <SelectItem key={preset.label} value={preset.label}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-2">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={selectedDate?.from}
                selected={selectedDate}
                onSelect={(newDate) => {
                  setDate(newDate);
                  setSelectedLabel(""); // Clear preset on custom selection
                  if (newDate?.from && newDate?.to) {
                    // Auto close when full range selected, optional
                  }
                }}
                numberOfMonths={1}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

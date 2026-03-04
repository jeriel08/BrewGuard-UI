import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function DatePicker({
  label,
  value,
  onChange,
  error,
  disabled,
  required,
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const selectedDate = value ? new Date(value) : undefined;

  const handleSelect = (date) => {
    onChange(date);
    setOpen(false);
  };

  const triggerButton = (
    <Button
      type="button"
      variant="outline"
      aria-invalid={error ? "true" : "false"}
      className={cn(
        "w-full justify-start text-left font-normal hover:bg-transparent hover:text-foreground",
        !selectedDate && "text-muted-foreground",
        error && "border-red-500 ring-red-500",
      )}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Pick a date..."}
    </Button>
  );

  const calendarContent = (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleSelect}
      disabled={disabled}
      initialFocus
    />
  );

  if (isDesktop) {
    return (
      <div className="space-y-2 flex flex-col">
        {label && (
          <Label>
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {calendarContent}
          </PopoverContent>
        </Popover>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2 flex flex-col">
      {label && (
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Sheet open={open} onOpenChange={setOpen}>
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {triggerButton}
        </div>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>{label || "Pick a date"}</SheetTitle>
          </SheetHeader>
          <div className="flex justify-center px-4 pb-4">{calendarContent}</div>
        </SheetContent>
      </Sheet>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

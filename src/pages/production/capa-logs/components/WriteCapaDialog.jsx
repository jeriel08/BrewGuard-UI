import React, { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Search, PenLine, FileWarning, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
  ItemDescription,
  ItemSeparator,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { getPendingCapaNcrs } from "@/features/ncr/api/ncrService";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";

export function WriteCapaDialog() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [ncrs, setNcrs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const isManager = user?.role === "Production Manager";
  const isProcurement = user?.role === "Procurement Officer";

  useEffect(() => {
    if (open) {
      const fetchNcrs = async () => {
        setLoading(true);
        try {
          const data = await getPendingCapaNcrs();
          // Backend usually filters by role, but we add double assurance
          let filtered = data;
          if (isManager) {
            filtered = data.filter(
              (c) =>
                c.itemCategory === "Finished Product" ||
                c.itemCategory === "Finished Goods",
            );
          } else if (isProcurement) {
            filtered = data.filter(
              (c) =>
                c.itemCategory === "Raw Material" ||
                c.itemCategory === "Raw Materials",
            );
          }
          setNcrs(filtered);
        } catch (error) {
          console.error("Failed to fetch pending NCRs", error);
        } finally {
          setLoading(false);
        }
      };
      fetchNcrs();
    }
  }, [open, isManager, isProcurement]);

  const filteredNcrs = ncrs.filter((ncr) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      ncr.id?.toString().includes(searchLower) ||
      ncr.batchInfo?.toLowerCase().includes(searchLower) ||
      ncr.defectDescription?.toLowerCase().includes(searchLower)
    );
  });

  const getSeverityDotClass = (severity) => {
    if (severity === "Critical") return "bg-red-500";
    if (severity === "Major") return "bg-orange-500";
    if (severity === "Minor") return "bg-yellow-500";
    return "bg-slate-500";
  };

  const ModalContent = () => (
    <div className="flex flex-col gap-4 h-full mt-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by ID, Batch, or Defect..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1 pr-4 -mr-4 h-[60vh] md:h-[50vh]">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <span className="text-sm text-muted-foreground">
              Loading NCRs...
            </span>
          </div>
        ) : filteredNcrs.length > 0 ? (
          <div className="flex flex-col gap-3 pb-4">
            {filteredNcrs.map((ncr, index) => (
              <React.Fragment key={ncr.id}>
                <Item
                  asChild
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground border border-transparent hover:border-primary-foreground/30 transition-all w-full group"
                >
                  <Link
                    to={`/capa-logs/new?ncrId=${ncr.id}`}
                    className="flex flex-col items-start w-full text-left"
                  >
                    <ItemContent className="w-full">
                      <ItemHeader className="w-full mb-1">
                        <ItemTitle className="flex items-center gap-2">
                          NCR #{ncr.id}
                          <Badge
                            variant="outline"
                            className="font-normal text-[10px] pl-1.5 pr-2 gap-1.5 group-hover:border-primary-foreground/30 group-hover:text-primary-foreground"
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${getSeverityDotClass(ncr.severity)}`}
                            />
                            {ncr.severity}
                          </Badge>
                        </ItemTitle>
                        <span className="text-[10px] text-muted-foreground shrink-0 group-hover:text-primary-foreground/80">
                          {ncr.dateLogged &&
                          !isNaN(new Date(ncr.dateLogged).getTime())
                            ? format(new Date(ncr.dateLogged), "MMM d, yyyy")
                            : "Unknown Date"}
                        </span>
                      </ItemHeader>
                      <ItemDescription className="truncate text-xs group-hover:text-primary-foreground/80">
                        {ncr.batchInfo}
                      </ItemDescription>
                    </ItemContent>
                  </Link>
                </Item>
                {index < filteredNcrs.length - 1 && <ItemSeparator />}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg bg-slate-50/50">
            <FileWarning className="h-8 w-8 text-muted-foreground/50 mb-3" />
            <h3 className="font-medium text-sm">No pending NCRs found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
              {searchQuery
                ? "Try adjusting your search terms."
                : "All NCRs have been addressed."}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );

  const TriggerButton = (
    <Button>
      <PenLine className="mr-2 h-4 w-4" />
      Write CAPA
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Pending NCR</DialogTitle>
            <DialogDescription className="sr-only">
              Select a pending non-conformance report to create a CAPA log
              against.
            </DialogDescription>
          </DialogHeader>
          <ModalContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{TriggerButton}</SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl px-4">
        <SheetHeader>
          <SheetTitle>Select Pending NCR</SheetTitle>
          <SheetDescription className="sr-only">
            Select a pending non-conformance report to create a CAPA log
            against.
          </SheetDescription>
        </SheetHeader>
        <ModalContent />
      </SheetContent>
    </Sheet>
  );
}

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle, AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getNcrs, getNcrHistory } from "@/features/ncr/api/ncrService";
import { NcrDataTable } from "./components/NcrDataTable";
import { getColumns } from "./components/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Ncr = () => {
  const { user } = useAuth();
  const isManager = user?.role === "Production Manager";
  const isProcurement = user?.role === "Procurement Officer";
  const [pendingNcrs, setPendingNcrs] = useState([]);
  const [historyNcrs, setHistoryNcrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingData, historyData] = await Promise.all([
        getNcrs(),
        getNcrHistory(),
      ]);
      let filteredPending = pendingData;
      let filteredHistory = historyData;

      if (isManager) {
        filteredPending = pendingData.filter(
          (n) =>
            n.itemCategory === "Finished Product" ||
            n.itemCategory === "Finished Goods",
        );
        filteredHistory = historyData.filter(
          (n) =>
            n.itemCategory === "Finished Product" ||
            n.itemCategory === "Finished Goods",
        );
      } else if (isProcurement) {
        filteredPending = pendingData.filter(
          (n) =>
            n.itemCategory === "Raw Material" ||
            n.itemCategory === "Raw Materials",
        );
        filteredHistory = historyData.filter(
          (n) =>
            n.itemCategory === "Raw Material" ||
            n.itemCategory === "Raw Materials",
        );
      }

      setPendingNcrs(filteredPending);
      setHistoryNcrs(filteredHistory);
    } catch (err) {
      console.error("Failed to load NCRs", err);
      setError("Failed to load NCRs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 p-4 md:px-8 md:pt-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Non-Conformance Reports
            </h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-transparent"
                >
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="sr-only">About NCRs</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">About NCRs</h4>
                    <p className="text-sm text-muted-foreground">
                      Non-Conformance Reports (NCRs) are automatically generated
                      when an inspection fails critical quality checks.
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-muted-foreground">
            View pending and active non-conformance reports.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* ... rest of the component */}
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full bg-slate-100" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Tabs
            defaultValue={isManager ? "history" : "pending"}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <NcrDataTable columns={getColumns(user)} data={pendingNcrs} />
            </TabsContent>
            <TabsContent value="history">
              <NcrDataTable columns={getColumns(user)} data={historyNcrs} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Ncr;

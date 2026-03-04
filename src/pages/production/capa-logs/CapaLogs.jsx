import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle, AlertCircle, PenLine } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getCapaLogs } from "@/features/capa/api/capaService";
import { CapaLogDataTable } from "./components/CapaLogDataTable";
import { columns } from "./components/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WriteCapaDialog } from "./components/WriteCapaDialog";

import { useAuth } from "@/context/AuthContext";

const CapaLogs = () => {
  const { user } = useAuth();
  const isManager = user?.role === "Production Manager";
  const isProcurement = user?.role === "Procurement Officer";
  const [capaLogs, setCapaLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getCapaLogs();
      let filteredData = data;

      if (isManager) {
        filteredData = data.filter(
          (c) =>
            c.itemCategory === "Finished Product" ||
            c.itemCategory === "Finished Goods",
        );
      } else if (isProcurement) {
        filteredData = data.filter(
          (c) =>
            c.itemCategory === "Raw Material" ||
            c.itemCategory === "Raw Materials",
        );
      }

      setCapaLogs(filteredData);
    } catch (err) {
      console.error("Failed to load CAPA logs", err);
      setError("Failed to load CAPA logs. Please try again.");
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
            <h2 className="text-3xl font-bold tracking-tight">CAPA Logs</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-transparent"
                >
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="sr-only">About CAPA Logs</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      About CAPA Logs
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      CAPA (Corrective and Preventive Action) Logs document root
                      cause analyses performed on non-conformances using the 5
                      Whys methodology.
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-muted-foreground">
            View all corrective and preventive action investigations.
          </p>
        </div>
        <WriteCapaDialog />
      </div>

      <div className="space-y-4">
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
          <CapaLogDataTable columns={columns} data={capaLogs} />
        )}
      </div>
    </div>
  );
};

export default CapaLogs;

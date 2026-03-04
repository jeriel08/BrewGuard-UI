import React, { useState, useRef } from "react";
import { subDays } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DateRangePicker } from "@/components/date-range-picker";
import { ProcurementReport } from "@/features/reports/components/ProcurementReport";
import { QualityReport } from "@/features/reports/components/QualityReport";
import { ManagerReport } from "@/features/reports/components/ManagerReport";
import { useAuth } from "@/context/AuthContext";
import {
  generateProcurementPdf,
  generateQualityPdf,
  generateProductionPdf,
} from "@/features/reports/utils/pdfReportGenerator";

const AdminReports = () => {
  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState("procurement");
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleExportPdf = async () => {
    setIsExporting(true);

    try {
      // Small delay to ensure charts are fully rendered
      await new Promise((resolve) => setTimeout(resolve, 300));

      const userName = user
        ? `${user.firstName} ${user.lastName}`
        : "Admin User";
      const dateRange = { from: date.from, to: date.to };

      // Get cached data from React Query
      const queryKey = [
        "reports",
        activeTab === "production" ? "production" : activeTab,
        date.from?.toISOString(),
        date.to?.toISOString(),
      ];
      const data = queryClient.getQueryData(queryKey);

      if (!data) {
        console.error("Report data not available yet");
        return;
      }

      switch (activeTab) {
        case "procurement":
          await generateProcurementPdf(data, dateRange, userName);
          break;
        case "quality":
          await generateQualityPdf(data, dateRange, userName);
          break;
        case "production":
          await generateProductionPdf(data, dateRange, userName);
          break;
      }
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:px-8 md:pt-4 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Historical performance metrics by department.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DateRangePicker date={date} setDate={setDate} />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleExportPdf}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download as PDF</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="mb-2 grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
        </TabsList>
        <TabsContent value="procurement" className="space-y-4">
          <ProcurementReport startDate={date?.from} endDate={date?.to} />
        </TabsContent>
        <TabsContent value="quality" className="space-y-4">
          <QualityReport startDate={date?.from} endDate={date?.to} />
        </TabsContent>
        <TabsContent value="production" className="space-y-4">
          <ManagerReport startDate={date?.from} endDate={date?.to} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;

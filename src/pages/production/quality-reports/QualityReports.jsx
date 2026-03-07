import React, { useState } from "react";
import { subDays } from "date-fns";
import { useProductionReport } from "@/features/reports/api/useReports";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DateRangePicker } from "@/components/date-range-picker";
import { CapaSummaryCards } from "./CapaSummaryCards";
import { NcrSeverityChart } from "./NcrSeverityChart";
import { RootCauseTrendsChart } from "./RootCauseTrendsChart";
import { MonthlyNcrChart } from "./MonthlyNcrChart";
import { ActionPlanStatusChart } from "./ActionPlanStatusChart";
import { TopRecurringDefects } from "./TopRecurringDefects";
import { ReportSkeleton } from "@/features/reports/components/ReportSkeleton";

const QualityReports = () => {
  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data, isLoading, isError, error } = useProductionReport(
    date?.from,
    date?.to,
  );

  return (
    <div className="flex-1 space-y-6 p-4 md:px-8 md:pt-4 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quality Reports</h2>
          <p className="text-muted-foreground">
            Comprehensive quality analytics and CAPA performance metrics
          </p>
        </div>
        <DateRangePicker date={date} setDate={setDate} />
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load quality reports. {error?.message}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <ReportSkeleton chartCount={1} hasSecondRow={true} />
      ) : (
        <>
          {/* Summary Cards */}
          <CapaSummaryCards data={data} loading={isLoading} />

          {/* Charts Row 1: Root Cause Trends (full width) */}
          <div className="grid gap-4 md:grid-cols-1">
            <RootCauseTrendsChart
              data={data?.rootCauseTrends}
              loading={isLoading}
            />
          </div>

          {/* Charts Row 2: NCR Severity + Action Plan Status */}
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <NcrSeverityChart
              data={data?.ncrSeverityBreakdown}
              loading={isLoading}
            />
            <ActionPlanStatusChart
              data={data?.actionPlanStatusBreakdown}
              loading={isLoading}
            />
          </div>

          {/* Charts Row 3: NCR Trend + Top Recurring Defects */}
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <MonthlyNcrChart
              data={data?.monthlyNcrCounts}
              loading={isLoading}
            />
            <TopRecurringDefects
              data={data?.topRecurringDefects}
              loading={isLoading}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default QualityReports;

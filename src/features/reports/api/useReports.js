import { useQuery } from "@tanstack/react-query";
import {
  getProcurementReport,
  getQualityReport,
  getProductionReport,
  getAdminReport,
} from "./getReports";

export const useProcurementReport = (startDate, endDate) => {
  return useQuery({
    queryKey: [
      "reports",
      "procurement",
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: () => getProcurementReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

export const useQualityReport = (startDate, endDate) => {
  return useQuery({
    queryKey: [
      "reports",
      "quality",
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: () => getQualityReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

export const useProductionReport = (startDate, endDate) => {
  return useQuery({
    queryKey: [
      "reports",
      "production",
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: () => getProductionReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

export const useAdminReport = (startDate, endDate) => {
  return useQuery({
    queryKey: [
      "reports",
      "admin",
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: () => getAdminReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

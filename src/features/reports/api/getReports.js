import api from "@/lib/axios";
import { format } from "date-fns";

const formatDate = (date) => format(date, "yyyy-MM-dd");

export const getProcurementReport = async (startDate, endDate) => {
  const response = await api.get("/reports/procurement", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });
  return response.data;
};

export const getQualityReport = async (startDate, endDate) => {
  const response = await api.get("/reports/quality", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });
  return response.data;
};

export const getProductionReport = async (startDate, endDate) => {
  const response = await api.get("/reports/production", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });
  return response.data;
};

export const getAdminReport = async (startDate, endDate) => {
  const response = await api.get("/reports/admin", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });
  return response.data;
};

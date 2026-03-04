import api from "@/lib/axios";
import { format } from "date-fns";

const formatDate = (date) => format(date, "yyyy-MM-dd");

// --- PROCUREMENT HISTORICAL REPORTS ---
export const getProcurementReport = async (startDate, endDate) => {
  const response = await api.get("/reports/procurement", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });
  return response.data;
};

export const getProcurementVolumeTrend = async (startDate, endDate) => {
  const response = await api.get("/reports/procurement/volume-trend", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });
  return response.data;
};

// --- QUALITY HISTORICAL REPORTS ---
export const getQualityReport = async (startDate, endDate) => {
  const response = await api.get("/reports/quality", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });
  return response.data;
};

export const getCuppingScoreTrend = async (startDate, endDate) => {
  const response = await api.get("/reports/quality/cupping-trend", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });
  return response.data;
};

// --- PRODUCTION MANAGER HISTORICAL REPORTS ---
export const getProductionReport = async (startDate, endDate) => {
  const response = await api.get("/reports/production", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });
  return response.data;
};

// --- ADMIN HISTORICAL REPORTS ---
export const getAdminReport = async (startDate, endDate) => {
  const response = await api.get("/reports/admin", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });
  return response.data;
};

export const getAdminPassRateTrend = async (startDate, endDate) => {
  const response = await api.get("/reports/admin/pass-rate-trend", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });
  return response.data;
};

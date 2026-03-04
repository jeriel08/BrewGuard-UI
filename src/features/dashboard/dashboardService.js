import api from "@/lib/axios";

export const getAdminStats = async () => {
  const response = await api.get("/dashboard/admin");
  return response.data;
};

export const getProcurementStats = async () => {
  const response = await api.get("/dashboard/procurement");
  return response.data;
};

export const getQualityStats = async () => {
  const response = await api.get("/dashboard/quality");
  return response.data;
};

export const getManagerStats = async () => {
  const response = await api.get("/dashboard/manager");
  return response.data;
};

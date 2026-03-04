import api from "@/lib/axios";

export const getAuditLogs = async () => {
  const response = await api.get("/audit");
  return response.data;
};

import api from "@/lib/axios";

export const getSettings = async () => {
  const response = await api.get("/settings");
  return response.data;
};

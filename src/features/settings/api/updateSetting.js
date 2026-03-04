import api from "@/lib/axios";

export const updateSetting = async ({ key, value }) => {
  const response = await api.put(`/settings/${key}`, JSON.stringify(value), {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

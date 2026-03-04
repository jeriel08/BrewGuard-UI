import api from "@/lib/axios";

export const changePassword = async (data) => {
  const response = await api.post("/auth/change-password", data);
  return response.data;
};

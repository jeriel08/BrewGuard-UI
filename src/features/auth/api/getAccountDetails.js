import api from "@/lib/axios";

export const updateAccountDetails = async (data) => {
  const response = await api.put("/auth/me/profile", data);
  return response.data;
};

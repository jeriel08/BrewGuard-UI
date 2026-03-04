import api from "@/lib/axios";

export const updateUser = async ({ userId, data }) => {
  const response = await api.put(`/auth/users/${userId}`, data);
  return response.data;
};

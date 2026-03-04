import api from "@/lib/axios";

export const updateUserStatus = async ({ userId, isActive }) => {
  const response = await api.put(`/auth/users/${userId}/status`, { isActive });
  return response.data;
};

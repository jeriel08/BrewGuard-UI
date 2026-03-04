import api from "@/lib/axios";

export const archiveUser = async (userId) => {
  const response = await api.patch(`/auth/users/${userId}/archive`);
  return response.data;
};

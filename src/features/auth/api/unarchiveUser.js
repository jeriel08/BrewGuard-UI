import api from "@/lib/axios";

export const unarchiveUser = async (userId) => {
  const response = await api.patch(`/auth/users/${userId}/restore`);
  return response.data;
};

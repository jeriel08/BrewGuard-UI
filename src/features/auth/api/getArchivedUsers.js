import api from "@/lib/axios";

export const getArchivedUsers = async () => {
  const response = await api.get("/auth/users/archived");
  return response.data;
};

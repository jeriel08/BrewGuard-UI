import api from "@/lib/axios";

export const getUsers = async () => {
  const response = await api.get("/auth/users");
  return response.data;
};

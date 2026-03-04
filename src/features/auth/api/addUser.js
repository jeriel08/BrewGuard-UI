import api from "@/lib/axios";

export const addUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

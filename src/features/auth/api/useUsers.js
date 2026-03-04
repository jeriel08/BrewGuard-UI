import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./getUsers";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

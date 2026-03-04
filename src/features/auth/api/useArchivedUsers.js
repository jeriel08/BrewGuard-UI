import { useQuery } from "@tanstack/react-query";
import { getArchivedUsers } from "./getArchivedUsers";

export const useArchivedUsers = () => {
  return useQuery({
    queryKey: ["archived-users"],
    queryFn: getArchivedUsers,
  });
};

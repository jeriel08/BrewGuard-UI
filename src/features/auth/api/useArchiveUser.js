import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveUser } from "./archiveUser";

export const useArchiveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["archived-users"] });
    },
  });
};

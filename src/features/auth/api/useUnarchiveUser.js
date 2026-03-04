import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unarchiveUser } from "./unarchiveUser";

export const useUnarchiveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unarchiveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["archived-users"] });
    },
  });
};

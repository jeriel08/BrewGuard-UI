import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserStatus } from "./updateUserStatus";

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

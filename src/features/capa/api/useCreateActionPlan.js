import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createActionPlan } from "./capaService";

export const useCreateActionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createActionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actionPlans"] });
      queryClient.invalidateQueries({ queryKey: ["capaLogs"] });
    },
  });
};

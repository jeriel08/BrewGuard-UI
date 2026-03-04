import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCapaAnalysis } from "./capaService";

export const useCreateCapaAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCapaAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["capaLogs"] });
      queryClient.invalidateQueries({ queryKey: ["ncrs"] });
    },
  });
};

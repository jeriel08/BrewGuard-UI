import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyAndCloseCapa } from "./capaService";

export const useCloseCapa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyAndCloseCapa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["capaLogs"] });
      queryClient.invalidateQueries({ queryKey: ["ncrs"] });
      queryClient.invalidateQueries({ queryKey: ["ncrHistory"] });
    },
  });
};

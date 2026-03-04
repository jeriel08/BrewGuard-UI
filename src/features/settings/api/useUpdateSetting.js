import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSetting } from "./updateSetting";
import { toast } from "sonner"; // Assuming sonner is used for toasts based on other files

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Setting updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update setting");
      console.error("Error updating setting:", error);
    },
  });
};

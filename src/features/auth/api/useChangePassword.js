import { useMutation } from "@tanstack/react-query";
import { changePassword } from "./changePassword";
import { toast } from "sonner";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully.");
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to change password.",
      );
    },
  });
};

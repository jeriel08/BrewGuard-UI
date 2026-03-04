import { useMutation } from "@tanstack/react-query";
import { updateAccountDetails } from "./getAccountDetails";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const useUpdateAccount = () => {
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: updateAccountDetails,
    onSuccess: async () => {
      await refreshUser();
      toast.success("Profile updated successfully.");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    },
  });
};

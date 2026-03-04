import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUser } from "./addUser";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useAddUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      toast.success("User registered successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Assuming there's a users query
      navigate("/users");
    },
    onError: (error) => {
      console.error("Registration error:", error);
      toast.error(error.response?.data || "Failed to register user.");
    },
  });
};

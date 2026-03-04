import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useUsers } from "@/features/auth/api/useUsers";
import { useUpdateUser } from "@/features/auth/api/useUpdateUser";
import { useAuth } from "@/context/AuthContext";
import { branchService } from "@/features/branches/api/branchService";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: users, isLoading: isLoadingUsers } = useUsers();
  const updateUserMutation = useUpdateUser();
  const { user: currentUser } = useAuth(); // Rename to avoid conflict with 'user' variable

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    branchId: null,
  });

  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: branchService.getAllBranches,
    enabled: currentUser?.role === "Super Admin",
  });

  useEffect(() => {
    if (users && id) {
      const user = users.find((u) => u.id === parseInt(id));

      if (user) {
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role || "", // Ensure it's not undefined
          branchId: user.branchId,
        });
      } else {
        toast.error("User not found.");
        navigate("/users");
      }
    }
  }, [users, id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleBranchChange = (value) => {
    setFormData((prev) => ({ ...prev, branchId: parseInt(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.role
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (currentUser?.role === "Super Admin" && !formData.branchId) {
      toast.error("Please select a branch.");
      return;
    }

    updateUserMutation.mutate(
      { userId: id, data: formData },
      {
        onSuccess: () => {
          toast.success("User updated successfully.");
          navigate("/users");
        },
        onError: (error) => {
          toast.error(error.response?.data || "Failed to update user.");
        },
      },
    );
  };

  if (isLoadingUsers) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:px-8 md:pt-4 pt-6 w-full max-w-2xl mx-auto items-center">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Edit User</h2>
        <p className="text-muted-foreground">
          Update user details and permissions.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-lg text-left"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john.doe@brewguard.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            key={formData.role}
            onValueChange={handleRoleChange}
            value={formData.role}
          >
            <SelectTrigger className="w-full md:min-w-[200px]">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {currentUser?.role === "Super Admin" && (
                <SelectItem value="Super Admin">Super Admin</SelectItem>
              )}
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Procurement Officer">
                Procurement Officer
              </SelectItem>
              <SelectItem value="Quality Inspector">
                Quality Inspector
              </SelectItem>
              <SelectItem value="Production Manager">
                Production Manager
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {currentUser?.role === "Super Admin" && (
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Select
              onValueChange={handleBranchChange}
              value={
                formData.branchId ? formData.branchId.toString() : undefined
              }
            >
              <SelectTrigger className="w-full md:min-w-[200px]">
                <SelectValue placeholder="Select a branch" />
              </SelectTrigger>
              <SelectContent>
                {branches?.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex justify-center gap-2 pt-4">
          <Button type="submit" disabled={updateUserMutation.isPending}>
            {updateUserMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/users")}
            disabled={updateUserMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;

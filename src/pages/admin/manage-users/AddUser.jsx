import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAddUser } from "@/features/auth/api/useAddUser";
import { useAuth } from "@/context/AuthContext";
import { branchService } from "@/features/branches/api/branchService";

const AddUser = () => {
  const navigate = useNavigate();
  const addUserMutation = useAddUser();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    branchId: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: branchService.getAllBranches,
    enabled: user?.role === "Super Admin",
  });

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
      !formData.password ||
      !formData.role
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (user?.role === "Super Admin" && !formData.branchId) {
      toast.error("Please select a branch.");
      return;
    }

    const finalFormData = { ...formData };

    // Auto-assign branch for Admin users
    if (user?.role !== "Super Admin" && user?.branchId) {
      finalFormData.branchId = user.branchId;
    }

    addUserMutation.mutate(finalFormData);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:px-8 md:pt-4 pt-6 w-full max-w-2xl mx-auto items-center">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Add New User</h2>
        <p className="text-muted-foreground">
          Create a new user account with specific permissions.
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
          <Select onValueChange={handleRoleChange} value={formData.role}>
            <SelectTrigger className="w-full md:min-w-[200px]">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {user?.role === "Super Admin" && (
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

        {user?.role === "Super Admin" && (
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Select
              onValueChange={handleBranchChange}
              value={formData.branchId?.toString()}
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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Secure password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
        </div>

        <div className="flex justify-center gap-2 pt-4">
          <Button type="submit" disabled={addUserMutation.isPending}>
            {addUserMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create User
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/users")}
            disabled={addUserMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;

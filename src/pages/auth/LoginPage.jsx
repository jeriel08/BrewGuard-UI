import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";

// Context & API
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/features/auth/api/loginUser";

// UI Components
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ModeToggle } from "@/components/mode-toggle";

// 1. Validation Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login, loading } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 2. Setup Form
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  // 3. Handle Submission
  const onSubmit = async (values) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await loginUser(values);
      await login(data.token); // Update global auth state
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage(
        error.response?.data?.message || "Invalid email or password.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 relative">
      {/* Mobile Mode Toggle */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 md:hidden">
        <ModeToggle />
      </div>

      <div className="w-full max-w-sm md:max-w-4xl">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden p-0 shadow-xl">
            <CardContent className="grid p-0 md:grid-cols-2 min-h-[600px]">
              {/* LEFT SIDE: LOGO & ACCENT */}
              <div className="relative hidden flex-col items-center justify-center bg-[#f6f7f1] dark:bg-sidebar-ring md:flex">
                <img
                  src="/BrewGuard-transparent.png"
                  alt="BrewGuard Logo"
                  className="size-84"
                />
              </div>

              {/* RIGHT SIDE: FORM */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="relative p-6 md:p-8 flex flex-col justify-center h-full"
                >
                  {/* Desktop Mode Toggle */}
                  <div className="absolute top-4 right-4 hidden md:block">
                    <ModeToggle />
                  </div>

                  <div className="flex flex-col gap-6">
                    {/* Header Text */}
                    <div className="flex flex-col items-center text-center">
                      {/* Mobile Logo */}
                      <div className="dark:bg-sidebar-ring rounded-lg md:hidden mb-3">
                        <img
                          src="/BrewGuard-transparent.png"
                          alt="BrewGuard Logo"
                          className="size-40"
                        />
                      </div>
                      <h1 className="text-2xl font-bold">Welcome back</h1>
                      <p className="text-muted-foreground text-balance">
                        Login to your BrewGuard account
                      </p>
                    </div>

                    {/* Email Input */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="admin@brewguard.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Input */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <Link
                              to="/forgot-password"
                              className="text-sm underline-offset-2 hover:underline text-muted-foreground"
                            >
                              Forgot your password?
                            </Link>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                {...field}
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
                                  {showPassword
                                    ? "Hide password"
                                    : "Show password"}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Error Alert */}
                    {errorMessage && (
                      <div className="p-3 text-sm font-medium text-red-600 bg-red-50 rounded-md border border-red-200 text-center">
                        {errorMessage}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isLoading ? "Signing in..." : "Login"}
                    </Button>

                    {/* Footer Text */}
                    <div className="text-center text-sm">
                      Don&apos;t have an account?{" "}
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=sanaojeriellian@gmail.com&su=BrewGuard%20Access%20Request&body=Hello%20Admin%2C%0D%0A%0D%0AI%20am%20a%20new%20employee%20and%20need%20access%20to%20BrewGuard.%0D%0A%0D%0AName%3A%20%5BInsert%20Name%5D%0D%0ARole%3A%20%5BInsert%20Role%5D"
                        className="text-muted-foreground hover:text-primary hover:underline cursor-pointer"
                        target="_blank"
                      >
                        Contact Admin
                      </a>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

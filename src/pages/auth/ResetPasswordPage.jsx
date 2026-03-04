import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";

import { resetPassword } from "@/features/auth/api/resetPassword";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrorMessage("Invalid or missing reset token.");
    }
  }, [token]);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    if (!token) {
      setErrorMessage("Missing reset token.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await resetPassword({
        token,
        newPassword: values.password,
      });
      setSuccessMessage("Password successfully reset. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Reset password failed", error);
      setErrorMessage(
        error.response?.data ||
          "Failed to reset password. Token may be invalid or expired.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
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
              <div className="p-6 md:p-8 flex flex-col justify-center h-full relative">
                {!successMessage && (
                  <Link
                    to="/login"
                    className="absolute top-6 left-6 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Link>
                )}

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                  >
                    {successMessage ? (
                      <div className="flex flex-col items-center justify-center h-full gap-4">
                        <Spinner className="size-12 text-primary" />
                        <p className="text-center font-medium text-muted-foreground animate-pulse">
                          Taking you to login...
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col items-center text-center">
                          {/* Mobile Logo */}
                          <div className="dark:bg-sidebar-ring rounded-lg md:hidden mb-3">
                            <img
                              src="/BrewGuard-transparent.png"
                              alt="BrewGuard Logo"
                              className="size-40"
                            />
                          </div>
                          <h1 className="text-2xl font-bold">Reset Password</h1>
                          <p className="text-muted-foreground text-balance">
                            Enter your new password below.
                          </p>
                        </div>

                        {/* Form Fields */}
                        {!successMessage && (
                          <>
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}

                        {/* Success Alert */}
                        {successMessage && (
                          <div className="hidden">
                            {/* Hidden to keep layout but logic handles display above */}
                          </div>
                        )}

                        {/* Error Alert */}
                        {errorMessage && (
                          <div className="p-3 text-sm font-medium text-red-600 bg-red-50 rounded-md border border-red-200 text-center">
                            {errorMessage}
                          </div>
                        )}

                        {!successMessage && (
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                          >
                            {isLoading && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isLoading ? "Resetting..." : "Reset Password"}
                          </Button>
                        )}
                      </>
                    )}
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

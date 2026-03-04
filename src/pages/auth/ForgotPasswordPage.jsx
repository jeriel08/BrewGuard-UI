import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";

import { forgotPassword } from "@/features/auth/api/forgotPassword";
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

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await forgotPassword(values.email);
      setSuccessMessage(
        "If that email exists, a reset link has been sent. Check your inbox.",
      );
      form.reset();
    } catch (error) {
      console.error("Forgot password failed", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
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
                <Link
                  to="/login"
                  className="absolute top-6 left-6 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Mobile Logo */}
                      <div className="dark:bg-sidebar-ring rounded-lg md:hidden mb-3">
                        <img
                          src="/BrewGuard-transparent.png"
                          alt="BrewGuard Logo"
                          className="size-40"
                        />
                      </div>
                      <h1 className="text-2xl font-bold">Forgot Password</h1>
                      <p className="text-muted-foreground text-balance">
                        Enter your email to receive a password reset link.
                      </p>
                    </div>

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

                    {/* Success Alert */}
                    {successMessage && (
                      <div className="p-3 text-sm font-medium text-green-600 bg-green-50 rounded-md border border-green-200 text-center">
                        {successMessage}
                      </div>
                    )}

                    {/* Error Alert */}
                    {errorMessage && (
                      <div className="p-3 text-sm font-medium text-red-600 bg-red-50 rounded-md border border-red-200 text-center">
                        {errorMessage}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
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

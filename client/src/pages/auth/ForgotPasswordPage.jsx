import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsEmailSent(true);
        toast.success("Password reset email sent!");
      } else {
        toast.error(
          result.message || "Failed to send reset email. Please try again.",
        );
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <AuthLayout title="Check your email" subtitle="Password reset link sent">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-card-foreground">
              Reset link sent!
            </h3>
            <p className="text-muted-foreground">
              We've sent a password reset link to{" "}
              <span className="font-medium text-foreground">
                {getValues("email")}
              </span>
            </p>
          </div>

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Click the link in your email to reset your password. The link
              expires in 10 minutes.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">Back to Sign In</Link>
            </Button>

            <button
              onClick={() => setIsEmailSent(false)}
              className="text-sm text-primary hover:underline"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email to receive a reset link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            We'll send you a secure link to reset your password. Make sure to
            check your spam folder.
          </AlertDescription>
        </Alert>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>

        {/* Back to Login */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Remember your password?{" "}
          </span>
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </form>

      {/* Help Section */}
      <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
        <h3 className="font-medium text-card-foreground mb-2">Need help?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          If you're having trouble accessing your account, contact our support
          team.
        </p>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to="/contact">Contact Support</Link>
        </Button>
      </div>
    </AuthLayout>
  );
}

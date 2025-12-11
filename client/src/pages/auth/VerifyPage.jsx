import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VerifyPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;

      if (!token) {
        setStatus("error");
        setMessage(
          "Invalid verification link. Please check your email and try again.",
        );
        return;
      }

      try {
        const response = await fetch(`/api/v1/users/verify/${token}`, {
          method: "GET",
        });

        const result = await response.json();

        if (result.success) {
          setStatus("success");
          setMessage(
            "Your email has been successfully verified! You can now sign in to your account.",
          );
          toast.success("Email verified successfully!");

          // Redirect to login after 7 seconds
          setTimeout(() => {
            navigate("/login");
          }, 7000);
        } else {
          setStatus("error");
          setMessage(
            result.message || "Verification failed. The link may have expired.",
          );
          toast.error("Verification failed");
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again later.");
        toast.error("Something went wrong");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground mb-2">
                Verifying your email...
              </h2>
              <p className="text-muted-foreground">
                Please wait while we verify your email address.
              </p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground mb-2">
                Email Verified Successfully!
              </h2>
              <p className="text-muted-foreground mb-4">{message}</p>
              <p className="text-sm text-muted-foreground">
                Redirecting to login page in a few seconds...
              </p>
            </div>
            <Button asChild className="w-full">
              <Link to="/login">Continue to Sign In</Link>
            </Button>
          </div>
        );

      case "error":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground mb-2">
                Verification Failed
              </h2>
              <p className="text-muted-foreground mb-4">{message}</p>
            </div>

            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                If you're having trouble, please check your email for a new
                verification link or contact support.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link to="/register">Create New Account</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/login">Back to Sign In</Link>
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AuthLayout
      title="Email Verification"
      subtitle="Confirming your email address"
    >
      {renderContent()}
    </AuthLayout>
  );
}

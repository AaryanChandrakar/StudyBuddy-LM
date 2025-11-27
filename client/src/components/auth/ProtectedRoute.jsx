import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import useAuthStore from "@/stores/authStore";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, fetchProfile } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        // Try to fetch user profile to check if logged in
        await fetchProfile();
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [isAuthenticated, fetchProfile]);

  // Show loading spinner while checking authentication
  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return children;
}

import { Outlet, useLocation } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Header from "@/components/layout/Header";

export default function Layout() {
  const location = useLocation();
  const hideHeader = location.pathname.includes("/notebook/");

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {!hideHeader && <Header />}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
}

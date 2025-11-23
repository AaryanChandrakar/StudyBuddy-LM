import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/layout/Layout";
import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/pages/DashboardPage";
import NotebookPage from "@/pages/NotebookPage";
import ProfilePage from "@/pages/ProfilePage";
import StatsPage from "@/pages/StatsPage";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import VerifyPage from "@/pages/auth/VerifyPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify/:token" element={<VerifyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          {/* Protected Routes */}
          <Route path="/app" element={<Layout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="notebook/:id" element={<NotebookPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="stats" element={<StatsPage />} />
          </Route>
        </Routes>

        <Toaster position="top-right" />
      </Router>
    </ThemeProvider>
  );
}

export default App;

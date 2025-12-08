import { create } from "zustand";
import { toast } from "sonner";

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await fetch("/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        set({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
        });
        toast.success("Welcome back!");
        return { success: true };
      } else {
        set({ isLoading: false });
        const errorMessage =
          result.message === "Please verify your email"
            ? "Please verify your email before signing in."
            : result.message || "Invalid email or password.";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch {
      set({ isLoading: false });
      toast.error("Something went wrong. Please try again.");
      return { success: false, error: "Network error" };
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });

    try {
      const response = await fetch("/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();
      set({ isLoading: false });

      if (result.success) {
        toast.success(
          "Registration successful! Please check your email to verify your account.",
        );
        return { success: true };
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
        return { success: false, error: result.message };
      }
    } catch {
      set({ isLoading: false });
      toast.error("Something went wrong. Please try again.");
      return { success: false, error: "Network error" };
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await fetch("/api/v1/users/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.success("Logged out successfully");
    }
  },

  fetchProfile: async () => {
    set({ isLoading: true });

    try {
      const response = await fetch("/api/v1/users/profile", {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        set({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return { success: false };
      }
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return { success: false };
    }
  },

  fetchStats: async () => {
    try {
      const response = await fetch("/api/v1/users/stats", {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        // Update user with stats
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              credits: result.stats.credits,
              dataSourcesCount: result.stats.dataSourcesCount,
            },
          });
        }
        return result.stats;
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
    return null;
  },
}));

export default useAuthStore;

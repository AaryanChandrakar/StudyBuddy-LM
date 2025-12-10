import { create } from "zustand";
import { toast } from "sonner";

const useNotebookStore = create((set, get) => ({
  notebooks: [],
  currentNotebook: null,
  contents: [],
  isLoading: false,

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  fetchNotebooks: async () => {
    set({ isLoading: true });

    try {
      const response = await fetch("/api/v1/notebooks", {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        set({
          notebooks: result.notebooks,
          isLoading: false,
        });
        return result.notebooks;
      } else {
        set({ isLoading: false });
        toast.error("Failed to load notebooks");
        return [];
      }
    } catch {
      set({ isLoading: false });
      toast.error("Failed to load notebooks");
      return [];
    }
  },

  createNotebook: async (title, description = "") => {
    set({ isLoading: true });

    try {
      const response = await fetch("/api/v1/notebooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });

      const result = await response.json();

      if (result.success) {
        const currentNotebooks = get().notebooks;
        set({
          notebooks: [result.notebook, ...currentNotebooks],
          isLoading: false,
        });
        toast.success("Notebook created successfully!");
        return { success: true, notebook: result.notebook };
      } else {
        set({ isLoading: false });
        toast.error(result.message || "Failed to create notebook");
        return { success: false, error: result.message };
      }
    } catch {
      set({ isLoading: false });
      toast.error("Failed to create notebook");
      return { success: false, error: "Network error" };
    }
  },

  fetchNotebook: async (notebookId) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`/api/v1/notebooks/${notebookId}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        set({
          currentNotebook: result.notebook,
          contents: result.contents,
          isLoading: false,
        });
        return {
          success: true,
          notebook: result.notebook,
          contents: result.contents,
        };
      } else {
        set({ isLoading: false });
        toast.error("Failed to load notebook");
        return { success: false };
      }
    } catch {
      set({ isLoading: false });
      toast.error("Failed to load notebook");
      return { success: false };
    }
  },

  updateNotebook: async (notebookId, title, description = "") => {
    try {
      const response = await fetch(`/api/v1/notebooks/${notebookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });

      const result = await response.json();

      if (result.success) {
        // Update notebooks list
        const currentNotebooks = get().notebooks;
        const updatedNotebooks = currentNotebooks.map((notebook) =>
          notebook._id === notebookId ? result.notebook : notebook,
        );

        set({ notebooks: updatedNotebooks });

        // Update current notebook if it's the one being edited
        const currentNotebook = get().currentNotebook;
        if (currentNotebook && currentNotebook._id === notebookId) {
          set({ currentNotebook: result.notebook });
        }

        toast.success("Notebook updated successfully!");
        return { success: true, notebook: result.notebook };
      } else {
        toast.error(result.message || "Failed to update notebook");
        return { success: false };
      }
    } catch {
      toast.error("Failed to update notebook");
      return { success: false };
    }
  },

  deleteNotebook: async (notebookId) => {
    try {
      const response = await fetch(`/api/v1/notebooks/${notebookId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        // Remove from notebooks list
        const currentNotebooks = get().notebooks;
        const updatedNotebooks = currentNotebooks.filter(
          (notebook) => notebook._id !== notebookId,
        );

        set({ notebooks: updatedNotebooks });

        // Clear current notebook if it was deleted
        const currentNotebook = get().currentNotebook;
        if (currentNotebook && currentNotebook._id === notebookId) {
          set({ currentNotebook: null, contents: [] });
        }

        toast.success("Notebook deleted successfully!");
        return { success: true };
      } else {
        toast.error(result.message || "Failed to delete notebook");
        return { success: false };
      }
    } catch {
      toast.error("Failed to delete notebook");
      return { success: false };
    }
  },

  // Add content to current notebook
  addContent: (content) => {
    const currentContents = get().contents;
    set({ contents: [content, ...currentContents] });
  },

  // Update content in current notebook
  updateContent: (contentId, updatedContent) => {
    const currentContents = get().contents;
    const updatedContents = currentContents.map((content) =>
      content._id === contentId ? { ...content, ...updatedContent } : content,
    );
    set({ contents: updatedContents });
  },

  // Remove content from current notebook
  removeContent: (contentId) => {
    const currentContents = get().contents;
    const updatedContents = currentContents.filter(
      (content) => content._id !== contentId,
    );
    set({ contents: updatedContents });
  },

  // Clear current notebook data
  clearCurrentNotebook: () => {
    set({ currentNotebook: null, contents: [] });
  },
}));

export default useNotebookStore;

import { create } from "zustand";
import { toast } from "sonner";

const useChatStore = create((set, get) => ({
  messages: [],
  selectedSources: [],
  isLoading: false,
  currentQuery: "",

  setSelectedSources: (sources) => {
    set({ selectedSources: sources });
  },

  addSelectedSource: (sourceId) => {
    const currentSources = get().selectedSources;
    if (!currentSources.includes(sourceId)) {
      set({ selectedSources: [...currentSources, sourceId] });
    }
  },

  removeSelectedSource: (sourceId) => {
    const currentSources = get().selectedSources;
    set({ selectedSources: currentSources.filter((id) => id !== sourceId) });
  },

  addMessage: (message) => {
    const currentMessages = get().messages;
    set({ messages: [...currentMessages, message] });
  },

  sendQuery: async (notebookId, query) => {
    const { selectedSources } = get();

    if (selectedSources.length === 0) {
      toast.error("Please select at least one content source");
      return { success: false };
    }

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    get().addMessage(userMessage);
    set({ currentQuery: query, isLoading: true });

    try {
      const response = await fetch("/api/v1/chat/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          notebookId,
          query,
          selectedContentIds: selectedSources,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Add assistant message
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.response,
          citations: result.citations,
          tokensUsed: result.tokensUsed,
          creditsDeducted: result.creditsDeducted,
          timestamp: new Date(),
        };

        get().addMessage(assistantMessage);

        // Update user credits in auth store if available
        if (window.useAuthStore) {
          const authStore = window.useAuthStore.getState();
          if (authStore.user) {
            authStore.setUser({
              ...authStore.user,
              credits: result.creditsRemaining,
            });
          }
        }

        set({ currentQuery: "", isLoading: false });
        return { success: true, response: result.response };
      } else {
        toast.error(result.message || "Failed to process query");
        set({ isLoading: false });
        return { success: false, error: result.message };
      }
    } catch {
      toast.error("Failed to send message");
      set({ isLoading: false });
      return { success: false, error: "Network error" };
    }
  },

  // Clear chat history
  clearChat: () => {
    set({ messages: [] });
  },

  // Clear all chat data
  clearChatData: () => {
    set({
      messages: [],
      selectedSources: [],
      isLoading: false,
      currentQuery: "",
    });
  },
}));

export default useChatStore;

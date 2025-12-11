import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, MessageSquare, FileText } from "lucide-react";

import useNotebookStore from "@/stores/notebookStore";
import useChatStore from "@/stores/chatStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SourcesPanel from "@/components/notebook/SourcesPanel";
import ChatPanel from "@/components/notebook/ChatPanel";
import AddContentDialog from "@/components/notebook/AddContentDialog";

export default function NotebookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentNotebook,
    contents,
    isLoading,
    fetchNotebook,
    clearCurrentNotebook,
  } = useNotebookStore();
  const { clearChatData } = useChatStore();
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  useEffect(() => {
    if (id) {
      fetchNotebook(id);
    }

    // Cleanup when component unmounts
    return () => {
      clearCurrentNotebook();
      clearChatData();
    };
  }, [id, fetchNotebook, clearCurrentNotebook, clearChatData]);

  const handleBack = () => {
    navigate("/app/dashboard");
  };

  const toggleMobileChat = () => {
    setShowMobileChat(!showMobileChat);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading notebook...</p>
        </div>
      </div>
    );
  }

  if (!currentNotebook) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Notebook not found
          </h2>
          <p className="text-muted-foreground">
            The notebook you're looking for doesn't exist.
          </p>
          <Button onClick={handleBack}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    {currentNotebook.title}
                  </h1>
                  {currentNotebook.description && (
                    <p className="text-sm text-muted-foreground">
                      {currentNotebook.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:flex">
                {contents.length} {contents.length === 1 ? "source" : "sources"}
              </Badge>

              <Button onClick={() => setIsAddContentOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex h-[calc(100vh-70px)]">
        {/* Sources Panel - Left Side (Desktop) / Toggle Panel (Mobile) */}
        <div
          className={`w-full md:w-1/3 border-r border-border bg-card/30 ${
            showMobileChat ? "hidden md:block" : "block"
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border bg-card/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                  <h2 className="font-semibold text-card-foreground">
                    Sources
                  </h2>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="secondary">{contents.length}</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Select sources to chat with your documents
              </p>
            </div>

            <div className="flex-1 overflow-hidden">
              <SourcesPanel
                contents={contents}
                notebookId={id}
                onAddContent={() => setIsAddContentOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Chat Panel - Right Side (Desktop) / Toggle Panel (Mobile) */}
        <div
          className={`w-full md:w-2/3 bg-background ${
            showMobileChat ? "block" : "hidden md:block"
          }`}
        >
          <div className="w-full h-full flex flex-col">
            <div className="p-4 border-b border-border bg-card/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <h2 className="font-semibold text-card-foreground">Chat</h2>
                </div>
                {/* Mobile back to sources button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setShowMobileChat(false)}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ask questions about your selected sources
              </p>
            </div>

            <div className="flex-1 overflow-hidden">
              <ChatPanel notebookId={id} />
            </div>
          </div>
        </div>

        {/* Mobile Chat Toggle - Only visible on mobile when not in chat view */}
        {!showMobileChat && (
          <div className="md:hidden fixed bottom-4 right-4">
            <Button
              size="lg"
              className="rounded-full shadow-lg"
              onClick={toggleMobileChat}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Chat
            </Button>
          </div>
        )}
      </div>

      {/* Add Content Dialog */}
      <AddContentDialog
        open={isAddContentOpen}
        onOpenChange={setIsAddContentOpen}
        notebookId={id}
      />
    </div>
  );
}

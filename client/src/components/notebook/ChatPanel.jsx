import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import useChatStore from "@/stores/chatStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ChatPanel({ notebookId }) {
  const { messages, selectedSources, isLoading, sendQuery, clearChat } =
    useChatStore();

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    if (selectedSources.length === 0) {
      toast.error("Please select at least one source to chat with");
      return;
    }

    const query = inputMessage.trim();
    setInputMessage("");

    await sendQuery(notebookId, query);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (selectedSources.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="p-4 bg-muted/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Bot className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Select sources to start chatting
          </h3>
          <p className="text-muted-foreground text-sm">
            Choose documents, websites, or other content from the left panel to
            begin asking questions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Ready to chat!
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Ask questions about your selected sources. I'll provide answers
                with citations from your documents.
              </p>
              <div className="mt-4">
                <Badge variant="secondary">
                  {selectedSources.length} source
                  {selectedSources.length !== 1 ? "s" : ""} selected
                </Badge>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border"
                  } rounded-lg p-3`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>

                  {/* Citations for assistant messages */}
                  {message.role === "assistant" &&
                    message.citations &&
                    message.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-2">
                          Sources:
                        </p>
                        <div className="space-y-1">
                          {message.citations.map((citation, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs"
                            >
                              <Badge variant="outline" className="text-xs">
                                {citation.sourceType}
                              </Badge>
                              <span className="text-muted-foreground truncate flex-1">
                                {citation.title}
                              </span>
                              <span className="text-muted-foreground">
                                {Math.round(citation.relevanceScore * 100)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Message metadata */}
                  <div className="mt-2 flex items-center justify-between text-xs opacity-70">
                    <span>{formatTime(message.timestamp)}</span>
                    {message.role === "assistant" &&
                      message.creditsDeducted && (
                        <span>{message.creditsDeducted} credits</span>
                      )}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card/50">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a question about your selected sources..."
              className="min-h-[80px] pr-12 resize-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8"
              disabled={
                !inputMessage.trim() ||
                isLoading ||
                selectedSources.length === 0
              }
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>
                {selectedSources.length} source
                {selectedSources.length !== 1 ? "s" : ""} selected
              </span>
              {messages.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="h-6 text-xs"
                >
                  Clear chat
                </Button>
              )}
            </div>
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
        </form>
      </div>
    </div>
  );
}

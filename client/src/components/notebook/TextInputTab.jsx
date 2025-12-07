import { useState } from "react";
import { Type, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TextInputTab({ notebookId, onContentAdded }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!text.trim()) {
      toast.error("Please enter some text");
      return;
    }

    if (text.trim().length < 10) {
      toast.error("Text must be at least 10 characters long");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/v1/content/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          notebookId,
          title: title.trim(),
          text: text.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Text content added successfully!");
        onContentAdded(result.content);

        // Reset form
        setTitle("");
        setText("");
      } else {
        toast.error(result.message || "Failed to add text content");
      }
    } catch {
      toast.error("Failed to add text content. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = text.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div className="space-y-2">
        <Label htmlFor="text-title">Title</Label>
        <Input
          id="text-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for this text content"
          required
        />
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <Label htmlFor="text-content">Text Content</Label>
        <Textarea
          id="text-content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text content here..."
          className="min-h-[200px] resize-none"
          required
        />

        {/* Character/Word Count */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {charCount} characters • {wordCount} words
          </span>
          <span>
            {text.trim().length >= 10 ? (
              <span className="text-green-600 dark:text-green-400">
                ✓ Minimum length met
              </span>
            ) : (
              <span className="text-yellow-600 dark:text-yellow-400">
                {10 - text.trim().length} more characters needed
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isProcessing || !title.trim() || text.trim().length < 10}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Type className="w-4 h-4 mr-2" />
            Add Text Content
          </>
        )}
      </Button>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Text content will be processed and indexed immediately. You can paste
          articles, research notes, or any text-based information you'd like to
          query.
        </AlertDescription>
      </Alert>
    </form>
  );
}

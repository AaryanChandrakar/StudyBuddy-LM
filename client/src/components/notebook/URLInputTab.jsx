import { useState } from "react";
import { Globe, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function URLInputTab({ notebookId, onContentAdded }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const validateUrl = (urlString) => {
    try {
      const urlObj = new URL(urlString);
      return ["http:", "https:"].includes(urlObj.protocol);
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    if (!validateUrl(url.trim())) {
      toast.error("Please enter a valid HTTP or HTTPS URL");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/v1/content/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          notebookId,
          title: title.trim() || undefined,
          url: url.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("URL content added successfully!");
        onContentAdded(result.content);

        // Reset form
        setTitle("");
        setUrl("");
      } else {
        toast.error(result.message || "Failed to add URL content");
      }
    } catch {
      toast.error("Failed to add URL content. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    // Clear title when URL changes so backend can auto-detect
    if (title && !title.includes("Manual Title")) {
      setTitle("");
    }
  };

  const isValidUrl = url.trim() ? validateUrl(url.trim()) : true;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="url-input">Website URL</Label>
        <div className="relative">
          <Input
            id="url-input"
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://example.com/article"
            className={!isValidUrl ? "border-destructive" : ""}
            required
          />
          <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        {!isValidUrl && (
          <p className="text-sm text-destructive">
            Please enter a valid HTTP or HTTPS URL
          </p>
        )}
      </div>

      {/* Title Input (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="url-title">
          Title{" "}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Input
          id="url-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Leave empty to use webpage title"
        />
        <p className="text-xs text-muted-foreground">
          If left empty, we'll automatically use the webpage's title
        </p>
      </div>

      {/* URL Preview */}
      {url && isValidUrl && (
        <div className="p-3 bg-secondary/50 rounded-lg border">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Preview:</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate flex-1"
            >
              {url}
            </a>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isProcessing || !url.trim() || !isValidUrl}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Globe className="w-4 h-4 mr-2" />
            Add Website Content
          </>
        )}
      </Button>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          We'll extract the main content from the webpage and make it
          searchable. This works best with articles, blog posts, and
          documentation pages.
        </AlertDescription>
      </Alert>

      {/* Supported Sites Info */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p className="font-medium">Works well with:</p>
        <p>• News articles and blog posts</p>
        <p>• Documentation and help pages</p>
        <p>• Research papers and academic content</p>
        <p>• Most text-heavy websites</p>
      </div>
    </form>
  );
}

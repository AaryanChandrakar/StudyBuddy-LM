import { useState } from "react";
import { Youtube, Loader2, AlertCircle, Play } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function YoutubeInputTab({ notebookId, onContentAdded }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const validateYouTubeUrl = (urlString) => {
    if (!urlString) return false;

    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    ];

    return patterns.some((pattern) => pattern.test(urlString));
  };

  const extractVideoId = (urlString) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = urlString.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    if (!validateYouTubeUrl(url.trim())) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/v1/content/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          notebookId,
          title: title.trim() || undefined, // Let backend use video title if empty
          url: url.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("YouTube content added successfully!");
        onContentAdded(result.content);

        // Reset form
        setTitle("");
        setUrl("");
      } else {
        toast.error(result.message || "Failed to add YouTube content");
      }
    } catch {
      toast.error("Failed to add YouTube content. Please try again.");
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

  const isValidUrl = url.trim() ? validateYouTubeUrl(url.trim()) : true;
  const videoId = url.trim() ? extractVideoId(url.trim()) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* YouTube URL Input */}
      <div className="space-y-2">
        <Label htmlFor="youtube-url">YouTube URL</Label>
        <div className="relative">
          <Input
            id="youtube-url"
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className={!isValidUrl ? "border-destructive" : ""}
            required
          />
          <Youtube className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        {!isValidUrl && (
          <p className="text-sm text-destructive">
            Please enter a valid YouTube URL
          </p>
        )}
      </div>

      {/* Title Input (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="youtube-title">
          Title{" "}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Input
          id="youtube-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Leave empty to use video title"
        />
        <p className="text-xs text-muted-foreground">
          If left empty, we'll automatically use the video's title
        </p>
      </div>

      {/* Video Preview */}
      {videoId && isValidUrl && (
        <div className="space-y-3">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="bg-red-600 text-white rounded-full p-3">
                <Play className="h-6 w-6 fill-current" />
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Preview of video content to be processed
          </p>
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
            <Youtube className="w-4 h-4 mr-2" />
            Add YouTube Content
          </>
        )}
      </Button>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          We'll extract the transcript from the YouTube video and make it
          searchable. This works with most public videos that have captions or
          auto-generated transcripts.
        </AlertDescription>
      </Alert>

      {/* Supported URL Formats */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p className="font-medium">Supported URL formats:</p>
        <p>• https://www.youtube.com/watch?v=VIDEO_ID</p>
        <p>• https://youtu.be/VIDEO_ID</p>
        <p>• https://youtube.com/embed/VIDEO_ID</p>
        <br />
        <p className="font-medium">Note:</p>
        <p>• Video must have captions or auto-generated transcripts</p>
        <p>• Private or restricted videos may not work</p>
      </div>
    </form>
  );
}

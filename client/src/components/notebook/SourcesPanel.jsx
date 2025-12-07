import {
  Plus,
  FileText,
  Globe,
  Youtube,
  Type,
  MoreVertical,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import useChatStore from "@/stores/chatStore";
import useNotebookStore from "@/stores/notebookStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getSourceIcon = (sourceType) => {
  switch (sourceType) {
    case "file":
      return FileText;
    case "url":
      return Globe;
    case "youtube":
      return Youtube;
    case "text":
      return Type;
    default:
      return FileText;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "text-green-600 dark:text-green-400";
    case "processing":
      return "text-yellow-600 dark:text-yellow-400";
    case "failed":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-muted-foreground";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "completed":
      return CheckCircle;
    case "processing":
      return Loader2;
    case "failed":
      return XCircle;
    default:
      return CheckCircle;
  }
};

export default function SourcesPanel({ contents, onAddContent }) {
  const { selectedSources, addSelectedSource, removeSelectedSource } =
    useChatStore();
  const { removeContent } = useNotebookStore();

  const handleSourceToggle = (contentId, checked) => {
    if (checked) {
      addSelectedSource(contentId);
    } else {
      removeSelectedSource(contentId);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this content? This action cannot be undone.",
      )
    ) {
      try {
        const response = await fetch(`/api/v1/content/${contentId}`, {
          method: "DELETE",
          credentials: "include",
        });

        const result = await response.json();

        if (result.success) {
          removeContent(contentId);
          // Remove from selected sources if it was selected
          removeSelectedSource(contentId);
          toast.success("Content deleted successfully");
        } else {
          toast.error(result.message || "Failed to delete content");
        }
      } catch {
        toast.error("Failed to delete content");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="p-4 bg-muted/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No sources yet
        </h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          Add documents, websites, YouTube videos, or text to start chatting
          with your data.
        </p>
        <Button onClick={onAddContent}>
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Source
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {contents.map((content) => {
            const SourceIcon = getSourceIcon(content.sourceType);
            const StatusIcon = getStatusIcon(content.status);
            const isSelected = selectedSources.includes(content._id);
            const canSelect = content.status === "completed";

            return (
              <Card
                key={content._id}
                className={`transition-all duration-200 ${
                  isSelected
                    ? "ring-2 ring-primary border-primary/50 bg-primary/5"
                    : "hover:shadow-md"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSourceToggle(content._id, checked)
                      }
                      disabled={!canSelect}
                      className="mt-1 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <SourceIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <h4 className="font-medium text-card-foreground break-words leading-tight">
                          {content.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <StatusIcon
                          className={`w-3 h-3 flex-shrink-0 ${getStatusColor(
                            content.status,
                          )} ${
                            content.status === "processing"
                              ? "animate-spin"
                              : ""
                          }`}
                        />
                        <span
                          className={`text-xs capitalize ${getStatusColor(
                            content.status,
                          )}`}
                        >
                          {content.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {formatDate(content.createdAt)}
                        </span>
                      </div>

                      {/* Content details based on source type */}
                      {content.sourceType === "file" && content.sourceData && (
                        <p className="text-xs text-muted-foreground break-words mb-1">
                          {content.sourceData.originalName}
                        </p>
                      )}

                      {content.sourceType === "url" && content.sourceData && (
                        <p className="text-xs text-muted-foreground break-all mb-1">
                          {content.sourceData.url}
                        </p>
                      )}

                      {content.sourceType === "youtube" &&
                        content.sourceData && (
                          <p className="text-xs text-muted-foreground mb-1">
                            YouTube •{" "}
                            {content.sourceData.duration || "Unknown duration"}
                          </p>
                        )}

                      {content.sourceType === "text" && (
                        <p className="text-xs text-muted-foreground mb-1">
                          Direct text input
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {content.chunkCount && (
                          <Badge variant="outline" className="text-xs">
                            {content.chunkCount} chunks
                          </Badge>
                        )}
                        {content.tokensUsed && (
                          <Badge variant="outline" className="text-xs">
                            {content.tokensUsed} tokens
                          </Badge>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteContent(content._id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                {/* Error message for failed content */}
                {content.status === "failed" && content.errorMessage && (
                  <CardContent className="pt-0">
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400 break-words">
                      Error: {content.errorMessage}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Selection Summary */}
      {selectedSources.length > 0 && (
        <div className="p-4 border-t border-border bg-card/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {selectedSources.length} source
              {selectedSources.length !== 1 ? "s" : ""} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Clear all selections
                selectedSources.forEach((id) => removeSelectedSource(id));
              }}
            >
              Clear selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

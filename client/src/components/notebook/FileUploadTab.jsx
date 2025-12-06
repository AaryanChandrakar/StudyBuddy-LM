import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export default function FileUploadTab({ notebookId, onContentAdded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error("Please upload only PDF, TXT, or MD files under 10MB");
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      // Auto-generate title from filename
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExtension);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title for this content");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("notebookId", notebookId);
      formData.append("title", title.trim());

      const response = await fetch("/api/v1/content/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("File uploaded successfully!");
        onContentAdded(result.content);

        // Reset form
        setSelectedFile(null);
        setTitle("");
      } else {
        toast.error(result.message || "Upload failed. Please try again.");
      }
    } catch {
      toast.error("Upload failed. Please check your connection.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setTitle("");
  };

  const formatFileSize = (bytes) => {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${Math.round(size * 10) / 10} ${units[unitIndex]}`;
  };

  return (
    <div className="space-y-6">
      {/* File Drop Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : selectedFile
                  ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                  : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />

            {selectedFile ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto">
                  <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)} • Ready to upload
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-full mx-auto">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {isDragActive
                      ? "Drop your file here"
                      : "Click or drag file to upload"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PDF, TXT, or MD files up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Details */}
      {selectedFile && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-title">Title</Label>
            <Input
              id="file-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this content"
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Uploading and processing...
                </span>
                <span className="text-muted-foreground">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || !title.trim()}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </>
            )}
          </Button>
        </div>
      )}

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Uploaded files will be processed and indexed for AI-powered search.
          Processing time varies based on file size and complexity.
        </AlertDescription>
      </Alert>
    </div>
  );
}

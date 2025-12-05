import { useState } from "react";
import { Upload, Type, Globe, Youtube, FileText } from "lucide-react";

import useNotebookStore from "@/stores/notebookStore";
import useAuthStore from "@/stores/authStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploadTab from "@/components/notebook/FileUploadTab";
import TextInputTab from "@/components/notebook/TextInputTab";
import URLInputTab from "@/components/notebook/URLInputTab";
import YoutubeInputTab from "@/components/notebook/YoutubeInputTab";

export default function AddContentDialog({ open, onOpenChange, notebookId }) {
  const [activeTab, setActiveTab] = useState("file");
  const { addContent } = useNotebookStore();
  const { fetchStats } = useAuthStore();

  const handleContentAdded = async (newContent) => {
    // Add to local state immediately
    addContent(newContent);

    // Update user stats
    await fetchStats();

    // Close dialog
    onOpenChange(false);

    // Reset to first tab for next time
    setActiveTab("file");
  };

  const tabs = [
    {
      id: "file",
      label: "File Upload",
      icon: Upload,
      description: "Upload PDF, TXT, or MD files",
    },
    {
      id: "text",
      label: "Direct Text",
      icon: Type,
      description: "Paste or type text directly",
    },
    {
      id: "url",
      label: "Website",
      icon: Globe,
      description: "Add content from web pages",
    },
    {
      id: "youtube",
      label: "YouTube",
      icon: Youtube,
      description: "Extract content from YouTube videos",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Add Content to Notebook
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Descriptions */}
          <div className="mt-4 mb-6">
            {tabs.map(
              (tab) =>
                activeTab === tab.id && (
                  <p
                    key={tab.id}
                    className="text-sm text-muted-foreground text-center"
                  >
                    {tab.description}
                  </p>
                )
            )}
          </div>

          <TabsContent value="file" className="mt-0">
            <FileUploadTab
              notebookId={notebookId}
              onContentAdded={handleContentAdded}
            />
          </TabsContent>

          <TabsContent value="text" className="mt-0">
            <TextInputTab
              notebookId={notebookId}
              onContentAdded={handleContentAdded}
            />
          </TabsContent>

          <TabsContent value="url" className="mt-0">
            <URLInputTab
              notebookId={notebookId}
              onContentAdded={handleContentAdded}
            />
          </TabsContent>

          <TabsContent value="youtube" className="mt-0">
            <YoutubeInputTab
              notebookId={notebookId}
              onContentAdded={handleContentAdded}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

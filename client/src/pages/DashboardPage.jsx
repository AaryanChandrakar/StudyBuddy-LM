import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  BookOpen,
  FileText,
  Clock,
  MoreVertical,
  Trash2,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

import useAuthStore from "@/stores/authStore";
import useNotebookStore from "@/stores/notebookStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  const { user, fetchStats } = useAuthStore();
  const {
    notebooks,
    isLoading,
    fetchNotebooks,
    createNotebook,
    deleteNotebook,
  } = useNotebookStore();
  const navigate = useNavigate();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNotebook, setNewNotebook] = useState({
    title: "",
    description: "",
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch notebooks and stats on component mount
    const loadData = async () => {
      await fetchNotebooks();
      const userStats = await fetchStats();
      setStats(userStats);
    };
    loadData();
  }, [fetchNotebooks, fetchStats]);

  const handleCreateNotebook = async (e) => {
    e.preventDefault();

    if (!newNotebook.title.trim()) {
      toast.error("Please enter a notebook title");
      return;
    }

    const result = await createNotebook(
      newNotebook.title,
      newNotebook.description
    );

    if (result.success) {
      setIsCreateDialogOpen(false);
      setNewNotebook({ title: "", description: "" });
      // Navigate to the new notebook
      navigate(`/app/notebook/${result.notebook._id}`);
    }
  };

  const handleDeleteNotebook = async (notebookId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this notebook? This action cannot be undone."
      )
    ) {
      await deleteNotebook(notebookId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Manage your notebooks and chat with your documents
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Notebook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Notebook</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateNotebook} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter notebook title"
                  value={newNotebook.title}
                  onChange={(e) =>
                    setNewNotebook({ ...newNotebook, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter notebook description"
                  value={newNotebook.description}
                  onChange={(e) =>
                    setNewNotebook({
                      ...newNotebook,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Create Notebook
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Credits Remaining
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.floor(stats?.credits ?? user?.credits ?? 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data Sources</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.dataSourcesCount ?? user?.dataSourcesCount ?? 0}/20
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Notebooks</p>
                <p className="text-2xl font-bold text-foreground">
                  {notebooks.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notebooks Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            Your Notebooks
          </h2>
          {notebooks.length > 0 && (
            <p className="text-muted-foreground">
              {notebooks.length} notebooks
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : notebooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-muted/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No notebooks yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first notebook to start organizing your documents and
              data.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Notebook
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notebooks.map((notebook) => (
              <Card
                key={notebook._id}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-card-foreground truncate">
                        {notebook.title}
                      </CardTitle>
                      {notebook.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notebook.description}
                        </p>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/app/notebook/${notebook._id}`)
                          }
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteNotebook(notebook._id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Updated {formatDate(notebook.updatedAt)}</span>
                    </div>
                    <Badge variant="outline">
                      {stats?.dataSourcesCount ?? user?.dataSourcesCount ?? 0}{" "}
                      sources
                    </Badge>
                  </div>

                  <Button asChild className="w-full" variant="outline">
                    <Link to={`/app/notebook/${notebook._id}`}>
                      Open Notebook
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {notebooks.length > 0 && (
        <div className="mt-12 p-6 bg-secondary/10 rounded-xl border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <Link to="/app/profile">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">View Profile</p>
                    <p className="text-sm text-muted-foreground">
                      Manage account settings
                    </p>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              asChild
            >
              <Link to="/app/stats">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Usage Stats</p>
                    <p className="text-sm text-muted-foreground">
                      Credits & data sources
                    </p>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium">New Notebook</p>
                  <p className="text-sm text-muted-foreground">
                    Create another notebook
                  </p>
                </div>
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

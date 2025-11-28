import { Upload, FolderPlus, MessageCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    step: "01",
    icon: FolderPlus,
    title: "Create a Notebook",
    description:
      "Start by creating a notebook for your project, research, or topic. Organize your knowledge by subject.",
    highlight: "Unlimited Notebooks",
  },
  {
    step: "02",
    icon: Upload,
    title: "Add Your Data",
    description:
      "Upload PDFs, add website URLs, YouTube videos, or paste text directly. We support 20+ different data sources.",
    highlight: "Multiple Formats",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "AI Processing",
    description:
      "Our AI automatically processes and indexes your content, creating intelligent embeddings for semantic search.",
    highlight: "Vector Embeddings",
  },
  {
    step: "04",
    icon: MessageCircle,
    title: "Chat & Discover",
    description:
      "Ask questions in natural language and get accurate answers with source citations from your documents.",
    highlight: "Instant Answers",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            variant="secondary"
            className="mb-4 bg-primary/10 text-primary border-primary/20"
          >
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            From Upload to Insights in Minutes
          </h2>
          <p className="text-lg text-muted-foreground">
            Simple 4-step process to transform your documents into an
            intelligent, searchable knowledge base.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 group">
                <CardContent className="p-6 text-center">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-lg font-bold mb-4">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Highlight Badge */}
                  <Badge variant="outline" className="bg-secondary/500 text-xs">
                    {step.highlight}
                  </Badge>
                </CardContent>
              </Card>

              {/* Connection Arrow (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-px bg-border"></div>
                  <div className="absolute -right-1 -top-1 w-2 h-2 bg-primary rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Demo Section */}
        <div className="mt-16 text-center">
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  AI
                </div>
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-sm font-bold border-2 border-background">
                  📄
                </div>
              </div>
              <div className="text-2xl">→</div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                ✓
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Example:</strong> Upload a
              research paper → Ask "What are the key findings?" → Get instant
              answers with page citations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

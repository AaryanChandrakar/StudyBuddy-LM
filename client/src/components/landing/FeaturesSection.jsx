import {
  Upload,
  MessageSquare,
  FileText,
  Youtube,
  Globe,
  Zap,
  Shield,
  Search,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Upload,
    title: "Multiple Data Sources",
    description:
      "Upload PDFs, add text, import from websites, or transcribe YouTube videos. All your knowledge in one place.",
    badge: "20+ Sources",
  },
  {
    icon: MessageSquare,
    title: "AI-Powered Chat",
    description:
      "Ask questions in natural language and get intelligent answers with accurate source citations from your documents.",
    badge: "GPT-4",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description:
      "Find relevant information across all your documents using advanced vector search and embedding technology.",
    badge: "Vector DB",
  },
  {
    icon: BookOpen,
    title: "Organized Notebooks",
    description:
      "Create notebooks to organize your content by topic, project, or subject. Keep everything structured and accessible.",
    badge: "Unlimited",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Get instant responses with our optimized infrastructure. No waiting, just immediate insights from your data.",
    badge: "< 2s",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your documents stay private and secure. We use industry-standard encryption and never share your data.",
    badge: "Encrypted",
  },
];

const dataTypes = [
  {
    icon: FileText,
    title: "Documents",
    description: "PDFs, text files, markdown",
    color: "text-blue-500",
  },
  {
    icon: Globe,
    title: "Websites",
    description: "Articles, blogs, web pages",
    color: "text-green-500",
  },
  {
    icon: Youtube,
    title: "Videos",
    description: "YouTube transcripts",
    color: "text-red-500",
  },
  {
    icon: MessageSquare,
    title: "Text",
    description: "Direct text input, notes",
    color: "text-purple-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            variant="secondary"
            className="mb-4 bg-primary/10 text-primary border-primary/20"
          >
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Chat with Your Data
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to make your documents and data more
            accessible through intelligent conversation.
          </p>
        </div>

        {/* Data Types */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {dataTypes.map((type, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow border-border/50"
            >
              <CardContent className="p-6">
                <type.icon className={`w-8 h-8 mx-auto mb-3 ${type.color}`} />
                <h3 className="font-semibold text-card-foreground mb-2">
                  {type.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 group"
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs bg-secondary/500">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-card-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Ready to transform how you interact with your documents?
          </p>
          <Badge
            variant="outline"
            className="bg-primary/5 text-primary border-primary/30"
          >
            Start with 20 free credits • No credit card required
          </Badge>
        </div>
      </div>
    </section>
  );
}

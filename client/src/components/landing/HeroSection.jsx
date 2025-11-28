import { Link } from "react-router-dom";
import { ArrowRight, Brain, Sparkles, Zap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjAzIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPgo8L2c+CjwvZz4KPC9zdmc+')] opacity-40"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-secondary/30 rounded-full blur-xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-primary/15 rounded-full blur-md animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Chat with Your
            <span className="block text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Documents & Data
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Upload PDFs, websites, YouTube videos, and text. Ask questions and
            get intelligent answers with source citations. Your personal AI
            research assistant.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm text-card-foreground">
              <FileText className="w-4 h-4 text-primary" />
              Upload Documents
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm text-card-foreground">
              <Brain className="w-4 h-4 text-primary" />
              AI-Powered Chat
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm text-card-foreground">
              <Zap className="w-4 h-4 text-primary" />
              Instant Answers
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-base px-8 py-4 h-auto">
              <Link to="/register">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base px-8 py-4 h-auto"
            >
              <Link to="#demo">Watch Demo</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by researchers and professionals
            </p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-foreground">20+</div>
              <div className="text-sm text-muted-foreground">Data Sources</div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-2xl font-bold text-foreground">AI</div>
              <div className="text-sm text-muted-foreground">Powered</div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-2xl font-bold text-foreground">∞</div>
              <div className="text-sm text-muted-foreground">Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

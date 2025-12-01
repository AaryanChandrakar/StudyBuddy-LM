import { Link } from "react-router-dom";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out ThinkLM",
    icon: Sparkles,
    features: [
      "20 free credits",
      "Up to 5 data sources",
      "Basic document types (PDF, TXT)",
      "Standard AI responses",
      "Community support",
    ],
    cta: "Get Started Free",
    popular: false,
    buttonVariant: "outline",
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For researchers and professionals",
    icon: Crown,
    features: [
      "1,000 credits per month",
      "Up to 50 data sources",
      "All document types (PDF, URLs, YouTube)",
      "Advanced AI responses",
      "Priority support",
      "Export conversations",
    ],
    cta: "Start Pro Trial",
    popular: true,
    buttonVariant: "default",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For teams and organizations",
    icon: Zap,
    features: [
      "Unlimited credits",
      "Unlimited data sources",
      "Custom integrations",
      "Dedicated support",
      "Team collaboration",
      "Advanced analytics",
    ],
    cta: "Contact Sales",
    popular: false,
    buttonVariant: "outline",
  },
];

export default function PricingSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            variant="secondary"
            className="mb-4 bg-primary/10 text-primary border-primary/20"
          >
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you need more. No hidden fees, cancel
            anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-primary shadow-lg scale-105"
                  : "border-border/50 hover:border-primary/30"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}

              <CardHeader
                className={`text-center ${plan.popular ? "pt-12" : "pt-6"}`}
              >
                <div className="flex justify-center mb-4">
                  <div
                    className={`p-3 rounded-xl ${
                      plan.popular
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <plan.icon className="w-8 h-8" />
                  </div>
                </div>

                <CardTitle className="text-2xl font-bold text-card-foreground mb-2">
                  {plan.name}
                </CardTitle>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    /{plan.period}
                  </span>
                </div>

                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-card-foreground text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="pt-6">
                  <Button
                    asChild
                    variant={plan.buttonVariant}
                    className="w-full"
                    size="lg"
                  >
                    <Link to="/register">{plan.cta}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Credit System Explanation */}
        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto p-6 bg-card border border-border rounded-xl">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              How Credits Work
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>1 credit ≈ 1,000 tokens processed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Document upload: 2-10 credits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Chat query: 1-3 credits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Unused credits roll over</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

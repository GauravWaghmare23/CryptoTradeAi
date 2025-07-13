import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Brain, Wallet, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Trading Dashboard",
      description: "Monitor market trends and execute trades with real-time data",
      icon: TrendingUp,
      path: "/dashboard",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "AI Predictions",
      description: "Get AI-powered market insights and earn SHM tokens for correct predictions",
      icon: Brain,
      path: "/ai-predictions",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Portfolio",
      description: "Track your holdings, performance, and transaction history",
      icon: Wallet,
      path: "/portfolio",
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground">
                Crypto Trading
                <span className="block bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">
                  With AI Insights
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Trade cryptocurrencies with confidence using AI-powered predictions. 
                Earn SHM tokens for accurate market forecasts and build your portfolio.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-3"
              >
                Start Trading
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/ai-predictions")}
                className="px-8 py-3"
              >
                View AI Predictions
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Platform Features</h2>
          <p className="text-muted-foreground">
            Everything you need for successful crypto trading in one platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="p-8 text-center hover:shadow-lg transition-all duration-300 cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
              onClick={() => navigate(feature.path)}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center mx-auto mb-6`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-6">{feature.description}</p>
              <Button 
                variant="outline" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(feature.path);
                }}
              >
                Explore
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">50+</div>
              <div className="text-muted-foreground">Cryptocurrencies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">95%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
              <div className="text-muted-foreground">Market Access</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">AI</div>
              <div className="text-muted-foreground">Powered Insights</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

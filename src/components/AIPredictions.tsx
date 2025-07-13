import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAssets, mockPredictions, mockUserProfile, timeframeOptions, type Prediction } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { useBlockchain } from "@/hooks/useBlockchain";
import { Navigation } from "@/components/Navigation";
import { WalletConnect } from "@/components/WalletConnect";
import { Brain, TrendingUp, TrendingDown, Clock, Trophy, Coins, Sparkles, Target } from "lucide-react";

interface GeminiPrediction {
  symbol: string;
  direction: "up" | "down";
  confidence: number;
  reasoning: string;
  targetPrice: number;
  timeframe: string;
}

export const AIPredictions = () => {
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("");
  const [userPrediction, setUserPrediction] = useState<"up" | "down" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiPredictions, setAiPredictions] = useState<GeminiPrediction[]>([]);
  const [userTokens, setUserTokens] = useState(mockUserProfile.shmTokens);
  const { rewardTokens, isTransacting } = useBlockchain();

  // Mock Gemini API call (replace with actual API integration)
  const generateAIPrediction = async (symbol: string, timeframe: string): Promise<GeminiPrediction> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const asset = mockAssets.find(a => a.symbol === symbol);
    if (!asset) throw new Error("Asset not found");

    // Mock AI prediction logic
    const direction = Math.random() > 0.5 ? "up" : "down" as const;
    const confidence = Math.floor(Math.random() * 30) + 60; // 60-90%
    const priceChange = direction === "up" ? 
      Math.random() * 0.2 + 0.05 : // 5-25% increase
      -(Math.random() * 0.15 + 0.03); // 3-18% decrease
    
    const targetPrice = asset.price * (1 + priceChange);

    const reasoning = `Based on technical analysis, market sentiment, and recent trading patterns, ${symbol} shows ${
      direction === "up" ? "bullish" : "bearish"
    } indicators. Key factors include ${
      direction === "up" ? "strong support levels, positive momentum, and increased institutional interest" :
      "resistance at current levels, declining volume, and profit-taking pressure"
    }.`;

    return {
      symbol,
      direction,
      confidence,
      reasoning,
      targetPrice: Math.round(targetPrice * 100) / 100,
      timeframe
    };
  };

  const handleGeneratePrediction = async () => {
    if (!selectedAsset || !selectedTimeframe) {
      toast({
        title: "Missing Information",
        description: "Please select both an asset and timeframe.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const prediction = await generateAIPrediction(selectedAsset, selectedTimeframe);
      setAiPredictions(prev => [prediction, ...prev.slice(0, 4)]); // Keep last 5 predictions
      
      toast({
        title: "AI Prediction Generated",
        description: `Generated prediction for ${selectedAsset} with ${prediction.confidence}% confidence.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI prediction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakePrediction = () => {
    if (!selectedAsset || !selectedTimeframe || !userPrediction) {
      toast({
        title: "Missing Information",
        description: "Please select asset, timeframe, and your prediction direction.",
        variant: "destructive"
      });
      return;
    }

    // Create new prediction
    const newPrediction: Prediction = {
      id: Date.now().toString(),
      symbol: selectedAsset,
      direction: userPrediction,
      startPrice: mockAssets.find(a => a.symbol === selectedAsset)?.price || 0,
      timeframe: selectedTimeframe as any,
      confidence: 0, // User predictions don't have AI confidence
      timestamp: new Date(),
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now (simplified)
      status: "pending"
    };

    // Simulate prediction result (for demo purposes)
    setTimeout(async () => {
      const isWin = Math.random() > 0.4; // 60% win rate for demo
      if (isWin) {
        setUserTokens(prev => prev + 10);
        // Award tokens on blockchain
        await rewardTokens(10);
        toast({
          title: "Prediction Won! 🎉",
          description: "Your prediction was correct! 10 SHM tokens have been credited to your account.",
        });
      } else {
        toast({
          title: "Prediction Result",
          description: "Your prediction didn't come true this time. Better luck next time!",
          variant: "destructive"
        });
      }
    }, 5000); // 5 seconds for demo

    toast({
      title: "Prediction Submitted",
      description: `Your ${userPrediction} prediction for ${selectedAsset} has been recorded.`,
    });

    // Reset form
    setSelectedAsset("");
    setSelectedTimeframe("");
    setUserPrediction("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Web3 Connection */}
          <div className="mb-8">
            <WalletConnect />
          </div>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">AI Market Predictions</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get AI-powered market insights up to 2 years ahead and earn SHM tokens by making accurate predictions
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <div className="flex items-center space-x-3">
              <Coins className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">SHM Tokens</p>
                <p className="text-2xl font-bold text-foreground">{userTokens}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold text-foreground">{mockUserProfile.accuracy}%</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Predictions</p>
                <p className="text-2xl font-bold text-foreground">{mockUserProfile.totalPredictions}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Prediction Generator */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-semibold text-foreground">Generate AI Prediction</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Select Asset</label>
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAssets.map(asset => (
                      <SelectItem key={asset.symbol} value={asset.symbol}>
                        {asset.symbol} - {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Prediction Timeframe</label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGeneratePrediction}
                disabled={isLoading || !selectedAsset || !selectedTimeframe}
                className="w-full"
              >
                {isLoading ? "Generating..." : "Generate AI Prediction"}
              </Button>
            </div>
          </Card>

          {/* User Prediction */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Target className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-foreground">Make Your Prediction</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Your Prediction</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={userPrediction === "up" ? "default" : "outline"}
                    onClick={() => setUserPrediction("up")}
                    className="flex items-center space-x-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Price will go UP</span>
                  </Button>
                  <Button
                    variant={userPrediction === "down" ? "default" : "outline"}
                    onClick={() => setUserPrediction("down")}
                    className="flex items-center space-x-2"
                  >
                    <TrendingDown className="w-4 h-4" />
                    <span>Price will go DOWN</span>
                  </Button>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Reward:</strong> Win 10 SHM tokens if your prediction is correct!
                </p>
              </div>

              <Button 
                onClick={handleMakePrediction}
                disabled={!selectedAsset || !selectedTimeframe || !userPrediction}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              >
                Submit Prediction
              </Button>
            </div>
          </Card>
        </div>

        {/* AI Predictions Results */}
        {aiPredictions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">AI Predictions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiPredictions.map((prediction, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{prediction.symbol}</span>
                      </div>
                      <span className="font-semibold text-foreground">{prediction.symbol}</span>
                    </div>
                    <Badge variant={prediction.direction === "up" ? "default" : "destructive"}>
                      {prediction.direction === "up" ? "BULLISH" : "BEARISH"}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Confidence</span>
                      <span className="font-medium text-foreground">{prediction.confidence}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Target Price</span>
                      <span className="font-medium text-foreground">${prediction.targetPrice}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Timeframe</span>
                      <span className="font-medium text-foreground">
                        {timeframeOptions.find(t => t.value === prediction.timeframe)?.label}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">{prediction.reasoning}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Predictions */}
        {mockPredictions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Your Recent Predictions</h2>
            <div className="space-y-4">
              {mockPredictions.map((prediction) => (
                <Card key={prediction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{prediction.symbol}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {prediction.symbol} - {prediction.direction === "up" ? "↗" : "↘"} 
                          {prediction.direction.toUpperCase()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {timeframeOptions.find(t => t.value === prediction.timeframe)?.label}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {prediction.tokensEarned && (
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <Coins className="w-4 h-4" />
                          <span className="text-sm font-medium">+{prediction.tokensEarned}</span>
                        </div>
                      )}
                      <Badge 
                        variant={
                          prediction.status === "won" ? "default" :
                          prediction.status === "lost" ? "destructive" : "secondary"
                        }
                      >
                        {prediction.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
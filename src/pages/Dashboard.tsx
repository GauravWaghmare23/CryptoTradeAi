import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TradingCard } from "@/components/TradingCard";
import { PortfolioStats } from "@/components/PortfolioStats";
import { WalletConnect } from "@/components/WalletConnect";
import { Navigation } from "@/components/Navigation";
import { mockAssets, calculatePortfolioStats } from "@/data/mockData";
import { useBlockchain } from "@/hooks/useBlockchain";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { recordTrade, isTransacting } = useBlockchain();
  const navigate = useNavigate();
  
  const portfolioStats = calculatePortfolioStats();
  
  const filteredAssets = mockAssets.filter(asset =>
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({
      title: "Market Data Updated",
      description: "Latest prices and market data have been refreshed.",
    });
  };

  const handleBuy = async (symbol: string) => {
    const asset = mockAssets.find(a => a.symbol === symbol);
    if (!asset) return;

    const success = await recordTrade(symbol, 1, asset.price, true);
    if (success) {
      toast({
        title: "Buy Order Placed",
        description: `Buy order for ${symbol} has been placed and recorded on-chain.`,
      });
    }
  };

  const handleSell = async (symbol: string) => {
    const asset = mockAssets.find(a => a.symbol === symbol);
    if (!asset) return;

    const success = await recordTrade(symbol, 1, asset.price, false);
    if (success) {
      toast({
        title: "Sell Order Placed", 
        description: `Sell order for ${symbol} has been placed and recorded on-chain.`,
      });
    }
  };

  const handleViewPredictions = () => {
    navigate("/ai-predictions");
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

          {/* Content continues here */}
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Trading Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your portfolio and trade cryptocurrencies with virtual funds
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="mb-8">
          <PortfolioStats {...portfolioStats} />
        </div>

        {/* Market Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold text-foreground">Market Overview</h2>
            
            {/* Search and Filter */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
                />
              </div>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset, index) => (
              <div 
                key={asset.symbol}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TradingCard
                  symbol={asset.symbol}
                  name={asset.name}
                  price={asset.price}
                  change={asset.change}
                  changePercent={asset.changePercent}
                  volume={asset.volume}
                  onBuy={() => handleBuy(asset.symbol)}
                  onSell={() => handleSell(asset.symbol)}
                  disabled={isTransacting}
                />
              </div>
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No assets found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or clear the search to see all assets.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">New to Trading?</h3>
            <p className="text-muted-foreground">
              Check out our AI predictions to get insights on market trends and make informed decisions. Earn SHM tokens for correct predictions!
            </p>
            <Button 
              onClick={handleViewPredictions}
              className="flex items-center space-x-2 mx-auto bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            >
              <span>View AI Predictions</span>
            </Button>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
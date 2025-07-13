import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PortfolioStats } from "@/components/PortfolioStats";
import { Navigation } from "@/components/Navigation";
import { WalletConnect } from "@/components/WalletConnect";
import { mockPortfolio, mockTransactions, calculatePortfolioStats } from "@/data/mockData";
import { TrendingUp, TrendingDown, History, Download, Eye } from "lucide-react";

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState<"holdings" | "transactions">("holdings");
  const portfolioStats = calculatePortfolioStats();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio</h1>
            <p className="text-muted-foreground">
              Track your holdings, performance, and transaction history
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Analytics</span>
            </Button>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="mb-8">
          <PortfolioStats {...portfolioStats} />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-secondary/30 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("holdings")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "holdings"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Holdings
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "transactions"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Transactions
          </button>
        </div>

        {/* Holdings Tab */}
        {activeTab === "holdings" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">Current Holdings</h2>
            
            {mockPortfolio.length > 0 ? (
              <div className="space-y-4">
                {mockPortfolio.map((holding, index) => (
                  <Card 
                    key={holding.symbol}
                    className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      {/* Asset Info */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{holding.symbol}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{holding.symbol}</h3>
                          <p className="text-sm text-muted-foreground">{holding.name}</p>
                        </div>
                      </div>

                      {/* Quantity & Avg Price */}
                      <div className="text-center md:text-left">
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-semibold text-foreground">{holding.quantity}</p>
                        <p className="text-xs text-muted-foreground">Avg: ${holding.avgPrice.toLocaleString()}</p>
                      </div>

                      {/* Current Price */}
                      <div className="text-center md:text-left">
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="font-semibold text-foreground">${holding.currentPrice.toLocaleString()}</p>
                      </div>

                      {/* Total Value */}
                      <div className="text-center md:text-left">
                        <p className="text-sm text-muted-foreground">Total Value</p>
                        <p className="font-semibold text-foreground">${holding.totalValue.toLocaleString()}</p>
                      </div>

                      {/* P&L */}
                      <div className="text-center md:text-right">
                        <p className="text-sm text-muted-foreground">P&L</p>
                        <div className={`flex items-center justify-center md:justify-end space-x-1 ${
                          holding.pnl >= 0 ? "text-success" : "text-danger"
                        }`}>
                          {holding.pnl >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <div className="text-right">
                            <p className="font-semibold">
                              {holding.pnl >= 0 ? "+" : ""}${Math.abs(holding.pnl).toLocaleString()}
                            </p>
                            <p className="text-xs">
                              ({holding.pnl >= 0 ? "+" : ""}{holding.pnlPercent.toFixed(2)}%)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <TrendingUp className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Holdings Yet</h3>
                    <p className="text-muted-foreground">
                      Start trading to see your portfolio holdings here.
                    </p>
                  </div>
                  <Button>Start Trading</Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">Transaction History</h2>
            
            {mockTransactions.length > 0 ? (
              <div className="space-y-3">
                {mockTransactions.map((transaction, index) => (
                  <Card 
                    key={transaction.id}
                    className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      {/* Type & Symbol */}
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === "buy" 
                            ? "bg-success/20 text-success" 
                            : "bg-danger/20 text-danger"
                        }`}>
                          {transaction.type === "buy" ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {transaction.type.toUpperCase()} {transaction.symbol}
                          </p>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-medium text-foreground">{transaction.quantity}</p>
                      </div>

                      {/* Price */}
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium text-foreground">${transaction.price.toLocaleString()}</p>
                      </div>

                      {/* Total */}
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-medium text-foreground">${transaction.total.toLocaleString()}</p>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === "completed" 
                            ? "bg-success/20 text-success"
                            : transaction.status === "pending"
                            ? "bg-warning/20 text-warning" 
                            : "bg-danger/20 text-danger"
                        }`}>
                          {transaction.status}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(transaction.timestamp)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <History className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Transactions</h3>
                    <p className="text-muted-foreground">
                      Your transaction history will appear here once you start trading.
                    </p>
                  </div>
                  <Button>Start Trading</Button>
                </div>
              </Card>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
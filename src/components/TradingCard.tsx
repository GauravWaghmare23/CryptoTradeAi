import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface TradingCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  onBuy: () => void;
  onSell: () => void;
  disabled?: boolean;
}

export const TradingCard = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  volume,
  onBuy,
  onSell,
  disabled = false
}: TradingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPositive = change >= 0;

  const formatVolume = (vol: number) => {
    if (vol >= 1000000000) return `$${(vol / 1000000000).toFixed(1)}B`;
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}K`;
    return `$${vol}`;
  };

  return (
    <Card 
      className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">{symbol}</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{symbol}</h3>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${isPositive ? "text-success" : "text-danger"}`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Price Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-foreground">
            ${price.toLocaleString()}
          </span>
          <div className={`text-right ${isPositive ? "text-success" : "text-danger"}`}>
            <div className="text-sm font-medium">
              {isPositive ? "+" : ""}${Math.abs(change).toFixed(2)}
            </div>
            <div className="text-xs">
              {isPositive ? "+" : ""}{changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Volume</span>
          <div className="flex items-center space-x-1">
            <BarChart3 className="w-3 h-3" />
            <span>{formatVolume(volume)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`grid grid-cols-2 gap-3 transition-all duration-300 ${
        isHovered ? "opacity-100 transform translate-y-0" : "opacity-70 transform translate-y-1"
      }`}>
        <Button 
          onClick={onBuy}
          className="bg-success hover:bg-success/90 text-white"
          size="sm"
        >
          Buy
        </Button>
        <Button 
          onClick={onSell}
          variant="outline"
          className="border-danger text-danger hover:bg-danger hover:text-white"
          size="sm"
        >
          Sell
        </Button>
      </div>
    </Card>
  );
};
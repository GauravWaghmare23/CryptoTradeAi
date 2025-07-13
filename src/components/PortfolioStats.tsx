import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, DollarSign } from "lucide-react";

interface PortfolioStatsProps {
  totalValue: number;
  totalPnL: number;
  pnlPercent: number;
  availableCash: number;
}

export const PortfolioStats = ({ 
  totalValue, 
  totalPnL, 
  pnlPercent, 
  availableCash 
}: PortfolioStatsProps) => {
  const isPositive = totalPnL >= 0;

  const stats = [
    {
      title: "Total Portfolio Value",
      value: `$${totalValue.toLocaleString()}`,
      icon: Wallet,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "Total P&L",
      value: `${isPositive ? "+" : ""}$${Math.abs(totalPnL).toLocaleString()}`,
      icon: isPositive ? TrendingUp : TrendingDown,
      gradient: isPositive ? "from-green-500 to-emerald-600" : "from-red-500 to-rose-600",
      change: `${isPositive ? "+" : ""}${pnlPercent.toFixed(2)}%`
    },
    {
      title: "Available Cash",
      value: `$${availableCash.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-orange-500 to-yellow-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title}
          className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              {stat.change && (
                <p className={`text-sm font-medium ${isPositive ? "text-success" : "text-danger"}`}>
                  {stat.change}
                </p>
              )}
            </div>
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
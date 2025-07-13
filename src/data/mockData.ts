// Mock data for trading application

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface PortfolioItem {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  pnl: number;
  pnlPercent: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  total: number;
  status: "completed" | "pending" | "failed";
  timestamp: Date;
}

export interface Prediction {
  id: string;
  symbol: string;
  direction: "up" | "down";
  startPrice: number;
  targetPrice?: number;
  timeframe: "1h" | "1d" | "1w" | "1m" | "3m" | "6m" | "1y" | "2y";
  confidence: number;
  timestamp: Date;
  expiryDate: Date;
  status: "pending" | "won" | "lost";
  tokensEarned?: number;
}

export interface UserProfile {
  shmTokens: number;
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
}

export const mockAssets: Asset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 43250,
    change: 1250.30,
    changePercent: 2.98,
    volume: 28500000000
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 2640,
    change: -45.20,
    changePercent: -1.68,
    volume: 12300000000
  },
  {
    symbol: "ADA",
    name: "Cardano",
    price: 0.48,
    change: 0.025,
    changePercent: 5.49,
    volume: 850000000
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 98.50,
    change: 3.20,
    changePercent: 3.36,
    volume: 2100000000
  },
  {
    symbol: "DOT",
    name: "Polkadot",
    price: 7.25,
    change: -0.15,
    changePercent: -2.03,
    volume: 320000000
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    price: 14.80,
    change: 0.65,
    changePercent: 4.59,
    volume: 680000000
  }
];

export const mockPortfolio: PortfolioItem[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    quantity: 0.5,
    avgPrice: 41000,
    currentPrice: 43250,
    totalValue: 21625,
    pnl: 1125,
    pnlPercent: 5.49
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    quantity: 2.5,
    avgPrice: 2700,
    currentPrice: 2640,
    totalValue: 6600,
    pnl: -150,
    pnlPercent: -2.22
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    symbol: "BTC",
    type: "buy",
    quantity: 0.5,
    price: 41000,
    total: 20500,
    status: "completed",
    timestamp: new Date("2024-01-15T10:30:00")
  },
  {
    id: "2",
    symbol: "ETH",
    type: "buy",
    quantity: 2.5,
    price: 2700,
    total: 6750,
    status: "completed",
    timestamp: new Date("2024-01-14T14:15:00")
  }
];

export const mockPredictions: Prediction[] = [
  {
    id: "1",
    symbol: "BTC",
    direction: "up",
    startPrice: 42000,
    timeframe: "1w",
    confidence: 78,
    timestamp: new Date("2024-01-10T09:00:00"),
    expiryDate: new Date("2024-01-17T09:00:00"),
    status: "won",
    tokensEarned: 10
  },
  {
    id: "2",
    symbol: "ETH",
    direction: "down",
    startPrice: 2800,
    timeframe: "1d",
    confidence: 65,
    timestamp: new Date("2024-01-13T15:30:00"),
    expiryDate: new Date("2024-01-14T15:30:00"),
    status: "won",
    tokensEarned: 10
  }
];

export const mockUserProfile: UserProfile = {
  shmTokens: 150,
  totalPredictions: 12,
  correctPredictions: 8,
  accuracy: 66.7
};

export const calculatePortfolioStats = () => {
  const totalValue = mockPortfolio.reduce((sum, item) => sum + item.totalValue, 0);
  const totalPnL = mockPortfolio.reduce((sum, item) => sum + item.pnl, 0);
  const totalInvested = mockPortfolio.reduce((sum, item) => sum + (item.avgPrice * item.quantity), 0);
  const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  return {
    totalValue,
    totalPnL,
    pnlPercent,
    availableCash: 50000 - totalInvested
  };
};

export const timeframeOptions = [
  { value: "1h", label: "1 Hour", multiplier: 1 },
  { value: "1d", label: "1 Day", multiplier: 24 },
  { value: "1w", label: "1 Week", multiplier: 168 },
  { value: "1m", label: "1 Month", multiplier: 720 },
  { value: "3m", label: "3 Months", multiplier: 2160 },
  { value: "6m", label: "6 Months", multiplier: 4320 },
  { value: "1y", label: "1 Year", multiplier: 8760 },
  { value: "2y", label: "2 Years", multiplier: 17520 }
];
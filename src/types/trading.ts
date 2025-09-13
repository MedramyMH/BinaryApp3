export interface TradingSignal {
  id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  confidence: number;
  timestamp: Date;
  expiry: string;
  expiryTime: Date;
  timeframe: string;
  currentPrice: number;
  entryPrice: number;
  generators: GeneratorResult[];
  platform: string;
  status: 'active' | 'expired' | 'won' | 'lost';
}

export interface GeneratorResult {
  id: number;
  name: string;
  indicators: number;
  confidence: number;
  direction: 'BUY' | 'SELL' | 'NEUTRAL';
  signals: string[];
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  trend: 'up' | 'down' | 'neutral';
  lastUpdate: Date;
}

export interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  forecast: string;
  previous: string;
}

export interface HeatMapData {
  symbol: string;
  strength: number;
  volume: number;
  volatility: number;
  trend: 'bullish' | 'bearish' | 'neutral';
}

export interface FibonacciLevel {
  level: number;
  price: number;
  label: string;
}

export interface Platform {
  id: string;
  name: string;
  logo: string;
  supported: boolean;
}

export interface Asset {
  symbol: string;
  name: string;
  category: 'forex' | 'crypto' | 'commodities' | 'indices' | 'stocks';
  available: boolean;
  minExpiry: string;
  maxExpiry: string;
}
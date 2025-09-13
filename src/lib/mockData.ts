import { TradingSignal, MarketData, EconomicEvent, HeatMapData, Platform, GeneratorResult, Asset } from '@/types/trading';

export const platforms: Platform[] = [
  { id: 'pocket', name: 'Pocket Option', logo: '💼', supported: true },
  { id: 'iq', name: 'IQ Option', logo: '🎯', supported: true },
  { id: 'olymp', name: 'Olymp Trade', logo: '🏆', supported: true },
  { id: 'expert', name: 'ExpertOption', logo: '⭐', supported: true },
  { id: 'binomo', name: 'Binomo', logo: '🚀', supported: true },
  { id: 'quotex', name: 'Quotex', logo: '📈', supported: true },
];

// Pocket Option Available Assets including OTC
export const pocketOptionAssets: Asset[] = [
  // OTC Assets (Available 24/7)
  { symbol: 'OTC_EURUSD', name: 'EUR/USD (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_GBPUSD', name: 'GBP/USD (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_USDJPY', name: 'USD/JPY (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_AUDUSD', name: 'AUD/USD (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_USDCAD', name: 'USD/CAD (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_USDCHF', name: 'USD/CHF (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_NZDUSD', name: 'NZD/USD (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_EURGBP', name: 'EUR/GBP (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_EURJPY', name: 'EUR/JPY (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_GBPJPY', name: 'GBP/JPY (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_EURCHF', name: 'EUR/CHF (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_GBPCHF', name: 'GBP/CHF (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_AUDCAD', name: 'AUD/CAD (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_AUDCHF', name: 'AUD/CHF (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_AUDJPY', name: 'AUD/JPY (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_CADCHF', name: 'CAD/CHF (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_CADJPY', name: 'CAD/JPY (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_CHFJPY', name: 'CHF/JPY (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_NZDCAD', name: 'NZD/CAD (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_NZDCHF', name: 'NZD/CHF (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_NZDJPY', name: 'NZD/JPY (OTC)', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  
  // Regular Forex Pairs
  { symbol: 'EUR/USD', name: 'Euro vs US Dollar', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'GBP/USD', name: 'British Pound vs US Dollar', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'USD/JPY', name: 'US Dollar vs Japanese Yen', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'AUD/USD', name: 'Australian Dollar vs US Dollar', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'USD/CAD', name: 'US Dollar vs Canadian Dollar', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'USD/CHF', name: 'US Dollar vs Swiss Franc', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar vs US Dollar', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'EUR/GBP', name: 'Euro vs British Pound', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'EUR/JPY', name: 'Euro vs Japanese Yen', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'GBP/JPY', name: 'British Pound vs Japanese Yen', category: 'forex', available: true, minExpiry: '1m', maxExpiry: '4h' },
  
  // OTC Cryptocurrencies (24/7 Trading)
  { symbol: 'OTC_BTCUSD', name: 'Bitcoin (OTC)', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_ETHUSD', name: 'Ethereum (OTC)', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_LTCUSD', name: 'Litecoin (OTC)', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_XRPUSD', name: 'Ripple (OTC)', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_ADAUSD', name: 'Cardano (OTC)', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_DOTUSD', name: 'Polkadot (OTC)', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_BNBUSD', name: 'Binance Coin (OTC)', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_SOLUSD', name: 'Solana (OTC)', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_MATICUSD', name: 'Polygon (OTC)', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_AVAXUSD', name: 'Avalanche (OTC)', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  
  // Regular Cryptocurrencies
  { symbol: 'BTC/USD', name: 'Bitcoin vs US Dollar', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'ETH/USD', name: 'Ethereum vs US Dollar', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'LTC/USD', name: 'Litecoin vs US Dollar', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'XRP/USD', name: 'Ripple vs US Dollar', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'ADA/USD', name: 'Cardano vs US Dollar', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'DOT/USD', name: 'Polkadot vs US Dollar', category: 'crypto', available: true, minExpiry: '1m', maxExpiry: '4h' },
  
  // OTC Commodities (24/7 Trading)
  { symbol: 'OTC_GOLD', name: 'Gold (OTC)', category: 'commodities', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_SILVER', name: 'Silver (OTC)', category: 'commodities', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_OIL', name: 'Crude Oil (OTC)', category: 'commodities', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_GAS', name: 'Natural Gas (OTC)', category: 'commodities', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_COPPER', name: 'Copper (OTC)', category: 'commodities', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_PLATINUM', name: 'Platinum (OTC)', category: 'commodities', available: true, minExpiry: '1m', maxExpiry: '4h' },
  
  // Regular Commodities
  { symbol: 'GOLD', name: 'Gold', category: 'commodities', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'SILVER', name: 'Silver', category: 'commodities', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OIL', name: 'Crude Oil', category: 'commodities', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'GAS', name: 'Natural Gas', category: 'commodities', available: true, minExpiry: '1m', maxExpiry: '4h' },
  
  // OTC Indices (24/7 Trading)
  { symbol: 'OTC_SPX500', name: 'S&P 500 (OTC)', category: 'indices', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_NASDAQ', name: 'NASDAQ 100 (OTC)', category: 'indices', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_DOW30', name: 'Dow Jones 30 (OTC)', category: 'indices', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_FTSE100', name: 'FTSE 100 (OTC)', category: 'indices', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_DAX30', name: 'DAX 30 (OTC)', category: 'indices', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_NIKKEI', name: 'Nikkei 225 (OTC)', category: 'indices', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_CAC40', name: 'CAC 40 (OTC)', category: 'indices', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_ASX200', name: 'ASX 200 (OTC)', category: 'indices', available: true, minExpiry: '1m', maxExpiry: '4h' },
  
  // Regular Indices
  { symbol: 'SPX500', name: 'S&P 500', category: 'indices', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'NASDAQ', name: 'NASDAQ 100', category: 'indices', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'DOW30', name: 'Dow Jones 30', category: 'indices', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'FTSE100', name: 'FTSE 100', category: 'indices', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'DAX30', name: 'DAX 30', category: 'indices', available: true, minExpiry: '1m', maxExpiry: '4h' },
  
  // OTC Stocks (24/7 Trading)
  { symbol: 'OTC_AAPL', name: 'Apple Inc. (OTC)', category: 'stocks', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_GOOGL', name: 'Alphabet Inc. (OTC)', category: 'stocks', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_MSFT', name: 'Microsoft Corporation (OTC)', category: 'stocks', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_TSLA', name: 'Tesla Inc. (OTC)', category: 'stocks', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_AMZN', name: 'Amazon.com Inc. (OTC)', category: 'stocks', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_META', name: 'Meta Platforms (OTC)', category: 'stocks', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_NFLX', name: 'Netflix Inc. (OTC)', category: 'stocks', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'OTC_NVDA', name: 'NVIDIA Corporation (OTC)', category: 'stocks', available: true, minExpiry: '1m', maxExpiry: '4h' },
  
  // Popular Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'stocks', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'stocks', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', category: 'stocks', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'stocks', available: true, minExpiry: '1m', maxExpiry: '4h' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'stocks', available: true, minExpiry: '1m', maxExpiry: '4h' },
];

export const timeframes = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4'];
export const expiryOptions = ['1m', '2m', '3m', '5m', '10m', '15m', '30m', '1h', '2h', '4h'];

// Real-time price simulation with OTC assets
const basePrices: { [key: string]: number } = {
  // OTC Forex
  'OTC_EURUSD': 1.0856,
  'OTC_GBPUSD': 1.2734,
  'OTC_USDJPY': 149.82,
  'OTC_AUDUSD': 0.6542,
  'OTC_USDCAD': 1.3678,
  'OTC_USDCHF': 0.8945,
  'OTC_NZDUSD': 0.5987,
  'OTC_EURGBP': 0.8523,
  'OTC_EURJPY': 162.45,
  'OTC_GBPJPY': 190.67,
  'OTC_EURCHF': 0.9645,
  'OTC_GBPCHF': 1.1387,
  'OTC_AUDCAD': 0.8934,
  'OTC_AUDCHF': 0.5856,
  'OTC_AUDJPY': 98.12,
  'OTC_CADCHF': 0.6556,
  'OTC_CADJPY': 109.56,
  'OTC_CHFJPY': 167.45,
  'OTC_NZDCAD': 0.8198,
  'OTC_NZDCHF': 0.5356,
  'OTC_NZDJPY': 89.67,
  
  // Regular Forex
  'EUR/USD': 1.0856,
  'GBP/USD': 1.2734,
  'USD/JPY': 149.82,
  'AUD/USD': 0.6542,
  'USD/CAD': 1.3678,
  'USD/CHF': 0.8945,
  'NZD/USD': 0.5987,
  'EUR/GBP': 0.8523,
  'EUR/JPY': 162.45,
  'GBP/JPY': 190.67,
  
  // OTC Crypto
  'OTC_BTCUSD': 43250.00,
  'OTC_ETHUSD': 2340.50,
  'OTC_LTCUSD': 72.35,
  'OTC_XRPUSD': 0.6234,
  'OTC_ADAUSD': 0.4567,
  'OTC_DOTUSD': 5.89,
  'OTC_BNBUSD': 245.67,
  'OTC_SOLUSD': 67.89,
  'OTC_MATICUSD': 0.8934,
  'OTC_AVAXUSD': 23.45,
  
  // Regular Crypto
  'BTC/USD': 43250.00,
  'ETH/USD': 2340.50,
  'LTC/USD': 72.35,
  'XRP/USD': 0.6234,
  'ADA/USD': 0.4567,
  'DOT/USD': 5.89,
  
  // OTC Commodities
  'OTC_GOLD': 2045.67,
  'OTC_SILVER': 24.89,
  'OTC_OIL': 78.45,
  'OTC_GAS': 2.89,
  'OTC_COPPER': 3.87,
  'OTC_PLATINUM': 945.23,
  
  // Regular Commodities
  'GOLD': 2045.67,
  'SILVER': 24.89,
  'OIL': 78.45,
  'GAS': 2.89,
  
  // OTC Indices
  'OTC_SPX500': 4567.89,
  'OTC_NASDAQ': 15234.67,
  'OTC_DOW30': 35678.90,
  'OTC_FTSE100': 7456.78,
  'OTC_DAX30': 16234.56,
  'OTC_NIKKEI': 33456.78,
  'OTC_CAC40': 7234.56,
  'OTC_ASX200': 7123.45,
  
  // Regular Indices
  'SPX500': 4567.89,
  'NASDAQ': 15234.67,
  'DOW30': 35678.90,
  'FTSE100': 7456.78,
  'DAX30': 16234.56,
  
  // OTC Stocks
  'OTC_AAPL': 189.45,
  'OTC_GOOGL': 142.67,
  'OTC_MSFT': 378.90,
  'OTC_TSLA': 234.56,
  'OTC_AMZN': 156.78,
  'OTC_META': 345.67,
  'OTC_NFLX': 456.78,
  'OTC_NVDA': 567.89,
  
  // Regular Stocks
  'AAPL': 189.45,
  'GOOGL': 142.67,
  'MSFT': 378.90,
  'TSLA': 234.56,
  'AMZN': 156.78
};

export const generateRealTimePrice = (symbol: string): number => {
  const basePrice = basePrices[symbol] || 1.0000;
  const volatility = symbol.includes('BTC') || symbol.includes('ETH') ? 0.02 : 
                    symbol.includes('USD') || symbol.includes('OTC_') ? 0.001 : 0.005;
  const change = (Math.random() - 0.5) * volatility;
  return Number((basePrice * (1 + change)).toFixed(symbol.includes('JPY') ? 2 : 4));
};

export const generateMockMarketData = (): MarketData[] => {
  return pocketOptionAssets.slice(0, 15).map(asset => {
    const price = generateRealTimePrice(asset.symbol);
    const change = (Math.random() - 0.5) * 0.02;
    return {
      symbol: asset.symbol,
      price,
      change,
      changePercent: change * 100,
      volume: Math.random() * 1000000,
      high24h: price * (1 + Math.random() * 0.02),
      low24h: price * (1 - Math.random() * 0.02),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      lastUpdate: new Date()
    };
  });
};

export const generateMockGenerators = (): GeneratorResult[] => {
  const generators = [
    { id: 1, name: 'RSI & MACD Confluence', indicators: 26 },
    { id: 2, name: 'Bollinger & Stochastic', indicators: 16 },
    { id: 3, name: 'Moving Average Cross', indicators: 8 },
    { id: 4, name: 'Support/Resistance AI', indicators: 16 }
  ];

  return generators.map(gen => ({
    ...gen,
    confidence: Math.random() * 40 + 60, // 60-100%
    direction: Math.random() > 0.5 ? 'BUY' : 'SELL',
    signals: [
      'RSI Oversold Signal',
      'MACD Bullish Crossover',
      'Bollinger Squeeze Break',
      'Support Level Bounce',
      'Volume Spike Detected',
      'Trend Reversal Pattern'
    ].slice(0, Math.floor(Math.random() * 4) + 2)
  }));
};

export const generateRealTimeSignal = (): TradingSignal => {
  const generators = generateMockGenerators();
  const agreementCount = generators.filter(g => g.direction === generators[0].direction).length;
  const confidence = agreementCount >= 3 ? Math.random() * 4 + 96 : Math.random() * 25 + 70;
  
  const asset = pocketOptionAssets[Math.floor(Math.random() * pocketOptionAssets.length)];
  const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
  const expiry = expiryOptions[Math.floor(Math.random() * expiryOptions.length)];
  
  const currentPrice = generateRealTimePrice(asset.symbol);
  const entryPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.001); // Small entry spread
  
  // Calculate expiry time
  const expiryTime = new Date();
  const expiryMinutes = parseInt(expiry.replace(/[mh]/g, ''));
  if (expiry.includes('h')) {
    expiryTime.setHours(expiryTime.getHours() + expiryMinutes);
  } else {
    expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    symbol: asset.symbol,
    direction: generators[0].direction,
    confidence,
    timestamp: new Date(),
    expiry,
    expiryTime,
    timeframe,
    currentPrice,
    entryPrice,
    generators,
    platform: 'pocket',
    status: 'active'
  };
};

export const mockEconomicEvents: EconomicEvent[] = [
  {
    id: '1',
    time: '14:30',
    currency: 'USD',
    event: 'Non-Farm Payrolls',
    impact: 'high',
    forecast: '180K',
    previous: '175K'
  },
  {
    id: '2',
    time: '16:00',
    currency: 'EUR',
    event: 'ECB Interest Rate Decision',
    impact: 'high',
    forecast: '4.50%',
    previous: '4.50%'
  },
  {
    id: '3',
    time: '10:00',
    currency: 'GBP',
    event: 'GDP Growth Rate',
    impact: 'medium',
    forecast: '0.2%',
    previous: '0.1%'
  }
];

export const generateHeatMapData = (): HeatMapData[] => {
  return pocketOptionAssets.slice(0, 15).map(asset => ({
    symbol: asset.symbol,
    strength: Math.random() * 100,
    volume: Math.random() * 1000000,
    volatility: Math.random() * 50,
    trend: Math.random() > 0.5 ? 'bullish' : Math.random() > 0.25 ? 'bearish' : 'neutral'
  }));
};
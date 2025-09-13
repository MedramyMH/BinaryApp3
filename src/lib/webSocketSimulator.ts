// Real-Time WebSocket Simulation for Live Data Feeds
interface MarketTick {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  volume: number;
  timestamp: Date;
  change: number;
}

interface NewsEvent {
  id: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  currency: string;
  timestamp: Date;
  description: string;
}

export class WebSocketSimulator {
  private subscribers: Map<string, ((data: any) => void)[]> = new Map();
  private isConnected: boolean = false;
  private intervals: NodeJS.Timeout[] = [];
  private marketData: Map<string, MarketTick> = new Map();

  constructor() {
    this.initializeMarketData();
  }

  private initializeMarketData() {
    const symbols = [
      'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD',
      'EUR/USD_OTC', 'GBP/USD_OTC', 'USD/JPY_OTC',
      'BTC/USD', 'ETH/USD', 'BTC/USD_OTC', 'ETH/USD_OTC',
      'GOLD', 'SILVER', 'GOLD_OTC', 'SILVER_OTC',
      'SPX500', 'NASDAQ', 'SPX500_OTC', 'NASDAQ_OTC'
    ];

    const basePrices: { [key: string]: number } = {
      'EUR/USD': 1.0856, 'GBP/USD': 1.2734, 'USD/JPY': 149.82,
      'AUD/USD': 0.6542, 'USD/CAD': 1.3678,
      'EUR/USD_OTC': 1.0859, 'GBP/USD_OTC': 1.2738, 'USD/JPY_OTC': 149.85,
      'BTC/USD': 43250.00, 'ETH/USD': 2340.50,
      'BTC/USD_OTC': 43280.00, 'ETH/USD_OTC': 2345.20,
      'GOLD': 2045.67, 'SILVER': 24.89,
      'GOLD_OTC': 2048.20, 'SILVER_OTC': 24.95,
      'SPX500': 4567.89, 'NASDAQ': 15234.67,
      'SPX500_OTC': 4570.25, 'NASDAQ_OTC': 15240.30
    };

    symbols.forEach(symbol => {
      const basePrice = basePrices[symbol] || 1.0000;
      const spread = basePrice * 0.0002; // 2 pip spread
      
      this.marketData.set(symbol, {
        symbol,
        price: basePrice,
        bid: basePrice - spread,
        ask: basePrice + spread,
        volume: Math.random() * 1000000,
        timestamp: new Date(),
        change: 0
      });
    });
  }

  connect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        this.startDataStreams();
        this.emit('connection', { status: 'connected', timestamp: new Date() });
        resolve();
      }, 1000);
    });
  }

  disconnect() {
    this.isConnected = false;
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    this.emit('connection', { status: 'disconnected', timestamp: new Date() });
  }

  subscribe(channel: string, callback: (data: any) => void) {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, []);
    }
    this.subscribers.get(channel)!.push(callback);
  }

  unsubscribe(channel: string, callback: (data: any) => void) {
    const callbacks = this.subscribers.get(channel);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(channel: string, data: any) {
    const callbacks = this.subscribers.get(channel);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  private startDataStreams() {
    // Market data stream (every 100ms)
    const marketInterval = setInterval(() => {
      if (!this.isConnected) return;
      
      this.marketData.forEach((tick, symbol) => {
        const volatility = symbol.includes('BTC') || symbol.includes('ETH') ? 0.001 : 0.0001;
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = tick.price * (1 + change);
        const spread = newPrice * 0.0002;
        
        const updatedTick: MarketTick = {
          ...tick,
          price: newPrice,
          bid: newPrice - spread,
          ask: newPrice + spread,
          volume: tick.volume + Math.random() * 1000,
          timestamp: new Date(),
          change: change * 100
        };
        
        this.marketData.set(symbol, updatedTick);
        this.emit('market_data', updatedTick);
      });
    }, 100);

    // News events stream (every 30-60 seconds)
    const newsInterval = setInterval(() => {
      if (!this.isConnected) return;
      
      const newsEvents = [
        { title: 'Fed Officials Signal Rate Pause', impact: 'high', currency: 'USD' },
        { title: 'ECB Minutes Show Dovish Tone', impact: 'high', currency: 'EUR' },
        { title: 'UK GDP Growth Exceeds Expectations', impact: 'medium', currency: 'GBP' },
        { title: 'China Manufacturing PMI Rises', impact: 'medium', currency: 'AUD' },
        { title: 'Oil Inventory Data Released', impact: 'low', currency: 'CAD' },
        { title: 'Bitcoin ETF Approval Rumors', impact: 'high', currency: 'BTC' },
        { title: 'Tech Earnings Beat Estimates', impact: 'medium', currency: 'NASDAQ' }
      ];
      
      const randomNews = newsEvents[Math.floor(Math.random() * newsEvents.length)];
      const newsEvent: NewsEvent = {
        id: Math.random().toString(36).substr(2, 9),
        ...randomNews,
        timestamp: new Date(),
        description: `Market moving event detected for ${randomNews.currency}`
      };
      
      this.emit('news', newsEvent);
    }, Math.random() * 30000 + 30000);

    // Economic calendar stream (every 2-5 minutes)
    const economicInterval = setInterval(() => {
      if (!this.isConnected) return;
      
      const events = [
        'Non-Farm Payrolls', 'CPI Data', 'GDP Growth', 'Interest Rate Decision',
        'Unemployment Rate', 'Retail Sales', 'Industrial Production'
      ];
      
      const event = {
        id: Math.random().toString(36).substr(2, 9),
        name: events[Math.floor(Math.random() * events.length)],
        currency: ['USD', 'EUR', 'GBP', 'JPY'][Math.floor(Math.random() * 4)],
        impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        time: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString(),
        forecast: (Math.random() * 2).toFixed(1) + '%',
        previous: (Math.random() * 2).toFixed(1) + '%',
        timestamp: new Date()
      };
      
      this.emit('economic_calendar', event);
    }, Math.random() * 180000 + 120000);

    this.intervals.push(marketInterval, newsInterval, economicInterval);
  }

  getMarketData(symbol?: string) {
    if (symbol) {
      return this.marketData.get(symbol);
    }
    return Array.from(this.marketData.values());
  }

  isConnectedStatus() {
    return this.isConnected;
  }
}

export const webSocketSimulator = new WebSocketSimulator();

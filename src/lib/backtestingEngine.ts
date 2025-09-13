// Advanced Backtesting Engine with Historical Simulation
interface BacktestTrade {
  id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  entryTime: Date;
  exitTime: Date;
  expiry: string;
  confidence: number;
  result: 'win' | 'loss';
  profit: number;
  slippage: number;
  commission: number;
}

interface BacktestResults {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  profitFactor: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  avgTradeDuration: number;
  roi: number;
  trades: BacktestTrade[];
}

interface BacktestSettings {
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  tradeAmount: number;
  payoutRate: number; // 0.8 = 80% payout
  slippagePercent: number;
  commissionPercent: number;
  confidenceThreshold: number;
  symbols: string[];
  timeframes: string[];
}

export class BacktestingEngine {
  private settings: BacktestSettings;
  private trades: BacktestTrade[] = [];
  private balance: number = 0;
  private equity: number[] = [];

  constructor(settings: BacktestSettings) {
    this.settings = settings;
    this.balance = settings.initialBalance;
  }

  async runBacktest(): Promise<BacktestResults> {
    this.trades = [];
    this.balance = this.settings.initialBalance;
    this.equity = [this.balance];

    // Generate historical signals for backtesting
    const historicalSignals = this.generateHistoricalSignals();
    
    // Process each signal
    for (const signal of historicalSignals) {
      if (signal.confidence >= this.settings.confidenceThreshold) {
        const trade = await this.executeTrade(signal);
        if (trade) {
          this.trades.push(trade);
          this.balance += trade.profit;
          this.equity.push(this.balance);
        }
      }
    }

    return this.calculateResults();
  }

  private generateHistoricalSignals() {
    const signals = [];
    const startTime = this.settings.startDate.getTime();
    const endTime = this.settings.endDate.getTime();
    const timeRange = endTime - startTime;
    
    // Generate signals every 5-15 minutes on average
    const avgInterval = 10 * 60 * 1000; // 10 minutes
    const numSignals = Math.floor(timeRange / avgInterval);
    
    for (let i = 0; i < numSignals; i++) {
      const timestamp = new Date(startTime + (i * avgInterval) + (Math.random() * avgInterval));
      const symbol = this.settings.symbols[Math.floor(Math.random() * this.settings.symbols.length)];
      const timeframe = this.settings.timeframes[Math.floor(Math.random() * this.settings.timeframes.length)];
      
      // Simulate market conditions affecting signal quality
      const marketVolatility = this.getMarketVolatility(timestamp);
      const baseConfidence = 60 + Math.random() * 35; // 60-95%
      const volatilityAdjustment = marketVolatility > 0.02 ? -10 : marketVolatility < 0.01 ? 5 : 0;
      
      signals.push({
        id: `backtest_${i}`,
        symbol,
        direction: Math.random() > 0.5 ? 'BUY' : 'SELL',
        confidence: Math.max(50, Math.min(95, baseConfidence + volatilityAdjustment)),
        timestamp,
        timeframe,
        expiry: ['1m', '2m', '5m', '15m'][Math.floor(Math.random() * 4)],
        entryPrice: this.getHistoricalPrice(symbol, timestamp),
        generators: this.generateBacktestGenerators()
      });
    }
    
    return signals.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  private async executeTrade(signal: any): Promise<BacktestTrade | null> {
    if (this.balance < this.settings.tradeAmount) {
      return null; // Insufficient balance
    }

    const entryPrice = signal.entryPrice;
    const slippage = entryPrice * (this.settings.slippagePercent / 100);
    const commission = this.settings.tradeAmount * (this.settings.commissionPercent / 100);
    
    // Adjust entry price for slippage
    const adjustedEntryPrice = signal.direction === 'BUY' ? 
      entryPrice + slippage : entryPrice - slippage;

    // Calculate exit time based on expiry
    const expiryMinutes = parseInt(signal.expiry.replace(/[mh]/g, ''));
    const exitTime = new Date(signal.timestamp.getTime() + expiryMinutes * 60000);
    
    // Simulate price movement during trade duration
    const exitPrice = this.simulatePriceMovement(
      adjustedEntryPrice, 
      signal.direction, 
      signal.confidence,
      expiryMinutes
    );

    // Determine trade result
    const isWin = signal.direction === 'BUY' ? 
      exitPrice > adjustedEntryPrice : exitPrice < adjustedEntryPrice;

    // Calculate profit/loss
    const profit = isWin ? 
      this.settings.tradeAmount * this.settings.payoutRate - commission :
      -this.settings.tradeAmount - commission;

    return {
      id: signal.id,
      symbol: signal.symbol,
      direction: signal.direction,
      entryPrice: adjustedEntryPrice,
      exitPrice,
      entryTime: signal.timestamp,
      exitTime,
      expiry: signal.expiry,
      confidence: signal.confidence,
      result: isWin ? 'win' : 'loss',
      profit,
      slippage,
      commission
    };
  }

  private simulatePriceMovement(entryPrice: number, direction: string, confidence: number, duration: number): number {
    // Higher confidence = higher probability of correct direction
    const winProbability = (confidence - 50) / 50; // Convert 50-100% to 0-1
    const isCorrect = Math.random() < winProbability;
    
    // Simulate realistic price movement
    const volatility = 0.001 * Math.sqrt(duration / 5); // Volatility increases with time
    const trend = isCorrect ? 
      (direction === 'BUY' ? 1 : -1) * Math.random() * 0.002 :
      (direction === 'BUY' ? -1 : 1) * Math.random() * 0.002;
    
    const randomWalk = (Math.random() - 0.5) * volatility;
    
    return entryPrice * (1 + trend + randomWalk);
  }

  private getMarketVolatility(timestamp: Date): number {
    // Simulate market volatility based on time (higher during market opens/closes)
    const hour = timestamp.getHours();
    const isMarketOpen = (hour >= 8 && hour <= 17); // Simplified market hours
    const baseVolatility = isMarketOpen ? 0.015 : 0.008;
    
    // Add random component
    return baseVolatility * (0.5 + Math.random());
  }

  private getHistoricalPrice(symbol: string, timestamp: Date): number {
    // Simulate historical prices with realistic movements
    const basePrices: { [key: string]: number } = {
      'EUR/USD': 1.0856, 'GBP/USD': 1.2734, 'USD/JPY': 149.82,
      'BTC/USD': 43250.00, 'ETH/USD': 2340.50,
      'GOLD': 2045.67, 'SPX500': 4567.89
    };
    
    const basePrice = basePrices[symbol] || 1.0000;
    const daysSinceBase = (timestamp.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    const drift = daysSinceBase * 0.0001; // Small daily drift
    
    return basePrice * (1 + drift + (Math.random() - 0.5) * 0.02);
  }

  private generateBacktestGenerators() {
    return [
      { id: 1, name: 'RSI & MACD', confidence: 60 + Math.random() * 30, direction: 'BUY' },
      { id: 2, name: 'Bollinger Bands', confidence: 60 + Math.random() * 30, direction: 'BUY' },
      { id: 3, name: 'Moving Averages', confidence: 60 + Math.random() * 30, direction: 'SELL' },
      { id: 4, name: 'Support/Resistance', confidence: 60 + Math.random() * 30, direction: 'BUY' }
    ];
  }

  private calculateResults(): BacktestResults {
    const winningTrades = this.trades.filter(t => t.result === 'win');
    const losingTrades = this.trades.filter(t => t.result === 'loss');
    
    const totalProfit = winningTrades.reduce((sum, t) => sum + t.profit, 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.profit, 0));
    const netProfit = totalProfit - totalLoss;
    
    // Calculate drawdown
    let maxDrawdown = 0;
    let peak = this.settings.initialBalance;
    
    this.equity.forEach(balance => {
      if (balance > peak) peak = balance;
      const drawdown = peak - balance;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    // Calculate Sharpe and Sortino ratios
    const returns = this.equity.slice(1).map((balance, i) => 
      (balance - this.equity[i]) / this.equity[i]
    );
    
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const returnStdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    );
    
    const negativeReturns = returns.filter(r => r < 0);
    const downsideStdDev = negativeReturns.length > 0 ? Math.sqrt(
      negativeReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / negativeReturns.length
    ) : 0;

    return {
      totalTrades: this.trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: this.trades.length > 0 ? (winningTrades.length / this.trades.length) * 100 : 0,
      totalProfit,
      totalLoss,
      netProfit,
      profitFactor: totalLoss > 0 ? totalProfit / totalLoss : 0,
      sharpeRatio: returnStdDev > 0 ? avgReturn / returnStdDev : 0,
      sortinoRatio: downsideStdDev > 0 ? avgReturn / downsideStdDev : 0,
      maxDrawdown,
      maxDrawdownPercent: this.settings.initialBalance > 0 ? (maxDrawdown / this.settings.initialBalance) * 100 : 0,
      avgWin: winningTrades.length > 0 ? totalProfit / winningTrades.length : 0,
      avgLoss: losingTrades.length > 0 ? totalLoss / losingTrades.length : 0,
      largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.profit)) : 0,
      largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.profit)) : 0,
      consecutiveWins: this.calculateConsecutiveWins(),
      consecutiveLosses: this.calculateConsecutiveLosses(),
      avgTradeDuration: this.calculateAvgTradeDuration(),
      roi: this.settings.initialBalance > 0 ? (netProfit / this.settings.initialBalance) * 100 : 0,
      trades: this.trades
    };
  }

  private calculateConsecutiveWins(): number {
    let maxConsecutive = 0;
    let current = 0;
    
    this.trades.forEach(trade => {
      if (trade.result === 'win') {
        current++;
        maxConsecutive = Math.max(maxConsecutive, current);
      } else {
        current = 0;
      }
    });
    
    return maxConsecutive;
  }

  private calculateConsecutiveLosses(): number {
    let maxConsecutive = 0;
    let current = 0;
    
    this.trades.forEach(trade => {
      if (trade.result === 'loss') {
        current++;
        maxConsecutive = Math.max(maxConsecutive, current);
      } else {
        current = 0;
      }
    });
    
    return maxConsecutive;
  }

  private calculateAvgTradeDuration(): number {
    if (this.trades.length === 0) return 0;
    
    const totalDuration = this.trades.reduce((sum, trade) => {
      return sum + (trade.exitTime.getTime() - trade.entryTime.getTime());
    }, 0);
    
    return totalDuration / this.trades.length / (1000 * 60); // Return in minutes
  }
}

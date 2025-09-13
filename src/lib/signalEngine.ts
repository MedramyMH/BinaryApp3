import { TradingSignal, GeneratorResult } from '@/types/trading';
import { generateRealTimeSignal } from './mockData';

export class SignalEngine {
  private confidenceThreshold: number = 85;
  private signals: TradingSignal[] = [];
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  setConfidenceThreshold(threshold: number) {
    this.confidenceThreshold = threshold;
  }

  getConfidenceThreshold() {
    return this.confidenceThreshold;
  }

  calculateConsensus(generators: GeneratorResult[]): { confidence: number; direction: 'BUY' | 'SELL' | 'NEUTRAL' } {
    // Ensure generators is an array
    if (!Array.isArray(generators) || generators.length === 0) {
      return { confidence: 0, direction: 'NEUTRAL' };
    }

    const buyVotes = generators.filter(g => g && g.direction === 'BUY');
    const sellVotes = generators.filter(g => g && g.direction === 'SELL');
    
    // Weighted consensus based on individual generator confidence
    const buyWeight = buyVotes.reduce((sum, g) => sum + (g.confidence || 0), 0);
    const sellWeight = sellVotes.reduce((sum, g) => sum + (g.confidence || 0), 0);
    
    const totalWeight = buyWeight + sellWeight;
    
    if (totalWeight === 0) {
      return { confidence: 0, direction: 'NEUTRAL' };
    }
    
    const buyPercentage = (buyWeight / totalWeight) * 100;
    const sellPercentage = (sellWeight / totalWeight) * 100;
    
    // Require 3/4 generators to agree for high confidence
    const agreement = Math.max(buyVotes.length, sellVotes.length);
    let confidence = Math.max(buyPercentage, sellPercentage);
    
    if (agreement >= 3) {
      confidence = Math.min(confidence + 15, 99); // Boost confidence for strong agreement
    }
    
    return {
      confidence,
      direction: buyPercentage > sellPercentage ? 'BUY' : 'SELL'
    };
  }

  generateSignal(): TradingSignal | null {
    const signal = generateRealTimeSignal();
    const consensus = this.calculateConsensus(signal.generators);
    
    // Update signal with calculated confidence
    signal.confidence = consensus.confidence;
    signal.direction = consensus.direction;
    
    // Only return signal if it meets confidence threshold
    if (signal.confidence >= this.confidenceThreshold) {
      return signal;
    }
    
    return null;
  }

  getSignals(): TradingSignal[] {
    return this.signals;
  }

  addSignal(signal: TradingSignal) {
    this.signals.unshift(signal);
    // Keep only last 50 signals
    if (this.signals.length > 50) {
      this.signals = this.signals.slice(0, 50);
    }
  }

  startEngine(callback: (signal: TradingSignal) => void) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    const generateSignalInterval = () => {
      if (!this.isRunning) return;
      
      const signal = this.generateSignal();
      if (signal) {
        this.addSignal(signal);
        callback(signal);
      }
      
      // Random interval between 8-25 seconds for realistic signal generation
      const nextInterval = Math.random() * 17000 + 8000;
      this.intervalId = setTimeout(generateSignalInterval, nextInterval);
    };
    
    // Start first signal after 3 seconds
    this.intervalId = setTimeout(generateSignalInterval, 3000);
  }

  stopEngine() {
    this.isRunning = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  calculateFibonacci(high: number, low: number) {
    const diff = high - low;
    const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
    
    return levels.map(level => ({
      level: level * 100,
      price: high - (diff * level),
      label: `${(level * 100).toFixed(1)}%`
    }));
  }

  calculateSpread(bid: number, ask: number) {
    const spread = ask - bid;
    const spreadPercentage = (spread / ask) * 100;
    
    return {
      spread: spread.toFixed(5),
      percentage: spreadPercentage.toFixed(3)
    };
  }
}

export const signalEngine = new SignalEngine();
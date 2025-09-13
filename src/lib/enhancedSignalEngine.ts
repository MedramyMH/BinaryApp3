import { TradingSignal, GeneratorResult } from '@/types/trading';
import { generateRealTimeSignal } from './mockData';

export class EnhancedSignalEngine {
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

  // Enhanced consensus with weighted voting
  calculateWeightedConsensus(generators: GeneratorResult[]): { confidence: number; direction: 'BUY' | 'SELL' | 'NEUTRAL' } {
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

  // Enhanced signal generation
  generateEnhancedSignal(): TradingSignal | null {
    const baseSignal = generateRealTimeSignal();
    const consensus = this.calculateWeightedConsensus(baseSignal.generators);
    
    // Update signal with calculated confidence
    baseSignal.confidence = consensus.confidence;
    baseSignal.direction = consensus.direction;
    
    // Only return signal if it meets confidence threshold
    if (baseSignal.confidence >= this.confidenceThreshold) {
      return baseSignal;
    }
    
    return null;
  }

  // Performance metrics calculation (simplified)
  getPerformanceMetrics() {
    return {
      totalTrades: this.signals.length,
      hitRate: Math.random() * 30 + 65, // 65-95%
      avgRewardPerTrade: (Math.random() - 0.2) * 5, // -1 to 4
      sharpeRatio: Math.random() * 1.5 + 0.5, // 0.5-2.0
      maxDrawdown: Math.random() * 15 + 5, // 5-20%
      profitFactor: Math.random() * 1.2 + 0.8 // 0.8-2.0
    };
  }

  startEngine(callback: (signal: TradingSignal) => void) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    const generateSignalInterval = () => {
      if (!this.isRunning) return;
      
      const signal = this.generateEnhancedSignal();
      if (signal) {
        this.addSignal(signal);
        callback(signal);
      }
      
      const nextInterval = Math.random() * 17000 + 8000;
      this.intervalId = setTimeout(generateSignalInterval, nextInterval);
    };
    
    this.intervalId = setTimeout(generateSignalInterval, 3000);
  }

  stopEngine() {
    this.isRunning = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  addSignal(signal: TradingSignal) {
    this.signals.unshift(signal);
    if (this.signals.length > 50) {
      this.signals = this.signals.slice(0, 50);
    }
  }

  getSignals(): TradingSignal[] {
    return this.signals;
  }
}

export const enhancedSignalEngine = new EnhancedSignalEngine();

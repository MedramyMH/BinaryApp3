import { useState, useEffect } from 'react';
import { TradingSignal } from '@/types/trading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Clock, Target, Timer, DollarSign, Brain, Zap } from 'lucide-react';

interface SignalCardProps {
  signal: TradingSignal;
}

export default function SignalCard({ signal }: SignalCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);
  
  const isBuy = signal.direction === 'BUY';
  const isOTC = signal.symbol.includes('_OTC');
  const isHighConfidence = signal.confidence >= 95;
  const isExpertLevel = signal.generators.some((gen: any) => gen.complexity === 'expert');
  
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(signal.expiryTime).getTime();
      const difference = expiryTime - now;
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${seconds}s`);
        }
      } else {
        setTimeLeft('EXPIRED');
        setIsExpired(true);
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [signal.expiryTime]);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'expert': return 'bg-purple-600 text-white';
      case 'advanced': return 'bg-blue-600 text-white';
      case 'intermediate': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`w-full hover:shadow-lg transition-shadow ${isExpired ? 'opacity-60' : ''} ${isOTC ? 'border-l-4 border-l-orange-400' : ''} ${isHighConfidence ? 'border-l-4 border-l-green-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            {signal.symbol}
            <Badge variant="outline" className="text-xs">
              {signal.timeframe}
            </Badge>
            {isOTC && (
              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                OTC
              </Badge>
            )}
            {isExpertLevel && (
              <Badge className="text-xs bg-purple-600">
                <Brain className="w-3 h-3 mr-1" />
                EXPERT
              </Badge>
            )}
            {isHighConfidence && (
              <Badge className="text-xs bg-green-600 animate-pulse">
                <Zap className="w-3 h-3 mr-1" />
                HIGH
              </Badge>
            )}
          </CardTitle>
          <Badge 
            variant={isBuy ? "default" : "destructive"} 
            className={`flex items-center gap-1 ${isBuy ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isBuy ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {signal.direction}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Special Notices */}
        {(isOTC || isHighConfidence || isExpertLevel) && (
          <div className="space-y-2">
            {isOTC && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-800 font-medium">OTC Asset - Available 24/7</span>
                </div>
              </div>
            )}
            
            {isHighConfidence && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800 font-medium">High Confidence Signal - Premium Quality</span>
                </div>
              </div>
            )}
            
            {isExpertLevel && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-800 font-medium">Expert-Level AI Analysis</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Price Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Entry Price</div>
            <div className="font-mono text-sm font-bold">{signal.entryPrice.toFixed(4)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Current Price</div>
            <div className="font-mono text-sm font-bold text-blue-600">{signal.currentPrice.toFixed(4)}</div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Confidence</span>
            <span className="text-sm font-bold">{signal.confidence.toFixed(1)}%</span>
          </div>
          <Progress 
            value={signal.confidence} 
            className={`h-2 ${signal.confidence >= 95 ? 'bg-green-100' : signal.confidence >= 90 ? 'bg-blue-100' : signal.confidence >= 85 ? 'bg-yellow-100' : 'bg-orange-100'}`}
          />
        </div>

        {/* Countdown Timer */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Time Left</span>
            </div>
            <Badge 
              variant={isExpired ? "destructive" : timeLeft.includes('s') && !timeLeft.includes('m') ? "destructive" : "secondary"}
              className={`font-mono ${!isExpired && timeLeft.includes('s') && !timeLeft.includes('m') ? 'animate-pulse' : ''}`}
            >
              {timeLeft}
            </Badge>
          </div>
        </div>

        {/* Signal Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Expiry: {signal.expiry}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span>Pocket Option</span>
          </div>
        </div>

        {/* Advanced Generator Consensus */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Professional AI Generators ({signal.generators.length})</h4>
          <div className="grid grid-cols-1 gap-2">
            {signal.generators.slice(0, 4).map((gen: any, index) => (
              <div key={gen.id} className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{gen.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-1 py-0 ${getComplexityColor(gen.complexity)}`}
                  >
                    {gen.complexity}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-1 py-0 ${getRiskColor(gen.riskLevel)}`}
                  >
                    {gen.riskLevel}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={gen.direction === signal.direction ? "default" : "secondary"}
                    className={`text-xs px-1 py-0 ${gen.direction === 'BUY' ? 'bg-green-600' : gen.direction === 'SELL' ? 'bg-red-600' : ''}`}
                  >
                    {gen.direction}
                  </Badge>
                  <span className="font-bold">{gen.confidence.toFixed(0)}%</span>
                </div>
              </div>
            ))}
            {signal.generators.length > 4 && (
              <div className="text-xs text-muted-foreground text-center">
                +{signal.generators.length - 4} more generators in consensus
              </div>
            )}
          </div>
        </div>

        {/* Active Signals */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Active Professional Signals</h4>
          <div className="flex flex-wrap gap-1">
            {signal.generators[0]?.signals.slice(0, 4).map((signalName: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {signalName}
              </Badge>
            ))}
          </div>
        </div>

        {/* Strategy Information */}
        {signal.generators[0]?.strategy && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Primary Strategy</h4>
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              {signal.generators[0].strategy}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground border-t pt-2 flex justify-between">
          <span>Generated: {signal.timestamp.toLocaleTimeString()}</span>
          <span className="font-medium">
            {isExpertLevel ? 'Expert AI Signal' : isOTC ? 'OTC Signal' : 'Professional Signal'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

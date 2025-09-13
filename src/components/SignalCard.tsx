import { useState, useEffect } from 'react';
import { TradingSignal } from '@/types/trading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Clock, Target, Timer, DollarSign } from 'lucide-react';

interface SignalCardProps {
  signal: TradingSignal;
}

export default function SignalCard({ signal }: SignalCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);
  
  const isBuy = signal.direction === 'BUY';
  
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

  return (
    <Card className={`w-full hover:shadow-lg transition-shadow ${isExpired ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            {signal.symbol}
            <Badge variant="outline" className="text-xs">
              {signal.timeframe}
            </Badge>
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
            className={`h-2 ${signal.confidence >= 95 ? 'bg-green-100' : signal.confidence >= 85 ? 'bg-yellow-100' : 'bg-orange-100'}`}
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

        {/* Generator Consensus */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">AI Generator Consensus</h4>
          <div className="grid grid-cols-2 gap-2">
            {signal.generators.map((gen, index) => (
              <div key={gen.id} className="flex items-center justify-between text-xs">
                <span>Gen {gen.id}</span>
                <Badge 
                  variant={gen.direction === signal.direction ? "default" : "secondary"}
                  className={`text-xs px-1 py-0 ${gen.direction === 'BUY' ? 'bg-green-600' : gen.direction === 'SELL' ? 'bg-red-600' : ''}`}
                >
                  {gen.direction} {gen.confidence.toFixed(0)}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Active Signals */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Active Indicators</h4>
          <div className="flex flex-wrap gap-1">
            {signal.generators[0]?.signals.slice(0, 3).map((signalName, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {signalName}
              </Badge>
            ))}
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground border-t pt-2 flex justify-between">
          <span>Generated: {signal.timestamp.toLocaleTimeString()}</span>
          <span className="font-medium">Real-Time Signal</span>
        </div>
      </CardContent>
    </Card>
  );
}
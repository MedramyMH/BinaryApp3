import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign, 
  BarChart3,
  Activity
} from 'lucide-react';

export default function PerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    totalTrades: 0,
    hitRate: 0,
    avgRewardPerTrade: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    profitFactor: 0
  });

  useEffect(() => {
    // Simulate performance metrics
    const simulateMetrics = () => {
      setMetrics({
        totalTrades: Math.floor(Math.random() * 100) + 50,
        hitRate: Math.random() * 30 + 60, // 60-90%
        avgRewardPerTrade: (Math.random() - 0.3) * 10, // -3 to 7
        sharpeRatio: Math.random() * 2 + 0.5, // 0.5-2.5
        maxDrawdown: Math.random() * 20 + 5, // 5-25%
        profitFactor: Math.random() * 1.5 + 0.8 // 0.8-2.3
      });
    };

    simulateMetrics();
    const interval = setInterval(simulateMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (value: number, type: 'percentage' | 'ratio' | 'drawdown') => {
    if (type === 'percentage') {
      return value >= 70 ? 'text-green-600' : value >= 50 ? 'text-yellow-600' : 'text-red-600';
    } else if (type === 'ratio') {
      return value >= 1.5 ? 'text-green-600' : value >= 1.0 ? 'text-yellow-600' : 'text-red-600';
    } else { // drawdown
      return value <= 10 ? 'text-green-600' : value <= 20 ? 'text-yellow-600' : 'text-red-600';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Performance Metrics & Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Total Trades */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Total Trades</span>
            </div>
            <div className="text-2xl font-bold">{metrics.totalTrades}</div>
            <Progress value={Math.min(metrics.totalTrades * 2, 100)} className="h-1" />
          </div>

          {/* Hit Rate */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Hit Rate</span>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.hitRate, 'percentage')}`}>
              {metrics.hitRate.toFixed(1)}%
            </div>
            <Progress value={metrics.hitRate} className="h-1" />
          </div>

          {/* Avg Reward Per Trade */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Avg Reward</span>
            </div>
            <div className={`text-2xl font-bold ${metrics.avgRewardPerTrade >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${metrics.avgRewardPerTrade.toFixed(2)}
            </div>
            <Badge variant={metrics.avgRewardPerTrade >= 0 ? "default" : "destructive"} className="text-xs">
              Per Trade
            </Badge>
          </div>

          {/* Sharpe Ratio */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium">Sharpe Ratio</span>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.sharpeRatio, 'ratio')}`}>
              {metrics.sharpeRatio.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Risk-Adjusted Return</div>
          </div>

          {/* Max Drawdown */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">Max Drawdown</span>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.maxDrawdown, 'drawdown')}`}>
              {metrics.maxDrawdown.toFixed(1)}%
            </div>
            <Progress 
              value={metrics.maxDrawdown} 
              className="h-1"
            />
          </div>

          {/* Profit Factor */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">Profit Factor</span>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.profitFactor, 'ratio')}`}>
              {metrics.profitFactor.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Wins/Losses Ratio</div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Performance Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Strategy Status: </span>
              <Badge variant={metrics.hitRate >= 60 ? "default" : "secondary"}>
                {metrics.hitRate >= 60 ? 'Profitable' : 'Developing'}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Risk Level: </span>
              <Badge variant={metrics.maxDrawdown <= 15 ? "default" : "destructive"}>
                {metrics.maxDrawdown <= 15 ? 'Low Risk' : 'High Risk'}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Consistency: </span>
              <Badge variant={metrics.sharpeRatio >= 1 ? "default" : "secondary"}>
                {metrics.sharpeRatio >= 1 ? 'Consistent' : 'Variable'}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Sample Size: </span>
              <Badge variant={metrics.totalTrades >= 30 ? "default" : "outline"}>
                {metrics.totalTrades >= 30 ? 'Significant' : 'Building'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Clock,
  PlayCircle,
  StopCircle,
  Download
} from 'lucide-react';
import { BacktestingEngine } from '@/lib/backtestingEngine';
import { pocketOptionAssets } from '@/lib/mockData';

interface BacktestResults {
  totalTrades: number;
  winRate: number;
  netProfit: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdownPercent: number;
  roi: number;
  avgWin: number;
  avgLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
}

export default function BacktestingInterface() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BacktestResults | null>(null);
  const [settings, setSettings] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0],
    initialBalance: 1000,
    tradeAmount: 50,
    payoutRate: 0.8,
    slippagePercent: 0.1,
    commissionPercent: 0,
    confidenceThreshold: 85,
    symbols: ['EUR/USD', 'GBP/USD', 'BTC/USD', 'GOLD'],
    timeframes: ['M1', 'M5', 'M15']
  });

  const runBacktest = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    try {
      const engine = new BacktestingEngine({
        startDate: new Date(settings.startDate),
        endDate: new Date(settings.endDate),
        initialBalance: settings.initialBalance,
        tradeAmount: settings.tradeAmount,
        payoutRate: settings.payoutRate,
        slippagePercent: settings.slippagePercent,
        commissionPercent: settings.commissionPercent,
        confidenceThreshold: settings.confidenceThreshold,
        symbols: settings.symbols,
        timeframes: settings.timeframes
      });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const backtestResults = await engine.runBacktest();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setResults(backtestResults);
        setIsRunning(false);
      }, 500);

    } catch (error) {
      console.error('Backtest error:', error);
      setIsRunning(false);
    }
  };

  const exportResults = () => {
    if (!results) return;
    
    const data = {
      settings,
      results,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backtest_results_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (value: number, type: 'percentage' | 'ratio' | 'profit') => {
    if (type === 'percentage') {
      return value >= 70 ? 'text-green-600' : value >= 50 ? 'text-yellow-600' : 'text-red-600';
    } else if (type === 'ratio') {
      return value >= 1.5 ? 'text-green-600' : value >= 1.0 ? 'text-yellow-600' : 'text-red-600';
    } else { // profit
      return value >= 0 ? 'text-green-600' : 'text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Strategy Backtesting Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Date Range */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Date Range</h3>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={settings.startDate}
                      onChange={(e) => setSettings(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={settings.endDate}
                      onChange={(e) => setSettings(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Trading Parameters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Trading Parameters</h3>
                  <div className="space-y-2">
                    <Label htmlFor="initialBalance">Initial Balance ($)</Label>
                    <Input
                      id="initialBalance"
                      type="number"
                      value={settings.initialBalance}
                      onChange={(e) => setSettings(prev => ({ ...prev, initialBalance: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tradeAmount">Trade Amount ($)</Label>
                    <Input
                      id="tradeAmount"
                      type="number"
                      value={settings.tradeAmount}
                      onChange={(e) => setSettings(prev => ({ ...prev, tradeAmount: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payoutRate">Payout Rate (%)</Label>
                    <Input
                      id="payoutRate"
                      type="number"
                      step="0.1"
                      value={settings.payoutRate * 100}
                      onChange={(e) => setSettings(prev => ({ ...prev, payoutRate: Number(e.target.value) / 100 }))}
                    />
                  </div>
                </div>

                {/* Risk Parameters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Risk Parameters</h3>
                  <div className="space-y-2">
                    <Label htmlFor="confidenceThreshold">Confidence Threshold (%)</Label>
                    <Input
                      id="confidenceThreshold"
                      type="number"
                      value={settings.confidenceThreshold}
                      onChange={(e) => setSettings(prev => ({ ...prev, confidenceThreshold: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slippage">Slippage (%)</Label>
                    <Input
                      id="slippage"
                      type="number"
                      step="0.01"
                      value={settings.slippagePercent}
                      onChange={(e) => setSettings(prev => ({ ...prev, slippagePercent: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commission">Commission (%)</Label>
                    <Input
                      id="commission"
                      type="number"
                      step="0.01"
                      value={settings.commissionPercent}
                      onChange={(e) => setSettings(prev => ({ ...prev, commissionPercent: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              {/* Asset Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Asset Selection</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {pocketOptionAssets.slice(0, 12).map(asset => (
                    <label key={asset.symbol} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.symbols.includes(asset.symbol)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSettings(prev => ({ ...prev, symbols: [...prev.symbols, asset.symbol] }));
                          } else {
                            setSettings(prev => ({ ...prev, symbols: prev.symbols.filter(s => s !== asset.symbol) }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{asset.symbol}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Run Backtest */}
              <div className="flex items-center gap-4">
                <Button 
                  onClick={runBacktest} 
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  {isRunning ? <StopCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                  {isRunning ? 'Running...' : 'Run Backtest'}
                </Button>
                
                {results && (
                  <Button variant="outline" onClick={exportResults} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Results
                  </Button>
                )}
              </div>

              {/* Progress */}
              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Running backtest...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {results ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Key Metrics */}
                  <Card className="p-4">
                    <div className="text-center space-y-1">
                      <Target className="w-6 h-6 mx-auto text-blue-600" />
                      <div className="text-2xl font-bold">{results.totalTrades}</div>
                      <div className="text-sm text-muted-foreground">Total Trades</div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center space-y-1">
                      <TrendingUp className="w-6 h-6 mx-auto text-green-600" />
                      <div className={`text-2xl font-bold ${getScoreColor(results.winRate, 'percentage')}`}>
                        {results.winRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center space-y-1">
                      <DollarSign className="w-6 h-6 mx-auto text-purple-600" />
                      <div className={`text-2xl font-bold ${getScoreColor(results.netProfit, 'profit')}`}>
                        ${results.netProfit.toFixed(0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Net Profit</div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center space-y-1">
                      <BarChart3 className="w-6 h-6 mx-auto text-orange-600" />
                      <div className={`text-2xl font-bold ${getScoreColor(results.roi, 'profit')}`}>
                        {results.roi.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">ROI</div>
                    </div>
                  </Card>

                  {/* Advanced Metrics */}
                  <Card className="p-4">
                    <div className="text-center space-y-1">
                      <div className={`text-2xl font-bold ${getScoreColor(results.profitFactor, 'ratio')}`}>
                        {results.profitFactor.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Profit Factor</div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center space-y-1">
                      <div className={`text-2xl font-bold ${getScoreColor(results.sharpeRatio, 'ratio')}`}>
                        {results.sharpeRatio.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center space-y-1">
                      <div className={`text-2xl font-bold ${results.maxDrawdownPercent <= 15 ? 'text-green-600' : 'text-red-600'}`}>
                        {results.maxDrawdownPercent.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Max Drawdown</div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.consecutiveWins}
                      </div>
                      <div className="text-sm text-muted-foreground">Max Consecutive Wins</div>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No backtest results yet</p>
                  <p className="text-sm">Configure your settings and run a backtest to see results</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              {results ? (
                <div className="space-y-6">
                  {/* Performance Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-medium">Trade Statistics</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Average Win:</span>
                              <span className="font-medium text-green-600">${results.avgWin.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Average Loss:</span>
                              <span className="font-medium text-red-600">${results.avgLoss.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Win/Loss Ratio:</span>
                              <span className="font-medium">
                                {results.avgLoss > 0 ? (results.avgWin / results.avgLoss).toFixed(2) : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max Consecutive Losses:</span>
                              <span className="font-medium text-red-600">{results.consecutiveLosses}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium">Risk Assessment</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Risk Level:</span>
                              <Badge variant={results.maxDrawdownPercent <= 15 ? "default" : "destructive"}>
                                {results.maxDrawdownPercent <= 15 ? 'Low Risk' : 'High Risk'}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Strategy Viability:</span>
                              <Badge variant={results.profitFactor >= 1.2 ? "default" : "secondary"}>
                                {results.profitFactor >= 1.2 ? 'Viable' : 'Needs Improvement'}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Consistency:</span>
                              <Badge variant={results.sharpeRatio >= 1 ? "default" : "outline"}>
                                {results.sharpeRatio >= 1 ? 'Consistent' : 'Variable'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Optimization Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {results.winRate < 60 && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <strong>Win Rate:</strong> Consider increasing confidence threshold to improve win rate (currently {results.winRate.toFixed(1)}%)
                            </p>
                          </div>
                        )}
                        
                        {results.maxDrawdownPercent > 20 && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">
                              <strong>Risk Management:</strong> High drawdown detected ({results.maxDrawdownPercent.toFixed(1)}%). Consider reducing trade size or improving entry criteria.
                            </p>
                          </div>
                        )}
                        
                        {results.profitFactor < 1.2 && (
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-800">
                              <strong>Profitability:</strong> Low profit factor ({results.profitFactor.toFixed(2)}). Strategy may need refinement or different market conditions.
                            </p>
                          </div>
                        )}
                        
                        {results.profitFactor >= 1.5 && results.winRate >= 65 && results.maxDrawdownPercent <= 15 && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                              <strong>Excellent Performance:</strong> Strategy shows strong potential with good risk-adjusted returns. Consider live testing with small amounts.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No analysis available</p>
                  <p className="text-sm">Run a backtest first to see detailed analysis and recommendations</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

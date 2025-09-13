import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Calculator, 
  Calendar, 
  Filter, 
  DollarSign, 
  BarChart3,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { generateHeatMapData, mockEconomicEvents, generateMockMarketData } from '@/lib/mockData';
import { signalEngine } from '@/lib/signalEngine';
import { HeatMapData, EconomicEvent, MarketData } from '@/types/trading';

export default function TradingTools() {
  const [heatMapData, setHeatMapData] = useState<HeatMapData[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [fibHigh, setFibHigh] = useState<string>('1.2000');
  const [fibLow, setFibLow] = useState<string>('1.1800');
  const [spreadBid, setSpreadBid] = useState<string>('1.1950');
  const [spreadAsk, setSpreadAsk] = useState<string>('1.1952');

  useEffect(() => {
    setHeatMapData(generateHeatMapData());
    setMarketData(generateMockMarketData());
    
    const interval = setInterval(() => {
      setHeatMapData(generateHeatMapData());
      setMarketData(generateMockMarketData());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fibLevels = signalEngine.calculateFibonacci(
    parseFloat(fibHigh) || 1.2000, 
    parseFloat(fibLow) || 1.1800
  );

  const spreadResult = signalEngine.calculateSpread(
    parseFloat(spreadBid) || 1.1950,
    parseFloat(spreadAsk) || 1.1952
  );

  return (
    <Tabs defaultValue="heatmap" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="heatmap" className="flex items-center gap-1">
          <BarChart3 className="w-4 h-4" />
          Heat Map
        </TabsTrigger>
        <TabsTrigger value="fibonacci" className="flex items-center gap-1">
          <Calculator className="w-4 h-4" />
          Fibonacci
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          Calendar
        </TabsTrigger>
        <TabsTrigger value="screener" className="flex items-center gap-1">
          <Filter className="w-4 h-4" />
          Screener
        </TabsTrigger>
        <TabsTrigger value="spreads" className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          Spreads
        </TabsTrigger>
        <TabsTrigger value="monitor" className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          Monitor
        </TabsTrigger>
      </TabsList>

      {/* Binary Heat Map */}
      <TabsContent value="heatmap" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Binary Heat Map - Market Strength Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {heatMapData.map((data) => (
                <Card key={data.symbol} className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{data.symbol}</span>
                      <Badge variant={
                        data.trend === 'bullish' ? 'default' : 
                        data.trend === 'bearish' ? 'destructive' : 'secondary'
                      }>
                        {data.trend}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Strength</span>
                        <span>{data.strength.toFixed(0)}%</span>
                      </div>
                      <Progress value={data.strength} className="h-1" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Vol: {(data.volatility).toFixed(1)}%
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Fibonacci Calculator */}
      <TabsContent value="fibonacci" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Advanced Fibonacci Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">High Price</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={fibHigh}
                  onChange={(e) => setFibHigh(e.target.value)}
                  placeholder="1.2000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Low Price</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={fibLow}
                  onChange={(e) => setFibLow(e.target.value)}
                  placeholder="1.1800"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Fibonacci Retracement Levels</h4>
              <div className="space-y-2">
                {fibLevels.map((level, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">{level.label}</span>
                    <span className="font-mono">{level.price.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Economic Calendar */}
      <TabsContent value="calendar" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Advanced Economic Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockEconomicEvents.map((event) => (
                <Card key={event.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <Badge variant="outline">{event.currency}</Badge>
                      <Badge variant={
                        event.impact === 'high' ? 'destructive' :
                        event.impact === 'medium' ? 'default' : 'secondary'
                      }>
                        {event.impact} impact
                      </Badge>
                    </div>
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="mt-2">
                    <p className="font-medium">{event.event}</p>
                    <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                      <span>Forecast: {event.forecast}</span>
                      <span>Previous: {event.previous}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Price Screener */}
      <TabsContent value="screener" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Price Screener - Signal Strength Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketData
                .filter(data => Math.abs(data.changePercent) > 0.5)
                .map((data) => (
                <div key={data.symbol} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{data.symbol}</span>
                    <Badge variant={data.trend === 'up' ? 'default' : 'destructive'}>
                      {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">{data.price.toFixed(4)}</div>
                    <div className="text-sm text-muted-foreground">
                      Vol: {(data.volume / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Spreads Calculator */}
      <TabsContent value="spreads" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Spreads Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bid Price</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={spreadBid}
                  onChange={(e) => setSpreadBid(e.target.value)}
                  placeholder="1.1950"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ask Price</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={spreadAsk}
                  onChange={(e) => setSpreadAsk(e.target.value)}
                  placeholder="1.1952"
                />
              </div>
            </div>
            
            <Card className="p-4 bg-muted">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{spreadResult.spread}</div>
                  <div className="text-sm text-muted-foreground">Spread (pips)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{spreadResult.percentage}%</div>
                  <div className="text-sm text-muted-foreground">Percentage</div>
                </div>
              </div>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Market Monitor */}
      <TabsContent value="monitor" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Crypto & Forex Market Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketData.map((data) => (
                <Card key={data.symbol} className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{data.symbol}</span>
                      <Badge variant={data.change > 0 ? 'default' : 'destructive'}>
                        {data.change > 0 ? '+' : ''}{data.change.toFixed(4)}
                      </Badge>
                    </div>
                    <div className="text-lg font-mono">{data.price.toFixed(4)}</div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>H: {data.high24h.toFixed(4)}</span>
                      <span>L: {data.low24h.toFixed(4)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
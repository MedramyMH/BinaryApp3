import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react';
import { MarketData } from '@/types/trading';
import { generateMockMarketData, platforms } from '@/lib/mockData';

interface MarketDataProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

export default function MarketDataComponent({ selectedPlatform, onPlatformChange }: MarketDataProps) {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMarketData(generateMockMarketData());
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    setMarketData(generateMockMarketData());
    
    const interval = setInterval(() => {
      setMarketData(generateMockMarketData());
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const topMovers = marketData
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Platform Selection & Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Market Overview
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Trading Platform:</span>
              <Select value={selectedPlatform} onValueChange={onPlatformChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center gap-2">
                        <span>{platform.logo}</span>
                        <span>{platform.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Movers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Market Movers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topMovers.map((data) => (
              <Card key={data.symbol} className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">{data.symbol}</span>
                    {data.changePercent > 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-2xl font-mono font-bold">
                      {data.price.toFixed(4)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={data.changePercent > 0 ? 'default' : 'destructive'}>
                        {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {data.change > 0 ? '+' : ''}{data.change.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">High: </span>
                      <span className="font-mono">{data.high24h.toFixed(4)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Low: </span>
                      <span className="font-mono">{data.low24h.toFixed(4)}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Volume: </span>
                    <span className="font-medium">{(data.volume / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Pairs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Currency Pairs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {marketData.map((data) => (
              <div key={data.symbol} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-medium min-w-20">{data.symbol}</span>
                  <Badge variant="outline" className="text-xs">
                    {data.trend}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-6">
                  <span className="font-mono text-lg">{data.price.toFixed(4)}</span>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={data.changePercent > 0 ? 'default' : 'destructive'}>
                      {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground min-w-16 text-right">
                    Vol: {(data.volume / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
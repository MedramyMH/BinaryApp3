import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Settings, Zap } from 'lucide-react';
import { GeneratorResult } from '@/types/trading';
import { generateMockGenerators } from '@/lib/mockData';

interface SignalGeneratorProps {
  onSignalGenerated: (generators: GeneratorResult[]) => void;
  isRunning: boolean;
  onToggle: () => void;
  confidenceThreshold: number;
  onThresholdChange: (value: number) => void;
}

export default function SignalGenerator({ 
  onSignalGenerated, 
  isRunning, 
  onToggle,
  confidenceThreshold,
  onThresholdChange 
}: SignalGeneratorProps) {
  const [generators, setGenerators] = useState<GeneratorResult[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const newGenerators = generateMockGenerators();
      setGenerators(newGenerators);
      setLastUpdate(new Date());
      onSignalGenerated(newGenerators);
    }, 3000);

    return () => clearInterval(interval);
  }, [isRunning, onSignalGenerated]);

  const agreementCount = generators.length > 0 ? 
    Math.max(
      generators.filter(g => g.direction === 'CALL').length,
      generators.filter(g => g.direction === 'PUT').length
    ) : 0;

  const consensusStrength = agreementCount >= 3 ? 'Strong' : 
                           agreementCount === 2 ? 'Moderate' : 'Weak';

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Signal Engine Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={onToggle}
              variant={isRunning ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Stop Engine' : 'Start Engine'}
            </Button>
            
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Status:</span>
              <Badge variant={isRunning ? "default" : "secondary"}>
                {isRunning ? 'Running' : 'Stopped'}
              </Badge>
            </div>
          </div>

          {/* Confidence Threshold */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Confidence Threshold</span>
              <span className="text-sm font-bold">{confidenceThreshold}%</span>
            </div>
            <Slider
              value={[confidenceThreshold]}
              onValueChange={(value) => onThresholdChange(value[0])}
              max={95}
              min={65}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>65%</span>
              <span>95%</span>
            </div>
          </div>

          {generators.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Last Update: {lastUpdate.toLocaleTimeString()} | 
              Consensus: {consensusStrength} ({agreementCount}/4 agree)
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generator Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {generators.map((generator) => (
          <Card key={generator.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Generator {generator.id}</span>
                <Badge variant={generator.direction === 'CALL' ? "default" : "destructive"}>
                  {generator.direction}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{generator.name}</p>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>Indicators: {generator.indicators}</span>
                <span className="font-bold">{generator.confidence.toFixed(1)}%</span>
              </div>
              
              <Progress value={generator.confidence} className="h-2" />
              
              <div className="space-y-1">
                <p className="text-xs font-medium">Active Signals:</p>
                <div className="flex flex-wrap gap-1">
                  {generator.signals.map((signal, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {signal}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>

            {/* Animated indicator for active generator */}
            {isRunning && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-pulse m-2" />
            )}
          </Card>
        ))}
      </div>

      {generators.length === 0 && isRunning && (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Initializing signal generators...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
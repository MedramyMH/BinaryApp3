import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  Brain,
  Target,
  TrendingUp,
  BarChart3,
  Activity
} from 'lucide-react';
import { GeneratorResult } from '@/types/trading';
import { enhancedSignalEngine } from '@/lib/enhancedSignalEngine';

interface SignalGeneratorProps {
  onSignalGenerated: (generators: GeneratorResult[]) => void;
  isRunning: boolean;
  onToggle: () => void;
  confidenceThreshold: number;
  onThresholdChange: (threshold: number) => void;
}

export default function SignalGenerator({
  onSignalGenerated,
  isRunning,
  onToggle,
  confidenceThreshold,
  onThresholdChange
}: SignalGeneratorProps) {
  const [generators, setGenerators] = useState<any[]>([]);
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [lastGeneration, setLastGeneration] = useState<Date | null>(null);

  useEffect(() => {
    // Load advanced generators
    const advancedGens = enhancedSignalEngine.getAdvancedGenerators();
    setGenerators(advancedGens);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setGeneratingProgress(prev => {
          const newProgress = (prev + Math.random() * 15 + 5) % 100;
          if (newProgress < prev) {
            setLastGeneration(new Date());
          }
          return newProgress;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

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
      case 'low': return 'border-green-200 bg-green-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'high': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Professional Signal Generation Engine
            <Badge variant="default" className="bg-purple-600">
              10 Advanced Generators
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="control" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="control">Control Panel</TabsTrigger>
              <TabsTrigger value="generators">AI Generators</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="control" className="space-y-6">
              {/* Engine Control */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Engine Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Engine Status</Label>
                      <p className="text-xs text-muted-foreground">
                        Professional AI signal generation
                      </p>
                    </div>
                    <Button
                      onClick={onToggle}
                      variant={isRunning ? "destructive" : "default"}
                      className="flex items-center gap-2"
                    >
                      {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isRunning ? 'Stop Engine' : 'Start Engine'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Confidence Threshold: {confidenceThreshold}%
                    </Label>
                    <Slider
                      value={[confidenceThreshold]}
                      onValueChange={(value) => onThresholdChange(value[0])}
                      min={60}
                      max={98}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>60% (More Signals)</span>
                      <span>98% (Highest Quality)</span>
                    </div>
                  </div>

                  {isRunning && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">Signal Generation Progress</Label>
                        <span className="text-xs text-muted-foreground">
                          {generatingProgress.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={generatingProgress} className="h-2" />
                      {lastGeneration && (
                        <p className="text-xs text-muted-foreground">
                          Last signal: {lastGeneration.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 border-green-200">
                  <div className="text-center space-y-1">
                    <Brain className="w-6 h-6 mx-auto text-green-600" />
                    <div className="text-2xl font-bold">{generators.length}</div>
                    <div className="text-sm text-muted-foreground">AI Generators</div>
                  </div>
                </Card>
                <Card className="p-4 border-blue-200">
                  <div className="text-center space-y-1">
                    <Target className="w-6 h-6 mx-auto text-blue-600" />
                    <div className="text-2xl font-bold">{generators.filter(g => g.complexity === 'expert').length}</div>
                    <div className="text-sm text-muted-foreground">Expert Level</div>
                  </div>
                </Card>
                <Card className="p-4 border-purple-200">
                  <div className="text-center space-y-1">
                    <TrendingUp className="w-6 h-6 mx-auto text-purple-600" />
                    <div className="text-2xl font-bold">
                      {generators.length > 0 ? (generators.reduce((sum, g) => sum + g.accuracy, 0) / generators.length).toFixed(1) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Accuracy</div>
                  </div>
                </Card>
                <Card className="p-4 border-orange-200">
                  <div className="text-center space-y-1">
                    <Activity className="w-6 h-6 mx-auto text-orange-600" />
                    <div className="text-2xl font-bold">{confidenceThreshold}%</div>
                    <div className="text-sm text-muted-foreground">Threshold</div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="generators" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generators.map((generator) => (
                  <Card key={generator.id} className={`${getRiskColor(generator.riskLevel)}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-bold">{generator.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getComplexityColor(generator.complexity)}`}>
                            {generator.complexity}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {generator.accuracy.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs text-muted-foreground">
                        {generator.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Indicators:</span>
                          <span className="font-bold">{generator.indicators}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Risk Level:</span>
                          <Badge variant="outline" className={`text-xs ${generator.riskLevel === 'low' ? 'text-green-600' : generator.riskLevel === 'high' ? 'text-red-600' : 'text-yellow-600'}`}>
                            {generator.riskLevel}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Timeframes:</span>
                          <span className="text-xs">{generator.timeframes.join(', ')}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-medium">Strategy:</div>
                        <div className="text-xs text-muted-foreground bg-white/50 p-2 rounded">
                          {generator.strategy}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Accuracy Rate</span>
                          <span>{generator.accuracy.toFixed(1)}%</span>
                        </div>
                        <Progress value={generator.accuracy} className="h-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Generator Performance Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Performance by Complexity */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Performance by Complexity Level</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['expert', 'advanced', 'intermediate'].map((complexity) => {
                          const gensByComplexity = generators.filter(g => g.complexity === complexity);
                          const avgAccuracy = gensByComplexity.length > 0 ? 
                            gensByComplexity.reduce((sum, g) => sum + g.accuracy, 0) / gensByComplexity.length : 0;
                          
                          return (
                            <Card key={complexity} className="p-3">
                              <div className="text-center space-y-2">
                                <Badge className={getComplexityColor(complexity)}>
                                  {complexity.toUpperCase()}
                                </Badge>
                                <div className="text-2xl font-bold">{avgAccuracy.toFixed(1)}%</div>
                                <div className="text-xs text-muted-foreground">
                                  {gensByComplexity.length} generators
                                </div>
                                <Progress value={avgAccuracy} className="h-1" />
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>

                    {/* Top Performers */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Top Performing Generators</h4>
                      <div className="space-y-2">
                        {generators
                          .sort((a, b) => b.accuracy - a.accuracy)
                          .slice(0, 5)
                          .map((gen, index) => (
                            <div key={gen.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  #{index + 1}
                                </Badge>
                                <span className="text-sm font-medium">{gen.name}</span>
                                <Badge className={`text-xs ${getComplexityColor(gen.complexity)}`}>
                                  {gen.complexity}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-green-600">
                                  {gen.accuracy.toFixed(1)}%
                                </span>
                                <Progress value={gen.accuracy} className="h-1 w-16" />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* System Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {generators.reduce((sum, g) => sum + g.indicators, 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Indicators</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {generators.filter(g => g.accuracy >= 90).length}
                        </div>
                        <div className="text-xs text-muted-foreground">90%+ Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {generators.filter(g => g.complexity === 'expert').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Expert Systems</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {new Set(generators.flatMap(g => g.timeframes)).size}
                        </div>
                        <div className="text-xs text-muted-foreground">Timeframes</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

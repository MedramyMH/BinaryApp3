import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Settings, 
  Volume2, 
  VolumeX,
  Trash2,
  CheckCheck,
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react';
import { alertSystem } from '@/lib/alertSystem';

interface Alert {
  id: string;
  type: 'signal' | 'news' | 'economic' | 'performance' | 'system';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  read: boolean;
}

export default function AlertCenter() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settings, setSettings] = useState(alertSystem.getSettings());
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Subscribe to alert updates
    const handleAlertsUpdate = (updatedAlerts: Alert[]) => {
      setAlerts(updatedAlerts);
      setUnreadCount(updatedAlerts.filter(a => !a.read).length);
    };

    alertSystem.subscribe(handleAlertsUpdate);
    
    // Initial load
    setAlerts(alertSystem.getAlerts());
    setUnreadCount(alertSystem.getUnreadCount());

    return () => {
      alertSystem.unsubscribe(handleAlertsUpdate);
    };
  }, []);

  const updateSettings = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    alertSystem.updateSettings({ [key]: value });
  };

  const updateNestedSettings = (category: string, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [key]: value
      }
    };
    setSettings(newSettings);
    alertSystem.updateSettings({ [category]: newSettings[category as keyof typeof newSettings] });
  };

  const getPriorityIcon = (priority: Alert['priority']) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high': return <Zap className="w-4 h-4 text-orange-600" />;
      case 'medium': return <Info className="w-4 h-4 text-blue-600" />;
      case 'low': return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-blue-500 bg-blue-50';
      case 'low': return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    const icons = {
      signal: '📊',
      news: '📰',
      economic: '📈',
      performance: '⚡',
      system: '⚙️'
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alert Center
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {unreadCount} unread
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="alerts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
              <TabsTrigger value="settings">Alert Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alertSystem.markAllAsRead()}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alertSystem.clearAllAlerts()}
                  disabled={alerts.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>

              <ScrollArea className="h-96">
                {alerts.length > 0 ? (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <Card 
                        key={alert.id} 
                        className={`border-l-4 ${getPriorityColor(alert.priority)} ${!alert.read ? 'shadow-md' : 'opacity-75'}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getPriorityIcon(alert.priority)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{getTypeIcon(alert.type)}</span>
                                <h4 className={`font-medium ${!alert.read ? 'font-bold' : ''}`}>
                                  {alert.title}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {alert.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {alert.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {alert.timestamp.toLocaleString()}
                                </span>
                                <div className="flex items-center gap-2">
                                  {!alert.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => alertSystem.markAsRead(alert.id)}
                                    >
                                      Mark Read
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => alertSystem.deleteAlert(alert.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No alerts yet</p>
                    <p className="text-sm">You'll see notifications here when they arrive</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {/* General Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableBrowserNotifications}
                      onCheckedChange={(checked) => updateSettings('enableBrowserNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sound Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sound when alerts arrive
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableSoundAlerts}
                      onCheckedChange={(checked) => updateSettings('enableSoundAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Desktop Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show in-app notification overlays
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableDesktopNotifications}
                      onCheckedChange={(checked) => updateSettings('enableDesktopNotifications', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Signal Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Signal Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable Signal Alerts</Label>
                    <Switch
                      checked={settings.signalAlerts.enabled}
                      onCheckedChange={(checked) => updateNestedSettings('signalAlerts', 'enabled', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Confidence (%)</Label>
                    <Input
                      type="number"
                      value={settings.signalAlerts.minConfidence}
                      onChange={(e) => updateNestedSettings('signalAlerts', 'minConfidence', Number(e.target.value))}
                      min="50"
                      max="100"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* News Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">News Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable News Alerts</Label>
                    <Switch
                      checked={settings.newsAlerts.enabled}
                      onCheckedChange={(checked) => updateNestedSettings('newsAlerts', 'enabled', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Alert for Impact Levels</Label>
                    <div className="flex gap-2">
                      {['high', 'medium', 'low'].map((impact) => (
                        <label key={impact} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.newsAlerts.impacts.includes(impact as any)}
                            onChange={(e) => {
                              const impacts = e.target.checked 
                                ? [...settings.newsAlerts.impacts, impact]
                                : settings.newsAlerts.impacts.filter(i => i !== impact);
                              updateNestedSettings('newsAlerts', 'impacts', impacts);
                            }}
                            className="rounded"
                          />
                          <span className="text-sm capitalize">{impact}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable Performance Alerts</Label>
                    <Switch
                      checked={settings.performanceAlerts.enabled}
                      onCheckedChange={(checked) => updateNestedSettings('performanceAlerts', 'enabled', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Drawdown Alert (%)</Label>
                    <Input
                      type="number"
                      value={settings.performanceAlerts.maxDrawdown}
                      onChange={(e) => updateNestedSettings('performanceAlerts', 'maxDrawdown', Number(e.target.value))}
                      min="5"
                      max="50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Min Win Rate Alert (%)</Label>
                    <Input
                      type="number"
                      value={settings.performanceAlerts.minWinRate}
                      onChange={(e) => updateNestedSettings('performanceAlerts', 'minWinRate', Number(e.target.value))}
                      min="30"
                      max="90"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Test Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Test Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => alertSystem.createAlert('signal', 'Test Signal Alert', 'This is a test high-confidence signal', 'high')}
                  >
                    Test Signal Alert
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => alertSystem.createAlert('news', 'Test News Alert', 'This is a test high-impact news event', 'medium')}
                  >
                    Test News Alert
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => alertSystem.createAlert('performance', 'Test Performance Alert', 'This is a test performance warning', 'high')}
                  >
                    Test Performance Alert
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

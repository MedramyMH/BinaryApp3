// Advanced Alert System with Browser Notifications and Sound Alerts
interface Alert {
  id: string;
  type: 'signal' | 'news' | 'economic' | 'performance' | 'system';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  read: boolean;
  actions?: AlertAction[];
}

interface AlertAction {
  label: string;
  action: () => void;
}

interface AlertSettings {
  enableBrowserNotifications: boolean;
  enableSoundAlerts: boolean;
  enableDesktopNotifications: boolean;
  signalAlerts: {
    enabled: boolean;
    minConfidence: number;
    symbols: string[];
    directions: ('BUY' | 'SELL')[];
  };
  newsAlerts: {
    enabled: boolean;
    impacts: ('high' | 'medium' | 'low')[];
    currencies: string[];
  };
  performanceAlerts: {
    enabled: boolean;
    maxDrawdown: number;
    minWinRate: number;
  };
  soundSettings: {
    signalSound: string;
    newsSound: string;
    alertSound: string;
    volume: number;
  };
}

export class AlertSystem {
  private alerts: Alert[] = [];
  private settings: AlertSettings;
  private notificationPermission: NotificationPermission = 'default';
  private audioContext: AudioContext | null = null;
  private subscribers: ((alerts: Alert[]) => void)[] = [];

  constructor() {
    this.settings = this.getDefaultSettings();
    this.initializeAudio();
    this.requestNotificationPermission();
  }

  private getDefaultSettings(): AlertSettings {
    const saved = localStorage.getItem('alertSettings');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      enableBrowserNotifications: true,
      enableSoundAlerts: true,
      enableDesktopNotifications: true,
      signalAlerts: {
        enabled: true,
        minConfidence: 90,
        symbols: [],
        directions: ['BUY', 'SELL']
      },
      newsAlerts: {
        enabled: true,
        impacts: ['high', 'medium'],
        currencies: ['USD', 'EUR', 'GBP', 'JPY']
      },
      performanceAlerts: {
        enabled: true,
        maxDrawdown: 20,
        minWinRate: 60
      },
      soundSettings: {
        signalSound: 'beep',
        newsSound: 'chime',
        alertSound: 'notification',
        volume: 0.7
      }
    };
  }

  private async initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  private async requestNotificationPermission() {
    if ('Notification' in window) {
      this.notificationPermission = await Notification.requestPermission();
    }
  }

  subscribe(callback: (alerts: Alert[]) => void) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: (alerts: Alert[]) => void) {
    const index = this.subscribers.indexOf(callback);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback([...this.alerts]));
  }

  createAlert(
    type: Alert['type'],
    title: string,
    message: string,
    priority: Alert['priority'] = 'medium',
    actions?: AlertAction[]
  ): Alert {
    const alert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      message,
      priority,
      timestamp: new Date(),
      read: false,
      actions
    };

    this.alerts.unshift(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100);
    }

    this.processAlert(alert);
    this.notifySubscribers();
    
    return alert;
  }

  private processAlert(alert: Alert) {
    // Check if alert should be shown based on settings
    if (!this.shouldShowAlert(alert)) {
      return;
    }

    // Play sound if enabled
    if (this.settings.enableSoundAlerts) {
      this.playAlertSound(alert.type);
    }

    // Show browser notification if enabled
    if (this.settings.enableBrowserNotifications && this.notificationPermission === 'granted') {
      this.showBrowserNotification(alert);
    }

    // Show desktop notification if enabled
    if (this.settings.enableDesktopNotifications) {
      this.showDesktopNotification(alert);
    }
  }

  private shouldShowAlert(alert: Alert): boolean {
    switch (alert.type) {
      case 'signal':
        return this.settings.signalAlerts.enabled;
      case 'news':
        return this.settings.newsAlerts.enabled;
      case 'performance':
        return this.settings.performanceAlerts.enabled;
      default:
        return true;
    }
  }

  private playAlertSound(type: Alert['type']) {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Different frequencies for different alert types
      const frequencies = {
        signal: 800,
        news: 600,
        economic: 700,
        performance: 500,
        system: 400
      };

      oscillator.frequency.setValueAtTime(frequencies[type] || 600, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(this.settings.soundSettings.volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Error playing alert sound:', error);
    }
  }

  private showBrowserNotification(alert: Alert) {
    try {
      const notification = new Notification(alert.title, {
        body: alert.message,
        icon: '/favicon.png',
        badge: '/favicon.png',
        tag: alert.id,
        requireInteraction: alert.priority === 'critical',
        silent: !this.settings.enableSoundAlerts
      });

      notification.onclick = () => {
        window.focus();
        this.markAsRead(alert.id);
        notification.close();
      };

      // Auto-close after 10 seconds for non-critical alerts
      if (alert.priority !== 'critical') {
        setTimeout(() => notification.close(), 10000);
      }
    } catch (error) {
      console.warn('Error showing browser notification:', error);
    }
  }

  private showDesktopNotification(alert: Alert) {
    // Create in-app notification overlay
    const notification = document.createElement('div');
    notification.className = `
      fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg border-l-4 
      ${this.getAlertColorClasses(alert.priority)} 
      bg-white animate-in slide-in-from-right duration-300
    `;
    
    notification.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          ${this.getAlertIcon(alert.type)}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">${alert.title}</p>
          <p class="text-sm text-gray-600 mt-1">${alert.message}</p>
          <p class="text-xs text-gray-500 mt-2">${alert.timestamp.toLocaleTimeString()}</p>
        </div>
        <button class="flex-shrink-0 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
          ×
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 8 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 8000);
  }

  private getAlertColorClasses(priority: Alert['priority']): string {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-blue-500 bg-blue-50';
      case 'low': return 'border-gray-500 bg-gray-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  }

  private getAlertIcon(type: Alert['type']): string {
    const icons = {
      signal: '📊',
      news: '📰',
      economic: '📈',
      performance: '⚡',
      system: '⚙️'
    };
    return icons[type] || '🔔';
  }

  // Signal-specific alert methods
  createSignalAlert(signal: any) {
    if (!this.settings.signalAlerts.enabled) return;
    if (signal.confidence < this.settings.signalAlerts.minConfidence) return;

    const priority: Alert['priority'] = signal.confidence >= 95 ? 'high' : 'medium';
    
    this.createAlert(
      'signal',
      `${signal.direction} Signal - ${signal.symbol}`,
      `Confidence: ${signal.confidence.toFixed(1)}% | Timeframe: ${signal.timeframe} | Expiry: ${signal.expiry}`,
      priority,
      [
        {
          label: 'View Signal',
          action: () => {
            // Navigate to signals tab
            const signalsTab = document.querySelector('[data-tab="signals"]') as HTMLElement;
            if (signalsTab) signalsTab.click();
          }
        }
      ]
    );
  }

  createNewsAlert(news: any) {
    if (!this.settings.newsAlerts.enabled) return;
    if (!this.settings.newsAlerts.impacts.includes(news.impact)) return;

    const priority: Alert['priority'] = news.impact === 'high' ? 'high' : 'medium';
    
    this.createAlert(
      'news',
      `${news.impact.toUpperCase()} Impact News`,
      `${news.title} - ${news.currency}`,
      priority
    );
  }

  createPerformanceAlert(metric: string, value: number, threshold: number) {
    if (!this.settings.performanceAlerts.enabled) return;

    const isNegative = value > threshold; // For drawdown, win rate below threshold
    const priority: Alert['priority'] = isNegative ? 'high' : 'medium';
    
    this.createAlert(
      'performance',
      `Performance Alert: ${metric}`,
      `${metric}: ${value.toFixed(1)}% (Threshold: ${threshold}%)`,
      priority,
      [
        {
          label: 'View Performance',
          action: () => {
            const performanceTab = document.querySelector('[data-tab="performance"]') as HTMLElement;
            if (performanceTab) performanceTab.click();
          }
        }
      ]
    );
  }

  markAsRead(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.read = true;
      this.notifySubscribers();
    }
  }

  markAllAsRead() {
    this.alerts.forEach(alert => alert.read = true);
    this.notifySubscribers();
  }

  deleteAlert(alertId: string) {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
    this.notifySubscribers();
  }

  clearAllAlerts() {
    this.alerts = [];
    this.notifySubscribers();
  }

  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  getUnreadCount(): number {
    return this.alerts.filter(a => !a.read).length;
  }

  updateSettings(newSettings: Partial<AlertSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('alertSettings', JSON.stringify(this.settings));
  }

  getSettings(): AlertSettings {
    return { ...this.settings };
  }
}

export const alertSystem = new AlertSystem();

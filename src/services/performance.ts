import { analytics } from './analytics';

class PerformanceMonitor {
  private metrics: Record<string, number[]> = {};

  async measureAsync<T>(label: string, promise: Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await promise;
      const end = performance.now();
      const duration = end - start;
      
      if (!this.metrics[label]) {
        this.metrics[label] = [];
      }
      this.metrics[label].push(duration);

      // Send to analytics
      analytics.track('performance_metric', {
        label,
        duration,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  trackComponent(name: string) {
    const startTime = performance.now();
    return {
      onMount: () => {
        const duration = performance.now() - startTime;
        analytics.track('component_mount', {
          component: name,
          duration,
          timestamp: new Date().toISOString()
        });
      }
    };
  }

  getMetrics() {
    return Object.entries(this.metrics).reduce((acc, [key, values]) => {
      acc[key] = {
        average: values.reduce((sum, val) => sum + val, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        samples: values.length,
      };
      return acc;
    }, {} as Record<string, any>);
  }
}

export const performanceMonitor = new PerformanceMonitor(); 
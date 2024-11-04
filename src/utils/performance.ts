export const performanceMetrics = {
  track(metric: string) {
    const entry = performance.mark(metric);
    
    if (metric.startsWith('end_')) {
      const startMark = metric.replace('end_', 'start_');
      const measure = performance.measure(
        metric.replace('end_', ''),
        startMark,
        metric
      );
      
      // Send to analytics in production
      console.log(`${metric.replace('end_', '')}: ${measure.duration}ms`);
    }
  },
  
  trackComponent(name: string) {
    return {
      onMount: () => performanceMetrics.track(`start_${name}`),
      onUnmount: () => performanceMetrics.track(`end_${name}`)
    };
  }
}; 
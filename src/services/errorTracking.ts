interface ErrorEvent {
  message: string;
  stack?: string;
  componentStack?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

class ErrorTracker {
  private endpoint = import.meta.env.VITE_ERROR_TRACKING_ENDPOINT;

  async trackError(error: Error, metadata?: Record<string, any>) {
    const errorEvent: ErrorEvent = {
      message: error.message,
      stack: error.stack,
      metadata,
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorEvent),
      });
    } catch (e) {
      console.error('Failed to track error:', e);
    }
  }
}

export const errorTracker = new ErrorTracker(); 
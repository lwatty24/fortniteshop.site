import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

class Analytics {
  private sessionId: string;

  constructor() {
    this.sessionId = crypto.randomUUID();
  }

  async track(eventName: string, properties?: Record<string, any>) {
    try {
      const { error } = await supabase
        .from('analytics')
        .insert({
          event_name: eventName,
          properties,
          session_id: this.sessionId,
          user_id: localStorage.getItem('userId')
        });

      if (error) throw error;
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  setUserId(userId: string) {
    localStorage.setItem('userId', userId);
  }
}

export const analytics = new Analytics(); 
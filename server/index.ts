import express from 'express';
import cors from 'cors';
import { supabase } from './lib/supabase';
import { sendWelcomeEmail } from './lib/email';
import { rateLimit } from './lib/rateLimit';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow both development ports
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/notifications/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Received subscription request for:', email);

    // Check if already subscribed
    const { data: existing, error: existingError } = await supabase
      .from('notifications')
      .select()
      .eq('email', email);

    if (existingError) {
      console.error('Error checking existing subscription:', existingError);
      throw existingError;
    }

    // Check if any results were found
    if (existing && existing.length > 0) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    // Store in database
    const { error: insertError } = await supabase
      .from('notifications')
      .insert([{ email, created_at: new Date().toISOString() }]);

    if (insertError) {
      console.error('Error inserting subscription:', insertError);
      throw insertError;
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Continue even if email fails
    }

    console.log('Successfully subscribed:', email);
    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ 
      message: 'Failed to subscribe',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/notifications/unsubscribe', async (req, res) => {
  try {
    const identifier = req.ip;
    const { success } = await rateLimit(identifier);
    if (!success) {
      return res.status(429).json({ message: 'Too many requests' });
    }

    const { email } = req.body;

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('email', email);

    if (error) throw error;

    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ message: 'Failed to unsubscribe' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✨ Server running at http://localhost:${PORT}`);
}); 
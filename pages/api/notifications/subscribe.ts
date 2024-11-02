import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../server/lib/lib/supabase';
import { sendWelcomeEmail } from '../../../../server/lib/email';
import { rateLimit } from '../../../../server/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Rate limiting
    const identifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { success } = await rateLimit(identifier as string);
    if (!success) {
      return res.status(429).json({ message: 'Too many requests' });
    }

    const { email } = req.body;

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('notifications')
      .select()
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    // Store in database
    const { error } = await supabase
      .from('notifications')
      .insert([{ email, created_at: new Date().toISOString() }]);

    if (error) throw error;

    // Send welcome email
    await sendWelcomeEmail(email);

    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Failed to subscribe' });
  }
} 
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../server/lib/lib/supabase';
import { rateLimit } from '../../../../server/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const identifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { success } = await rateLimit(identifier as string);
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
} 
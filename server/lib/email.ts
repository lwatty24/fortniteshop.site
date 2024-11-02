import { Resend } from 'resend';
import * as dotenv from 'dotenv';

dotenv.config();

const RESEND_API_KEY = process.env.VITE_RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(RESEND_API_KEY);

export async function sendWelcomeEmail(email: string) {
  try {
    console.log('Attempting to send welcome email to:', email);
    
    const result = await resend.emails.send({
      from: 'FNShops Browser <updates@fortniteshop.site>',
      to: email,
      subject: 'Welcome to ITEM SHOP! 🎮',
      html: `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #1A1A1A; color: white;">
          <!-- Hero Section -->
          <div style="position: relative; padding: 80px 20px; text-align: center; overflow: hidden;">
            <!-- Background with overlay -->
            <div style="position: absolute; inset: 0; z-index: 1;">
              <div style="position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2940&auto=format&fit=crop'); background-size: cover; background-position: center; filter: brightness(0.4) saturate(1.2);"></div>
              <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(26,26,26,0) 0%, #1A1A1A 100%);"></div>
            </div>

            <!-- Content -->
            <div style="position: relative; z-index: 2; max-width: 600px; margin: 0 auto;">
              <h1 style="font-size: 48px; font-weight: 900; letter-spacing: -0.02em; margin: 0; background: linear-gradient(to right, #FFFFFF, rgba(255,255,255,0.8)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1;">
                ITEM SHOP
              </h1>
              
              <p style="color: rgba(255,255,255,0.9); margin: 24px 0 0 0; font-size: 20px; line-height: 1.6;">
                Get ready for instant notifications about your favorite Fortnite items
              </p>

              <!-- Stats -->
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 48px;">
                <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                  <div style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">⚡️</div>
                  <div style="font-size: 14px; color: rgba(255,255,255,0.7);">Instant Updates</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                  <div style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">🎯</div>
                  <div style="font-size: 14px; color: rgba(255,255,255,0.7);">Wishlist Alerts</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                  <div style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">🎮</div>
                  <div style="font-size: 14px; color: rgba(255,255,255,0.7);">Daily Shop</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Rest of the email content -->
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #1A1A1A;">
            <!-- Welcome Message -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="color: white; font-size: 24px; font-weight: 600; margin: 0;">Welcome to the community!</h2>
              <p style="color: rgba(255,255,255,0.7); margin-top: 12px;">
                You're all set to receive notifications about your favorite items.
              </p>
            </div>

            <!-- Features Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 32px 0;">
              <div style="background: rgba(255,255,255,0.05); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                  🔔
                </div>
                <h3 style="color: white; font-size: 16px; margin: 0 0 8px 0;">Instant Alerts</h3>
                <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0;">Get notified when wishlisted items return</p>
              </div>

              <div style="background: rgba(255,255,255,0.05); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                  🎮
                </div>
                <h3 style="color: white; font-size: 16px; margin: 0 0 8px 0;">Daily Updates</h3>
                <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0;">Stay informed about shop rotations</p>
              </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://fortniteshop.site" style="display: inline-block; background: white; color: black; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                Visit Item Shop
              </a>
            </div>

            <!-- Help Box -->
            <div style="background: rgba(255,255,255,0.05); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); text-align: center; margin: 32px 0;">
              <h4 style="color: white; font-size: 16px; margin: 0 0 8px 0;">Need help?</h4>
              <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0;">
                Just reply to this email - we're here to help!
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">
                You received this email because you subscribed to Item Shop notifications.
                <br>
                <a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none;">Unsubscribe</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `
    });

    if (!result?.data?.id) {
      console.error('Resend API response:', result);
      throw new Error('Invalid response from Resend API');
    }

    console.log(`✉️ Welcome email sent successfully to ${email} (Message ID: ${result.data.id})`);
    return result;
  } catch (error) {
    console.error('Detailed email error:', error);
    throw error;
  }
}

export async function sendItemAlert(email: string, items: { name: string; image: string; price?: number; type: string; rarity: string }[]) {
  try {
    const result = await resend.emails.send({
      from: 'FNShops Browser <updates@fortniteshop.site>',
      to: email,
      subject: 'Your Wishlisted Items Are Back! 🎮',
      html: `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #1A1A1A; color: white;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">Your Wishlisted Items Are Back! 🎮</h1>
            
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                ${items.map(item => `
                  <td style="width: 33.33%; padding: 8px;">
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden;">
                      <img 
                        src="${item.image}" 
                        alt="${item.name}" 
                        style="width: 100%; aspect-ratio: 1; object-fit: cover;"
                      />
                      <div style="padding: 12px;">
                        <div style="font-size: 14px; font-weight: 600; color: white; margin-bottom: 8px;">
                          ${item.name}
                        </div>
                        ${item.price ? `
                          <div style="display: flex; align-items: center; background: rgba(59,130,246,0.1); padding: 4px 8px; border-radius: 8px; margin-bottom: 8px;">
                            <img src="https://fortnite-api.com/images/vbuck.png" alt="V-Bucks" style="width: 16px; height: 16px; margin-right: 4px;" />
                            <span style="color: rgb(59,130,246); font-size: 12px; font-weight: 600;">
                              ${item.price.toLocaleString()}
                            </span>
                          </div>
                        ` : ''}
                      </div>
                    </div>
                  </td>
                `).join('')}
              </tr>
            </table>

            <div style="text-align: center; margin-top: 32px;">
              <a 
                href="https://fortniteshop.site" 
                style="display: inline-block; background: white; color: black; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;"
              >
                View in Item Shop
              </a>
            </div>
          </div>
        </body>
      </html>
    `
    });

    return result;
  } catch (error) {
    console.error('Failed to send item alert email:', error);
    throw error;
  }
} 
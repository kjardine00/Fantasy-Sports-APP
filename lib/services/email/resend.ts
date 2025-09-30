import { Resend } from 'resend';

// Only initialize Resend if API key is available, otherwise use a mock for development
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendLeagueInvite({
  email,
  leagueName,
  inviterName,
  inviteLink,
}: {
  email: string;
  leagueName: string;
  inviterName: string;
  inviteLink: string;
}) {
  // If no Resend API key, just log the email and return success for development
  if (!resend) {
    console.log('📧 [DEV MODE] Would send league invite email:', {
      to: email,
      subject: `You're invited to join ${leagueName}!`,
      inviteLink,
    });
    return { data: { id: 'dev-mode-email' }, error: null };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Fantasy Sports <onboarding@resend.dev>', // Replace with your verified domain
      to: [email],
      subject: `You're invited to join ${leagueName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">⚾ Fantasy Sports Invitation</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">You're invited to join ${leagueName}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              <strong>${inviterName}</strong> has invited you to join their fantasy sports league: 
              <strong style="color: #667eea;">${leagueName}</strong>
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              Ready to draft your dream team and compete for the championship? Click the button below to accept your invitation!
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
              🏆 Join League Now
            </a>
          </div>

          <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">What happens next?</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>If you don't have an account, you'll be prompted to create one</li>
              <li>Once logged in, you'll automatically join the league</li>
              <li>You'll be ready to draft your team and start competing!</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0; padding: 20px; background: #fff3cd; border-radius: 10px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-weight: bold;">
              ⏰ This invitation expires in 7 days
            </p>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          
          <div style="text-align: center; color: #666; font-size: 12px;">
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            <p>This email was sent from your Fantasy Sports app.</p>
          </div>
        </div>
      `,
    });

    return { data, error };
  } catch (error) {
    console.error('Error sending league invite:', error);
    return { data: null, error };
  }
}

export async function sendInviteReminder({
  email,
  leagueName,
  inviterName,
  inviteLink,
}: {
  email: string;
  leagueName: string;
  inviterName: string;
  inviteLink: string;
}) {
  // If no Resend API key, just log the email and return success for development
  if (!resend) {
    console.log('📧 [DEV MODE] Would send invite reminder email:', {
      to: email,
      subject: `Reminder: Join ${leagueName} - Draft Starting Soon!`,
      inviteLink,
    });
    return { data: { id: 'dev-mode-reminder' }, error: null };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Fantasy Sports <noreply@yourdomain.com>',
      to: [email],
      subject: `Reminder: Join ${leagueName} - Draft Starting Soon!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #ff6b6b; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">⏰ Draft Starting Soon!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Don't miss out on ${leagueName}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              <strong>${inviterName}</strong> is still waiting for you to join their fantasy sports league. 
              The draft is approaching and you don't want to miss your chance to build a championship team!
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px;">
              🚀 Join League Now
            </a>
          </div>

          <div style="text-align: center; margin: 30px 0; padding: 20px; background: #fff3cd; border-radius: 10px;">
            <p style="margin: 0; color: #856404; font-weight: bold;">
              ⚠️ This invitation expires soon!
            </p>
          </div>
        </div>
      `,
    });

    return { data, error };
  } catch (error) {
    console.error('Error sending invite reminder:', error);
    return { data: null, error };
  }
}

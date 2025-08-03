import { Resend } from 'resend'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Email configuration
const emailConfig = {
  from: process.env.FROM_EMAIL || 'REPPD <noreply@reppd.com>',
  supportEmail: process.env.SUPPORT_EMAIL || 'support@reppd.com',
  replyTo: process.env.SUPPORT_EMAIL || 'support@reppd.com'
}

// Email templates
const emailTemplates = {
  welcome: {
    subject: '🎉 Welcome to REPPD - Your Campus Community Awaits!',
    getHtml: (firstName: string, verificationLink?: string) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to REPPD</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
            .header { background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background: linear-gradient(135deg, #00ffff 0%, #0080ff 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .feature { display: flex; align-items: center; margin: 20px 0; }
            .feature-icon { width: 40px; height: 40px; background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: white; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Welcome to REPPD!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your campus community platform</p>
            </div>
            
            <div class="content">
              <h2 style="color: #333; margin-bottom: 20px;">Hey ${firstName}! 👋</h2>
              
              <p style="color: #555; line-height: 1.6; font-size: 16px;">
                Welcome to REPPD - the ultimate platform to connect with your campus community! 
                We're excited to have you join thousands of students who are already making the most of their university experience.
              </p>

              <div style="margin: 30px 0;">
                <div class="feature">
                  <div class="feature-icon">🎓</div>
                  <div>
                    <h4 style="margin: 0; color: #333;">Join Communities</h4>
                    <p style="margin: 5px 0 0 0; color: #666;">Connect with clubs, societies, and study groups</p>
                  </div>
                </div>
                
                <div class="feature">
                  <div class="feature-icon">🚗</div>
                  <div>
                    <h4 style="margin: 0; color: #333;">Find Carpools</h4>
                    <p style="margin: 5px 0 0 0; color: #666;">Share rides and save money on commuting</p>
                  </div>
                </div>
                
                <div class="feature">
                  <div class="feature-icon">📚</div>
                  <div>
                    <h4 style="margin: 0; color: #333;">Study Together</h4>
                    <p style="margin: 5px 0 0 0; color: #666;">Form study groups and ace your exams</p>
                  </div>
                </div>
                
                <div class="feature">
                  <div class="feature-icon">📢</div>
                  <div>
                    <h4 style="margin: 0; color: #333;">Stay Updated</h4>
                    <p style="margin: 5px 0 0 0; color: #666;">Get the latest campus news and events</p>
                  </div>
                </div>
              </div>

              ${verificationLink ? `
                <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 30px 0;">
                  <h3 style="color: #0369a1; margin: 0 0 10px 0;">📋 Next Step: Verify Your University ID</h3>
                  <p style="color: #0369a1; margin: 0 0 15px 0;">
                    To ensure a safe community, please verify your university ID to complete your registration.
                  </p>
                  <a href="${verificationLink}" class="button">Verify University ID</a>
                </div>
              ` : ''}

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://reppd.vercel.app'}" class="button">
                  🚀 Explore REPPD
                </a>
              </div>

              <p style="color: #555; line-height: 1.6;">
                If you have any questions or need help getting started, don't hesitate to reach out to our support team.
              </p>

              <p style="color: #555; line-height: 1.6;">
                Happy connecting! 🎉<br>
                The REPPD Team
              </p>
            </div>
            
            <div class="footer">
              <p>© 2024 REPPD. All rights reserved.</p>
              <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #0ea5e9; text-decoration: none;">Help Center</a> | 
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #0ea5e9; text-decoration: none;">Privacy Policy</a> | 
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #0ea5e9; text-decoration: none;">Terms of Service</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  },

  verificationPending: {
    subject: '⏳ ID Verification Submitted - REPPD',
    getHtml: (firstName: string) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ID Verification Pending</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
            .header { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 40px 20px; text-align: center; }
            .content { padding: 40px 30px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: white; margin: 0;">⏳ Verification in Progress</h1>
            </div>
            
            <div class="content">
              <h2 style="color: #333;">Hi ${firstName}!</h2>
              
              <p style="color: #555; line-height: 1.6;">
                Thank you for submitting your university ID for verification. Our team is currently reviewing your documents.
              </p>

              <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #92400e; margin: 0 0 10px 0;">What happens next?</h3>
                <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                  <li>Our team will verify your university ID (usually within 24-48 hours)</li>
                  <li>You'll receive an email notification once verification is complete</li>
                  <li>After approval, you'll have full access to all REPPD features</li>
                </ul>
              </div>

              <p style="color: #555; line-height: 1.6;">
                In the meantime, you can browse communities and explore the platform with limited access.
              </p>

              <p style="color: #555; line-height: 1.6;">
                Questions? Contact us at <a href="mailto:${emailConfig.supportEmail}" style="color: #0ea5e9;">${emailConfig.supportEmail}</a>
              </p>
            </div>
            
            <div class="footer">
              <p>© 2024 REPPD. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  },

  verificationApproved: {
    subject: '🎉 ID Verified - Welcome to REPPD!',
    getHtml: (firstName: string) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ID Verification Approved</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: white; margin: 0;">🎉 Verification Complete!</h1>
            </div>
            
            <div class="content">
              <h2 style="color: #333;">Congratulations ${firstName}!</h2>
              
              <p style="color: #555; line-height: 1.6;">
                Your university ID has been successfully verified! You now have full access to all REPPD features.
              </p>

              <div style="background: #d1fae5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #065f46; margin: 0 0 10px 0;">You can now:</h3>
                <ul style="color: #065f46; margin: 0; padding-left: 20px;">
                  <li>Join any community or club</li>
                  <li>Create and respond to carpool requests</li>
                  <li>Post in the campus feed</li>
                  <li>Access all premium features</li>
                </ul>
              </div>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">Start Exploring REPPD</a>
              </div>

              <p style="color: #555; line-height: 1.6;">
                Welcome to the REPPD community! We're excited to see how you'll connect and engage with your campus.
              </p>
            </div>
            
            <div class="footer">
              <p>© 2024 REPPD. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

// Send welcome email
export async function sendWelcomeEmail(
  email: string, 
  firstName: string, 
  verificationLink?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping email')
      return { success: true }
    }

    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to: [email],
      subject: emailTemplates.welcome.subject,
      html: emailTemplates.welcome.getHtml(firstName, verificationLink),
      replyTo: emailConfig.replyTo
    })

    if (error) {
      console.error('Welcome email error:', error)
      return { success: false, error: error.message }
    }

    console.log('Welcome email sent:', data?.id)
    return { success: true }

  } catch (error) {
    console.error('Welcome email error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

// Send verification pending email
export async function sendVerificationPendingEmail(
  email: string, 
  firstName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping email')
      return { success: true }
    }

    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to: [email],
      subject: emailTemplates.verificationPending.subject,
      html: emailTemplates.verificationPending.getHtml(firstName),
      replyTo: emailConfig.replyTo
    })

    if (error) {
      console.error('Verification pending email error:', error)
      return { success: false, error: error.message }
    }

    console.log('Verification pending email sent:', data?.id)
    return { success: true }

  } catch (error) {
    console.error('Verification pending email error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

// Send verification approved email
export async function sendVerificationApprovedEmail(
  email: string, 
  firstName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping email')
      return { success: true }
    }

    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to: [email],
      subject: emailTemplates.verificationApproved.subject,
      html: emailTemplates.verificationApproved.getHtml(firstName),
      replyTo: emailConfig.replyTo
    })

    if (error) {
      console.error('Verification approved email error:', error)
      return { success: false, error: error.message }
    }

    console.log('Verification approved email sent:', data?.id)
    return { success: true }

  } catch (error) {
    console.error('Verification approved email error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

// Send notification email
export async function sendNotificationEmail(
  email: string,
  subject: string,
  content: string,
  actionUrl?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping email')
      return { success: true }
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f3f4f6; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%); padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .button { display: inline-block; background: #0ea5e9; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: white; margin: 0; font-size: 20px;">REPPD Notification</h1>
            </div>
            
            <div class="content">
              <div style="color: #333; line-height: 1.6;">
                ${content}
              </div>
              
              ${actionUrl ? `
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${actionUrl}" class="button">View on REPPD</a>
                </div>
              ` : ''}
            </div>
            
            <div class="footer">
              <p>© 2024 REPPD. All rights reserved.</p>
              <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings/notifications" style="color: #0ea5e9; text-decoration: none;">Manage Notifications</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to: [email],
      subject,
      html,
      replyTo: emailConfig.replyTo
    })

    if (error) {
      console.error('Notification email error:', error)
      return { success: false, error: error.message }
    }

    console.log('Notification email sent:', data?.id)
    return { success: true }

  } catch (error) {
    console.error('Notification email error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

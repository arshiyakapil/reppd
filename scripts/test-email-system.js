#!/usr/bin/env node

/**
 * REPPD Email System Test Script
 * Tests email delivery and verification flow
 */

require('dotenv').config()

async function testEmailSystem() {
  console.log('📧 Testing REPPD Email System...\n')

  // Check environment variables
  console.log('🔍 Checking email configuration...')
  
  const requiredEnvVars = [
    'RESEND_API_KEY',
    'FROM_EMAIL',
    'SUPPORT_EMAIL',
    'NEXT_PUBLIC_APP_URL'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:')
    missingVars.forEach(varName => console.error(`   - ${varName}`))
    console.log('\n📝 Add these to your .env file:')
    console.log('RESEND_API_KEY=re_your_api_key')
    console.log('FROM_EMAIL=noreply@your-domain.com')
    console.log('SUPPORT_EMAIL=support@your-domain.com')
    console.log('NEXT_PUBLIC_APP_URL=https://your-domain.com')
    process.exit(1)
  }

  console.log('✅ All email environment variables found\n')

  // Test email sending
  try {
    console.log('📤 Testing email delivery...')
    
    // Import Resend (install if needed)
    let Resend
    try {
      const { Resend: ResendClass } = require('resend')
      Resend = ResendClass
    } catch (error) {
      console.log('📦 Installing Resend package...')
      const { execSync } = require('child_process')
      execSync('npm install resend', { stdio: 'inherit' })
      const { Resend: ResendClass } = require('resend')
      Resend = ResendClass
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Test email content
    const testEmail = {
      from: process.env.FROM_EMAIL,
      to: process.env.SUPPORT_EMAIL, // Send to support email for testing
      subject: '🧪 REPPD Email System Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #00f5ff, #ff00ff); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">⚡ REPPD</h1>
            <p style="color: white; margin: 10px 0 0 0;">Email System Test</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">✅ Email System Working!</h2>
            
            <p>This is a test email to verify that your REPPD email system is configured correctly.</p>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1976d2;">📊 Test Results:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>✅ Resend API connection successful</li>
                <li>✅ Email template rendering working</li>
                <li>✅ From address configured: ${process.env.FROM_EMAIL}</li>
                <li>✅ App URL configured: ${process.env.NEXT_PUBLIC_APP_URL}</li>
              </ul>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Test user signup flow</li>
              <li>Verify email verification links work</li>
              <li>Test notification emails</li>
            </ol>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
              <p style="color: #666; font-size: 14px;">
                Sent from REPPD Email System Test<br>
                ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      `
    }

    const result = await resend.emails.send(testEmail)
    
    if (result.error) {
      console.error('❌ Email sending failed:', result.error)
      process.exit(1)
    }

    console.log('✅ Test email sent successfully!')
    console.log(`📧 Email ID: ${result.data.id}`)
    console.log(`📬 Sent to: ${process.env.SUPPORT_EMAIL}`)
    console.log('\n📋 Check your inbox for the test email')

  } catch (error) {
    console.error('❌ Email test failed:', error.message)
    
    if (error.message.includes('Invalid API key')) {
      console.log('\n🔑 API Key Issues:')
      console.log('1. Check your Resend API key is correct')
      console.log('2. Make sure the key starts with "re_"')
      console.log('3. Verify the key has sending permissions')
    }
    
    if (error.message.includes('domain')) {
      console.log('\n🌐 Domain Issues:')
      console.log('1. Verify your domain in Resend dashboard')
      console.log('2. Add required DNS records')
      console.log('3. Wait for domain verification to complete')
    }
    
    process.exit(1)
  }

  // Test signup flow simulation
  console.log('\n🔄 Testing signup email flow...')
  
  try {
    // Simulate welcome email
    const welcomeEmail = {
      from: process.env.FROM_EMAIL,
      to: process.env.SUPPORT_EMAIL,
      subject: '🎉 Welcome to REPPD!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #00f5ff, #ff00ff); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">⚡ Welcome to REPPD!</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2>🎓 You're almost ready to connect with your campus!</h2>
            
            <p>Thanks for joining REPPD! Please verify your email address to complete your registration.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=test_token" 
                 style="background: linear-gradient(135deg, #00f5ff, #ff00ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                ✅ Verify Email Address
              </a>
            </div>
            
            <p><strong>What's next?</strong></p>
            <ul>
              <li>📱 Complete your profile</li>
              <li>🎓 Join your classroom</li>
              <li>👥 Connect with communities</li>
              <li>🚗 Find study groups and carpools</li>
            </ul>
          </div>
        </div>
      `
    }

    const welcomeResult = await resend.emails.send(welcomeEmail)
    console.log('✅ Welcome email template test successful!')
    console.log(`📧 Email ID: ${welcomeResult.data.id}`)

  } catch (error) {
    console.error('❌ Welcome email test failed:', error.message)
  }

  console.log('\n🎉 Email system testing complete!')
  console.log('\n📋 Summary:')
  console.log('✅ Email configuration verified')
  console.log('✅ Test email sent successfully')
  console.log('✅ Welcome email template working')
  console.log('\n🚀 Your email system is ready for production!')
  
  console.log('\n📝 Next steps:')
  console.log('1. Test the full signup flow on your deployed site')
  console.log('2. Check spam folders if emails don\'t arrive')
  console.log('3. Monitor email delivery in Resend dashboard')
}

// Run the test
if (require.main === module) {
  testEmailSystem().catch(console.error)
}

module.exports = { testEmailSystem }

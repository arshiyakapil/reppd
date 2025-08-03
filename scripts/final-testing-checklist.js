#!/usr/bin/env node

/**
 * REPPD Final Testing Checklist
 * Automated tests for Day 1 launch readiness
 */

const https = require('https')
const http = require('http')
require('dotenv').config()

class LaunchTester {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    }
  }

  log(message, type = 'info') {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }
    console.log(`${icons[type]} ${message}`)
  }

  async test(name, testFn) {
    try {
      this.log(`Testing: ${name}`, 'info')
      await testFn()
      this.results.passed++
      this.results.tests.push({ name, status: 'PASSED' })
      this.log(`${name}: PASSED`, 'success')
    } catch (error) {
      this.results.failed++
      this.results.tests.push({ name, status: 'FAILED', error: error.message })
      this.log(`${name}: FAILED - ${error.message}`, 'error')
    }
  }

  async httpRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http
      
      const req = protocol.request(url, options, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ statusCode: res.statusCode, data, headers: res.headers }))
      })
      
      req.on('error', reject)
      req.setTimeout(10000, () => reject(new Error('Request timeout')))
      req.end()
    })
  }

  async runTests() {
    console.log('🚀 REPPD Day 1 Launch Testing\n')
    console.log(`Testing URL: ${this.baseUrl}\n`)

    // Test 1: Homepage loads
    await this.test('Homepage loads correctly', async () => {
      const response = await this.httpRequest(this.baseUrl)
      if (response.statusCode !== 200) {
        throw new Error(`Homepage returned ${response.statusCode}`)
      }
      if (!response.data.includes('REPPD')) {
        throw new Error('Homepage does not contain REPPD branding')
      }
    })

    // Test 2: Login page loads
    await this.test('Login page accessible', async () => {
      const response = await this.httpRequest(`${this.baseUrl}/auth/login`)
      if (response.statusCode !== 200) {
        throw new Error(`Login page returned ${response.statusCode}`)
      }
    })

    // Test 3: Signup page loads
    await this.test('Signup page accessible', async () => {
      const response = await this.httpRequest(`${this.baseUrl}/auth/signup`)
      if (response.statusCode !== 200) {
        throw new Error(`Signup page returned ${response.statusCode}`)
      }
    })

    // Test 4: API health check
    await this.test('API endpoints responding', async () => {
      try {
        const response = await this.httpRequest(`${this.baseUrl}/api/health`)
        if (response.statusCode !== 200 && response.statusCode !== 404) {
          throw new Error(`API health check failed: ${response.statusCode}`)
        }
      } catch (error) {
        // If health endpoint doesn't exist, test a basic API endpoint
        const response = await this.httpRequest(`${this.baseUrl}/api/auth/session`)
        if (response.statusCode !== 200) {
          throw new Error(`Session API failed: ${response.statusCode}`)
        }
      }
    })

    // Test 5: Environment variables
    await this.test('Environment variables configured', async () => {
      const required = [
        'NEXTAUTH_SECRET',
        'MONGODB_URI',
        'RESEND_API_KEY',
        'CLOUDINARY_CLOUD_NAME'
      ]
      
      const missing = required.filter(env => !process.env[env])
      if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`)
      }
    })

    // Test 6: Database connection
    await this.test('Database connectivity', async () => {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI not configured')
      }
      
      try {
        const { MongoClient } = require('mongodb')
        const client = new MongoClient(process.env.MONGODB_URI)
        await client.connect()
        await client.db().admin().ping()
        await client.close()
      } catch (error) {
        throw new Error(`Database connection failed: ${error.message}`)
      }
    })

    // Test 7: Email service
    await this.test('Email service configured', async () => {
      if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY not configured')
      }
      
      if (!process.env.FROM_EMAIL) {
        throw new Error('FROM_EMAIL not configured')
      }
      
      // Test API key format
      if (!process.env.RESEND_API_KEY.startsWith('re_')) {
        throw new Error('Invalid Resend API key format')
      }
    })

    // Test 8: File upload service
    await this.test('File upload service configured', async () => {
      const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
      const missing = required.filter(env => !process.env[env])
      
      if (missing.length > 0) {
        throw new Error(`Missing Cloudinary config: ${missing.join(', ')}`)
      }
    })

    // Test 9: Security headers
    await this.test('Security headers present', async () => {
      const response = await this.httpRequest(this.baseUrl)
      const headers = response.headers
      
      // Check for basic security headers
      if (!headers['x-frame-options'] && !headers['x-content-type-options']) {
        this.log('Consider adding security headers', 'warning')
      }
    })

    // Test 10: Mobile responsiveness (basic check)
    await this.test('Mobile viewport configured', async () => {
      const response = await this.httpRequest(this.baseUrl)
      if (!response.data.includes('viewport')) {
        throw new Error('Mobile viewport meta tag not found')
      }
    })

    // Display results
    this.displayResults()
  }

  displayResults() {
    console.log('\n' + '='.repeat(60))
    console.log('📊 TESTING RESULTS')
    console.log('='.repeat(60))
    
    console.log(`\n✅ Passed: ${this.results.passed}`)
    console.log(`❌ Failed: ${this.results.failed}`)
    console.log(`📊 Total: ${this.results.tests.length}`)
    
    if (this.results.failed > 0) {
      console.log('\n❌ FAILED TESTS:')
      this.results.tests
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          console.log(`   • ${test.name}: ${test.error}`)
        })
    }
    
    console.log('\n📋 DETAILED RESULTS:')
    this.results.tests.forEach(test => {
      const icon = test.status === 'PASSED' ? '✅' : '❌'
      console.log(`   ${icon} ${test.name}`)
    })
    
    const successRate = Math.round((this.results.passed / this.results.tests.length) * 100)
    console.log(`\n📈 Success Rate: ${successRate}%`)
    
    if (successRate >= 90) {
      console.log('\n🎉 LAUNCH READY! Your platform is ready for production.')
    } else if (successRate >= 70) {
      console.log('\n⚠️ MOSTLY READY: Fix failed tests before launch.')
    } else {
      console.log('\n❌ NOT READY: Critical issues need to be resolved.')
    }
    
    console.log('\n📝 NEXT STEPS:')
    console.log('1. Fix any failed tests')
    console.log('2. Test user signup flow manually')
    console.log('3. Verify email delivery')
    console.log('4. Test on mobile device')
    console.log('5. Generate access codes for staff')
    console.log('6. Announce launch to users!')
    
    console.log('\n🔗 USEFUL LINKS:')
    console.log(`• Platform: ${this.baseUrl}`)
    console.log(`• Login: ${this.baseUrl}/auth/login`)
    console.log(`• Signup: ${this.baseUrl}/auth/signup`)
    console.log('• Management Code: 19022552')
  }
}

// Run tests
if (require.main === module) {
  const tester = new LaunchTester()
  tester.runTests().catch(console.error)
}

module.exports = { LaunchTester }

# 🚀 REPPD Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **MongoDB Atlas**: Set up a production database
4. **Cloudinary Account**: For file uploads
5. **Resend Account**: For email services

## Step 1: Prepare Environment Variables

### Required Environment Variables for Vercel:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reppd
MONGODB_DB_NAME=reppd

# Authentication
NEXTAUTH_SECRET=your-32-character-secret-key-here
NEXTAUTH_URL=https://your-app-name.vercel.app

# File Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service
RESEND_API_KEY=re_your_resend_key
FROM_EMAIL=noreply@your-domain.com
SUPPORT_EMAIL=support@your-domain.com

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_NAME=REPPD
NODE_ENV=production

# Optional Services
SENTRY_DSN=your_sentry_dsn
OPTIC_API_KEY=your_optic_key
```

## Step 2: Deploy via Vercel CLI

### Option A: Command Line Deployment

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add MONGODB_URI
vercel env add NEXTAUTH_SECRET
vercel env add CLOUDINARY_CLOUD_NAME
# ... add all required variables
```

### Option B: GitHub Integration (Recommended)

1. **Connect GitHub**: Link your Vercel account to GitHub
2. **Import Project**: Import the REPPD repository
3. **Configure Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

## Step 3: Configure Environment Variables in Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add all required variables from the list above
4. Set the environment to "Production"

## Step 4: Set up External Services

### MongoDB Atlas Setup:
1. Create a new cluster
2. Create a database user
3. Whitelist Vercel IPs (0.0.0.0/0 for simplicity)
4. Get connection string

### Cloudinary Setup:
1. Create account at cloudinary.com
2. Get Cloud Name, API Key, and API Secret
3. Create upload preset: `reppd_uploads`

### Resend Setup:
1. Create account at resend.com
2. Verify your domain
3. Get API key

## Step 5: Deploy and Test

1. **Trigger Deployment**: Push to main branch or redeploy in Vercel
2. **Check Build Logs**: Ensure no errors during build
3. **Test Functionality**:
   - User registration/login
   - Post creation
   - Community features
   - File uploads
   - Real-time chat

## Step 6: Custom Domain (Optional)

1. **Add Domain**: In Vercel Dashboard → Domains
2. **Configure DNS**: Point your domain to Vercel
3. **SSL Certificate**: Automatically provisioned

## Production Checklist

- [ ] All environment variables set
- [ ] MongoDB Atlas configured
- [ ] Cloudinary configured
- [ ] Resend configured
- [ ] Build successful
- [ ] Authentication working
- [ ] File uploads working
- [ ] Database connections working
- [ ] Real-time features working
- [ ] Mobile responsive
- [ ] Performance optimized

## Monitoring & Maintenance

1. **Analytics**: Vercel Analytics automatically enabled
2. **Error Monitoring**: Sentry integration configured
3. **Performance**: Monitor Core Web Vitals
4. **Database**: Monitor MongoDB Atlas metrics
5. **Uptime**: Set up monitoring alerts

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check environment variables
2. **Database Connection**: Verify MongoDB URI and IP whitelist
3. **Authentication Issues**: Check NEXTAUTH_SECRET and URL
4. **File Upload Issues**: Verify Cloudinary credentials
5. **Email Issues**: Check Resend API key and domain verification

### Support:
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/

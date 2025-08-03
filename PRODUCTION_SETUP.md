# 🚀 REPPD Production Setup Guide

## 📋 Pre-Deployment Checklist

### **1. Remove Placeholder Data**

Run the cleanup script to remove all mock/demo data:

```bash
# Clean up placeholder data
node scripts/cleanup-placeholder-data.js

# Seed with real university data
node scripts/seed-database.js
```

### **2. Environment Variables Setup**

Create `.env.production` with real production values:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reppd_production
MONGODB_DB_NAME=reppd_production

# Authentication
NEXTAUTH_SECRET=your_super_secure_32_character_secret_key_here
NEXTAUTH_URL=https://your-domain.com

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service (Resend)
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=noreply@your-domain.com
SUPPORT_EMAIL=support@your-domain.com

# ID Verification (Optional - Optic API)
OPTIC_API_KEY=your_optic_api_key
OPTIC_API_URL=https://api.optic.ai/v1

# Security
BCRYPT_ROUNDS=12

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### **3. Database Setup**

#### **MongoDB Atlas Configuration:**

1. **Create Cluster**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create new cluster (M0 free tier for testing, M10+ for production)
   - Choose region closest to your users

2. **Database User**:
   - Create database user with read/write permissions
   - Use strong password and note credentials

3. **Network Access**:
   - Add IP addresses that need access
   - For Vercel: Add `0.0.0.0/0` (all IPs) or specific Vercel IPs

4. **Connection String**:
   - Get connection string from Atlas dashboard
   - Replace `<username>`, `<password>`, and `<dbname>`

### **4. Email Service Setup**

#### **Resend Configuration:**

1. **Create Account**: [Resend.com](https://resend.com)
2. **Verify Domain**: Add your domain and verify DNS records
3. **Get API Key**: Generate API key from dashboard
4. **Test Email**: Send test email to verify setup

#### **Email Templates**:
- Welcome emails are pre-configured
- Verification emails included
- Notification system ready

### **5. File Upload Setup**

#### **Cloudinary Configuration:**

1. **Create Account**: [Cloudinary.com](https://cloudinary.com)
2. **Get Credentials**: Note Cloud Name, API Key, API Secret
3. **Upload Presets**: Configure upload presets for different file types
4. **Transformations**: Set up image optimization rules

### **6. Deployment to Vercel**

#### **Deploy Steps:**

1. **Connect Repository**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel --prod
   ```

2. **Environment Variables**:
   - Add all production environment variables in Vercel dashboard
   - Go to Project Settings → Environment Variables

3. **Domain Setup**:
   - Add custom domain in Vercel dashboard
   - Configure DNS records as instructed

4. **Build Configuration**:
   - Vercel automatically detects Next.js
   - Uses `vercel.json` configuration we created

### **7. Initial Admin Setup**

After deployment, you'll have an admin account:

- **Email**: `admin@reppd.com`
- **Password**: `admin123`
- **Management Code**: `19022552`

**⚠️ IMPORTANT**: Change admin password immediately after first login!

### **8. User Onboarding Process**

#### **For New Users**:

1. **Registration**: Complete signup form with university details
2. **ID Verification**: Upload front/back of university ID
3. **OCR Processing**: System extracts and validates student data
4. **Email Verification**: Confirm email address
5. **Profile Creation**: Auto-generated from ID data
6. **Access Granted**: Full platform access

#### **For Management Users**:

1. **Generate Access Codes**: Use dev portal to create codes
2. **Distribute Codes**: Give codes to CRs, professors, community leaders
3. **Login with Code**: Users check "management code" during login
4. **Role Assignment**: Automatic role assignment based on code

### **9. Content Moderation Setup**

#### **Automated Moderation**:
- Content filtering is built-in
- Inappropriate content detection
- Automatic flagging system

#### **Manual Moderation**:
- Admin dashboard for content review
- User reporting system
- Community moderation tools

### **10. Monitoring & Analytics**

#### **Built-in Monitoring**:
- System health dashboard
- User activity tracking
- Error monitoring
- Performance metrics

#### **External Monitoring** (Recommended):
- Set up Vercel Analytics
- Configure error tracking (Sentry)
- Database monitoring (MongoDB Atlas)

## 🎯 **Post-Deployment Tasks**

### **Immediate (Day 1)**:
- [ ] Change admin password
- [ ] Test user registration flow
- [ ] Verify email delivery
- [ ] Test ID verification
- [ ] Generate first access codes

### **Week 1**:
- [ ] Monitor system performance
- [ ] Collect user feedback
- [ ] Adjust content moderation rules
- [ ] Create university-specific communities
- [ ] Train community moderators

### **Month 1**:
- [ ] Analyze user engagement
- [ ] Optimize performance
- [ ] Add requested features
- [ ] Scale infrastructure if needed
- [ ] Plan feature roadmap

## 🔧 **Troubleshooting**

### **Common Issues**:

1. **Database Connection**: Check MongoDB Atlas IP whitelist
2. **Email Not Sending**: Verify Resend domain verification
3. **Image Upload Fails**: Check Cloudinary credentials
4. **Login Issues**: Verify NextAuth configuration
5. **ID Verification**: Check Optic API key and quota

### **Support Contacts**:
- **Technical Issues**: Check logs in Vercel dashboard
- **Database Issues**: MongoDB Atlas support
- **Email Issues**: Resend support documentation
- **Domain Issues**: Vercel support

## 🎉 **Success Metrics**

### **Launch Targets**:
- [ ] 100+ registered users in first week
- [ ] 50+ verified students
- [ ] 10+ active communities
- [ ] 500+ posts/interactions
- [ ] 95%+ uptime

### **Growth Metrics**:
- Daily active users
- Post engagement rates
- Community participation
- User retention rates
- Feature adoption

---

**🚀 Your REPPD platform is now ready for production deployment!**

Follow this guide step-by-step to ensure a smooth launch and successful user onboarding.

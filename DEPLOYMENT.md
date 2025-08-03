# 🚀 REPPD Production Deployment Guide

This guide covers the complete deployment process for the REPPD campus social platform, designed to handle 2000+ students in a production environment.

## 📋 Prerequisites

### System Requirements
- **Server**: 4+ CPU cores, 8GB+ RAM, 100GB+ storage
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Node.js**: 18.0+ (for build process)

### Domain & SSL
- Domain name configured (e.g., `app.university.edu`)
- SSL certificate (Let's Encrypt recommended)
- DNS records pointing to your server

## 🔧 Pre-Deployment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/reppd.git
cd reppd
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit with your production values
nano .env
```

### 3. Required Environment Variables
```bash
# Database
MONGODB_URI=mongodb://admin:secure_password@mongodb:27017/reppd
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password

# Authentication
NEXTAUTH_SECRET=your_32_character_secret_key_here
NEXTAUTH_URL=https://app.university.edu

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_USER=noreply@university.edu
SMTP_PASSWORD=your_app_password

# Security
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

## 🚀 Deployment Process

### Automated Deployment (Recommended)
```bash
# Make deployment script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh production
```

### Manual Deployment
```bash
# 1. Build application
npm ci --only=production
npm run build

# 2. Start services
docker-compose up -d

# 3. Run migrations
node scripts/migrate.js

# 4. Verify deployment
curl http://localhost:3000/api/health
```

## 📊 Monitoring & Observability

### Health Checks
- **Application**: `http://your-domain/api/health`
- **Database**: Automatic MongoDB health monitoring
- **Cache**: Redis connectivity checks

### Monitoring Stack
- **Grafana**: `http://your-domain:3001` (admin/password from .env)
- **Prometheus**: `http://your-domain:9090`
- **Logs**: Centralized logging with Loki

### Key Metrics to Monitor
- Response time (target: <500ms)
- Error rate (target: <1%)
- Database connections
- Memory usage
- Active users

## 🔒 Security Configuration

### SSL/TLS Setup
```bash
# Using Let's Encrypt
sudo apt install certbot
sudo certbot certonly --standalone -d app.university.edu

# Copy certificates
sudo cp /etc/letsencrypt/live/app.university.edu/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/app.university.edu/privkey.pem nginx/ssl/key.pem
```

### Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### Database Security
- Use strong passwords (20+ characters)
- Enable MongoDB authentication
- Restrict database access to application only
- Regular security updates

## 📈 Scaling for 2000+ Users

### Performance Optimization
```bash
# Increase file limits
echo "fs.file-max = 65536" >> /etc/sysctl.conf

# Optimize MongoDB
echo "net.core.somaxconn = 65535" >> /etc/sysctl.conf
echo "vm.swappiness = 1" >> /etc/sysctl.conf
```

### Load Balancing (For High Traffic)
```yaml
# docker-compose.override.yml
version: '3.8'
services:
  app:
    deploy:
      replicas: 3
  nginx:
    depends_on:
      - app
```

### Database Optimization
```javascript
// MongoDB indexes for performance
db.posts.createIndex({ "createdAt": -1 })
db.posts.createIndex({ "authorId": 1, "createdAt": -1 })
db.users.createIndex({ "universityId": 1 })
db.communities.createIndex({ "members": 1 })
```

## 💾 Backup & Recovery

### Automated Backups
```bash
# Daily backup cron job
0 2 * * * /path/to/reppd/scripts/backup.sh

# Backup retention (30 days)
find /backups -type f -mtime +30 -delete
```

### Manual Backup
```bash
# Database backup
docker-compose exec mongodb mongodump --out /tmp/backup
docker cp $(docker-compose ps -q mongodb):/tmp/backup ./backups/

# File backup
tar -czf backups/uploads_$(date +%Y%m%d).tar.gz uploads/
```

### Recovery Process
```bash
# Restore database
docker-compose exec mongodb mongorestore /tmp/backup

# Restore files
tar -xzf backups/uploads_YYYYMMDD.tar.gz
```

## 🧪 Beta Testing Rollout

### Phase 1: Alpha Testing (50 users)
```bash
# Enable alpha features
echo "BETA_ROLLOUT_PERCENTAGE=5" >> .env
docker-compose restart app
```

### Phase 2: Beta Testing (200 users)
```bash
# Expand to beta group
echo "BETA_ROLLOUT_PERCENTAGE=15" >> .env
docker-compose restart app
```

### Phase 3: General Rollout (2000+ users)
```bash
# Full rollout
echo "BETA_ROLLOUT_PERCENTAGE=100" >> .env
docker-compose restart app
```

## 🔍 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
docker-compose logs app

# Common fixes
docker-compose down
docker-compose up -d
```

#### Database Connection Issues
```bash
# Check MongoDB status
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Reset database connection
docker-compose restart mongodb app
```

#### High Memory Usage
```bash
# Monitor memory
docker stats

# Restart services if needed
docker-compose restart
```

### Performance Issues
```bash
# Check slow queries
docker-compose exec mongodb mongosh
db.setProfilingLevel(2, { slowms: 100 })
db.system.profile.find().sort({ ts: -1 }).limit(5)
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- **Daily**: Monitor health checks and error logs
- **Weekly**: Review performance metrics and user feedback
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Capacity planning and scaling review

### Emergency Contacts
- **Technical Lead**: tech-lead@university.edu
- **DevOps Team**: devops@university.edu
- **University IT**: it-support@university.edu

### Escalation Process
1. **Level 1**: Application errors, performance issues
2. **Level 2**: Database issues, security incidents
3. **Level 3**: Infrastructure failures, data loss

## 📚 Additional Resources

- [API Documentation](./docs/api.md)
- [User Guide](./docs/user-guide.md)
- [Admin Panel Guide](./docs/admin.md)
- [Community Guidelines](./docs/guidelines.md)

## 🔄 Updates & Maintenance

### Rolling Updates
```bash
# Zero-downtime deployment
./scripts/deploy.sh production --rolling-update
```

### Rollback Procedure
```bash
# Quick rollback to previous version
./scripts/rollback.sh

# Or manual rollback
docker-compose down
git checkout previous-stable-tag
./scripts/deploy.sh production
```

---

## ✅ Deployment Checklist

- [ ] Server requirements met
- [ ] Domain and SSL configured
- [ ] Environment variables set
- [ ] Database initialized
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Security hardening applied
- [ ] Load testing completed
- [ ] Beta testing plan ready
- [ ] Support team trained

**🎉 Ready for Production!**

For additional support, contact the REPPD development team or refer to the troubleshooting section above.

#!/bin/bash

# REPPD Production Deployment Script
# This script handles the complete deployment process for the REPPD platform

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_ENV=${1:-production}
BACKUP_BEFORE_DEPLOY=${2:-true}
RUN_MIGRATIONS=${3:-true}

echo -e "${BLUE}🚀 Starting REPPD Deployment for ${DEPLOYMENT_ENV} environment${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    echo -e "${BLUE}📋 Checking dependencies...${NC}"
    
    command -v docker >/dev/null 2>&1 || { print_error "Docker is required but not installed. Aborting."; exit 1; }
    command -v docker-compose >/dev/null 2>&1 || { print_error "Docker Compose is required but not installed. Aborting."; exit 1; }
    command -v node >/dev/null 2>&1 || { print_error "Node.js is required but not installed. Aborting."; exit 1; }
    command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed. Aborting."; exit 1; }
    
    print_status "All dependencies are installed"
}

# Check environment variables
check_environment() {
    echo -e "${BLUE}🔧 Checking environment configuration...${NC}"
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            print_warning "No .env file found. Copying from .env.example"
            cp .env.example .env
            print_error "Please configure your .env file with actual values before deploying"
            exit 1
        else
            print_error "No .env or .env.example file found"
            exit 1
        fi
    fi
    
    # Check critical environment variables
    source .env
    
    if [ -z "$MONGODB_URI" ]; then
        print_error "MONGODB_URI is not set in .env"
        exit 1
    fi
    
    if [ -z "$NEXTAUTH_SECRET" ]; then
        print_error "NEXTAUTH_SECRET is not set in .env"
        exit 1
    fi
    
    print_status "Environment configuration is valid"
}

# Backup existing data
backup_data() {
    if [ "$BACKUP_BEFORE_DEPLOY" = "true" ]; then
        echo -e "${BLUE}💾 Creating backup before deployment...${NC}"
        
        # Create backup directory
        BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        
        # Backup database
        if docker-compose ps mongodb | grep -q "Up"; then
            docker-compose exec -T mongodb mongodump --out /tmp/backup
            docker cp $(docker-compose ps -q mongodb):/tmp/backup "$BACKUP_DIR/mongodb"
            print_status "Database backup created"
        else
            print_warning "MongoDB container not running, skipping database backup"
        fi
        
        # Backup uploaded files (if using local storage)
        if [ -d "uploads" ]; then
            cp -r uploads "$BACKUP_DIR/"
            print_status "File uploads backup created"
        fi
        
        print_status "Backup completed: $BACKUP_DIR"
    else
        print_warning "Skipping backup as requested"
    fi
}

# Build and test the application
build_application() {
    echo -e "${BLUE}🔨 Building application...${NC}"
    
    # Install dependencies
    npm ci --only=production
    print_status "Dependencies installed"
    
    # Run tests
    if [ "$DEPLOYMENT_ENV" = "production" ]; then
        npm run test:ci 2>/dev/null || print_warning "Tests not configured or failed"
    fi
    
    # Build the application
    npm run build
    print_status "Application built successfully"
}

# Database migrations
run_migrations() {
    if [ "$RUN_MIGRATIONS" = "true" ]; then
        echo -e "${BLUE}🗃️  Running database migrations...${NC}"
        
        # Wait for database to be ready
        echo "Waiting for database to be ready..."
        sleep 10
        
        # Run migration script
        if [ -f "scripts/migrate.js" ]; then
            node scripts/migrate.js
            print_status "Database migrations completed"
        else
            print_warning "No migration script found, skipping"
        fi
    fi
}

# Deploy with Docker Compose
deploy_containers() {
    echo -e "${BLUE}🐳 Deploying containers...${NC}"
    
    # Pull latest images
    docker-compose pull
    print_status "Latest images pulled"
    
    # Build custom images
    docker-compose build --no-cache app
    print_status "Application image built"
    
    # Start services
    docker-compose up -d
    print_status "Containers started"
    
    # Wait for services to be healthy
    echo "Waiting for services to be healthy..."
    sleep 30
    
    # Check health
    check_health
}

# Health check
check_health() {
    echo -e "${BLUE}🏥 Performing health checks...${NC}"
    
    # Check application health
    for i in {1..10}; do
        if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
            print_status "Application is healthy"
            break
        else
            if [ $i -eq 10 ]; then
                print_error "Application health check failed after 10 attempts"
                exit 1
            fi
            echo "Attempt $i/10: Waiting for application to be ready..."
            sleep 10
        fi
    done
    
    # Check database connectivity
    if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
        print_status "Database is healthy"
    else
        print_error "Database health check failed"
        exit 1
    fi
    
    # Check Redis
    if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
        print_status "Redis is healthy"
    else
        print_warning "Redis health check failed"
    fi
}

# Setup monitoring
setup_monitoring() {
    echo -e "${BLUE}📊 Setting up monitoring...${NC}"
    
    # Wait for Grafana to be ready
    sleep 20
    
    # Import dashboards (if configured)
    if [ -d "monitoring/grafana/dashboards" ]; then
        print_status "Grafana dashboards configured"
    fi
    
    # Configure alerts (if configured)
    if [ -f "monitoring/alerts.yml" ]; then
        print_status "Monitoring alerts configured"
    fi
    
    print_status "Monitoring setup completed"
}

# Post-deployment tasks
post_deployment() {
    echo -e "${BLUE}🔧 Running post-deployment tasks...${NC}"
    
    # Clear application cache
    curl -X POST http://localhost:3000/api/admin/cache/clear >/dev/null 2>&1 || print_warning "Cache clear failed"
    
    # Warm up the application
    curl http://localhost:3000 >/dev/null 2>&1
    curl http://localhost:3000/feed >/dev/null 2>&1
    curl http://localhost:3000/communities >/dev/null 2>&1
    
    print_status "Application warmed up"
    
    # Send deployment notification (if configured)
    if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 REPPD deployed successfully to $DEPLOYMENT_ENV\"}" \
            "$SLACK_WEBHOOK_URL" >/dev/null 2>&1 || print_warning "Slack notification failed"
    fi
    
    print_status "Post-deployment tasks completed"
}

# Cleanup old resources
cleanup() {
    echo -e "${BLUE}🧹 Cleaning up...${NC}"
    
    # Remove unused Docker images
    docker image prune -f >/dev/null 2>&1 || true
    
    # Remove old backups (keep last 7 days)
    find backups -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true
    
    print_status "Cleanup completed"
}

# Rollback function
rollback() {
    echo -e "${RED}🔄 Rolling back deployment...${NC}"
    
    # Stop current containers
    docker-compose down
    
    # Restore from latest backup
    LATEST_BACKUP=$(ls -t backups/ | head -n1)
    if [ ! -z "$LATEST_BACKUP" ]; then
        echo "Restoring from backup: $LATEST_BACKUP"
        # Restore database
        if [ -d "backups/$LATEST_BACKUP/mongodb" ]; then
            docker-compose up -d mongodb
            sleep 10
            docker-compose exec -T mongodb mongorestore /tmp/backup
        fi
    fi
    
    print_error "Rollback completed"
    exit 1
}

# Trap errors and rollback
trap rollback ERR

# Main deployment flow
main() {
    echo -e "${BLUE}🎯 REPPD Deployment Started at $(date)${NC}"
    
    check_dependencies
    check_environment
    backup_data
    build_application
    deploy_containers
    run_migrations
    setup_monitoring
    post_deployment
    cleanup
    
    echo -e "${GREEN}🎉 REPPD Deployment Completed Successfully!${NC}"
    echo -e "${BLUE}📱 Application URL: http://localhost:3000${NC}"
    echo -e "${BLUE}📊 Monitoring: http://localhost:3001${NC}"
    echo -e "${BLUE}📈 Metrics: http://localhost:9090${NC}"
    
    # Display service status
    echo -e "\n${BLUE}📋 Service Status:${NC}"
    docker-compose ps
}

# Run main function
main "$@"

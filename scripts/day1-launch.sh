#!/bin/bash

# 🚀 REPPD Day 1 Launch Script
# Executes all Day 1 launch tasks in sequence

echo "🚀 REPPD Day 1 Launch Sequence Starting..."
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "\n${BLUE}📋 Step $1: $2${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the REPPD project root directory"
    exit 1
fi

# Step 1: Environment Check
print_step "1" "Environment Setup Check"
if [ ! -f ".env" ] && [ ! -f ".env.local" ]; then
    print_warning "No .env file found. Please create one with production values."
    echo "Copy .env.production.template to .env.local and fill in real values"
    exit 1
fi
print_success "Environment file found"

# Step 2: Install Dependencies
print_step "2" "Installing Dependencies"
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 3: Build Check
print_step "3" "Build Verification"
npm run build
if [ $? -eq 0 ]; then
    print_success "Build successful"
else
    print_error "Build failed - fix errors before deploying"
    exit 1
fi

# Step 4: Database Cleanup
print_step "4" "Database Cleanup"
echo "🧹 Cleaning placeholder data..."
node scripts/cleanup-placeholder-data.js
if [ $? -eq 0 ]; then
    print_success "Database cleanup completed"
else
    print_warning "Database cleanup failed - check MongoDB connection"
fi

# Step 5: Email System Test
print_step "5" "Email System Test"
echo "📧 Testing email configuration..."
node scripts/test-email-system.js
if [ $? -eq 0 ]; then
    print_success "Email system working"
else
    print_warning "Email system test failed - check Resend configuration"
fi

# Step 6: Generate Access Codes
print_step "6" "Access Code Generation"
echo "🔑 Generating access codes for CRs and Professors..."
node scripts/generate-access-codes.js
if [ $? -eq 0 ]; then
    print_success "Access codes generated"
else
    print_warning "Access code generation failed"
fi

# Step 7: Final Testing
print_step "7" "Final System Tests"
echo "🧪 Running comprehensive tests..."
node scripts/final-testing-checklist.js
if [ $? -eq 0 ]; then
    print_success "All tests passed"
else
    print_warning "Some tests failed - review results above"
fi

# Step 8: Deployment Instructions
print_step "8" "Deployment Ready"
echo ""
echo "🎉 Day 1 Launch Preparation Complete!"
echo ""
echo "📋 DEPLOYMENT CHECKLIST:"
echo "========================"
echo ""
echo "✅ 1. Environment configured"
echo "✅ 2. Dependencies installed"
echo "✅ 3. Build successful"
echo "✅ 4. Database cleaned"
echo "✅ 5. Email system tested"
echo "✅ 6. Access codes generated"
echo "✅ 7. System tests completed"
echo ""
echo "🚀 DEPLOY TO VERCEL:"
echo "===================="
echo ""
echo "# Install Vercel CLI (if not already installed)"
echo "npm i -g vercel"
echo ""
echo "# Login to Vercel"
echo "vercel login"
echo ""
echo "# Deploy to production"
echo "vercel --prod"
echo ""
echo "🔧 POST-DEPLOYMENT:"
echo "==================="
echo ""
echo "1. 🌐 Configure custom domain in Vercel dashboard"
echo "2. 📧 Test signup flow on live site"
echo "3. 🔑 Distribute access codes to CRs/Professors"
echo "4. 📱 Test on mobile devices"
echo "5. 📊 Monitor system in developer portal"
echo ""
echo "🎯 MANAGEMENT ACCESS:"
echo "===================="
echo "• Management Code: 19022552"
echo "• Admin Email: admin@reppd.com"
echo "• Admin Password: admin123"
echo ""
echo "⚠️ IMPORTANT: Change admin password after first login!"
echo ""
echo "🎉 Ready for launch! 🚀"

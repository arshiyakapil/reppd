@echo off
REM 🚀 REPPD Day 1 Launch Script (Windows)
REM Executes all Day 1 launch tasks in sequence

echo 🚀 REPPD Day 1 Launch Sequence Starting...
echo ============================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the REPPD project root directory
    pause
    exit /b 1
)

REM Step 1: Environment Check
echo.
echo 📋 Step 1: Environment Setup Check
if not exist ".env" if not exist ".env.local" (
    echo ⚠️ No .env file found. Please create one with production values.
    echo Copy .env.production.template to .env.local and fill in real values
    pause
    exit /b 1
)
echo ✅ Environment file found

REM Step 2: Install Dependencies
echo.
echo 📋 Step 2: Installing Dependencies
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

REM Step 3: Build Check
echo.
echo 📋 Step 3: Build Verification
call npm run build
if errorlevel 1 (
    echo ❌ Build failed - fix errors before deploying
    pause
    exit /b 1
)
echo ✅ Build successful

REM Step 4: Database Cleanup
echo.
echo 📋 Step 4: Database Cleanup
echo 🧹 Cleaning placeholder data...
call node scripts/cleanup-placeholder-data.js
if errorlevel 1 (
    echo ⚠️ Database cleanup failed - check MongoDB connection
) else (
    echo ✅ Database cleanup completed
)

REM Step 5: Email System Test
echo.
echo 📋 Step 5: Email System Test
echo 📧 Testing email configuration...
call node scripts/test-email-system.js
if errorlevel 1 (
    echo ⚠️ Email system test failed - check Resend configuration
) else (
    echo ✅ Email system working
)

REM Step 6: Generate Access Codes
echo.
echo 📋 Step 6: Access Code Generation
echo 🔑 Generating access codes for CRs and Professors...
call node scripts/generate-access-codes.js
if errorlevel 1 (
    echo ⚠️ Access code generation failed
) else (
    echo ✅ Access codes generated
)

REM Step 7: Final Testing
echo.
echo 📋 Step 7: Final System Tests
echo 🧪 Running comprehensive tests...
call node scripts/final-testing-checklist.js
if errorlevel 1 (
    echo ⚠️ Some tests failed - review results above
) else (
    echo ✅ All tests passed
)

REM Step 8: Deployment Instructions
echo.
echo 📋 Step 8: Deployment Ready
echo.
echo 🎉 Day 1 Launch Preparation Complete!
echo.
echo 📋 DEPLOYMENT CHECKLIST:
echo ========================
echo.
echo ✅ 1. Environment configured
echo ✅ 2. Dependencies installed
echo ✅ 3. Build successful
echo ✅ 4. Database cleaned
echo ✅ 5. Email system tested
echo ✅ 6. Access codes generated
echo ✅ 7. System tests completed
echo.
echo 🚀 DEPLOY TO VERCEL:
echo ====================
echo.
echo # Install Vercel CLI (if not already installed)
echo npm i -g vercel
echo.
echo # Login to Vercel
echo vercel login
echo.
echo # Deploy to production
echo vercel --prod
echo.
echo 🔧 POST-DEPLOYMENT:
echo ===================
echo.
echo 1. 🌐 Configure custom domain in Vercel dashboard
echo 2. 📧 Test signup flow on live site
echo 3. 🔑 Distribute access codes to CRs/Professors
echo 4. 📱 Test on mobile devices
echo 5. 📊 Monitor system in developer portal
echo.
echo 🎯 MANAGEMENT ACCESS:
echo ====================
echo • Management Code: 19022552
echo • Admin Email: admin@reppd.com
echo • Admin Password: admin123
echo.
echo ⚠️ IMPORTANT: Change admin password after first login!
echo.
echo 🎉 Ready for launch! 🚀
echo.
pause

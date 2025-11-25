# AWS Deployment Script for Personal Expense Tracker
# Run: powershell -ExecutionPolicy Bypass -File deploy.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Personal Expense Tracker - AWS Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check AWS CLI
$awsCliExists = $null -ne (Get-Command aws -ErrorAction SilentlyContinue)
if (-not $awsCliExists) {
    Write-Host "❌ AWS CLI not installed. Download from: https://aws.amazon.com/cli/" -ForegroundColor Red
    exit 1
}

# Check Node.js
$nodeExists = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
if (-not $nodeExists) {
    Write-Host "❌ Node.js not installed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prerequisites checked" -ForegroundColor Green
Write-Host ""

# Load environment
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ .env.local file not found. Create it with:" -ForegroundColor Red
    Write-Host "   - MONGODB_URI" -ForegroundColor Yellow
    Write-Host "   - JWT_SECRET" -ForegroundColor Yellow
    Write-Host "   - CDK_DEFAULT_ACCOUNT" -ForegroundColor Yellow
    Write-Host "   - CDK_DEFAULT_REGION" -ForegroundColor Yellow
    exit 1
}

# Load .env.local
$envContent = Get-Content ".env.local" | ConvertFrom-StringData
foreach ($key in $envContent.Keys) {
    [Environment]::SetEnvironmentVariable($key, $envContent[$key], "Process")
}

Write-Host "Environment Variables Loaded:" -ForegroundColor Green
Write-Host "- AWS Account: $($env:CDK_DEFAULT_ACCOUNT)" -ForegroundColor Cyan
Write-Host "- AWS Region: $($env:CDK_DEFAULT_REGION)" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build Backend
Write-Host "Step 1: Building Backend..." -ForegroundColor Yellow
Push-Location "apps\backend"
npm run build
Pop-Location
Write-Host "✅ Backend built" -ForegroundColor Green
Write-Host ""

# Step 2: Build Frontend
Write-Host "Step 2: Building Frontend..." -ForegroundColor Yellow
Push-Location "apps\frontend"
npm run build
Pop-Location
Write-Host "✅ Frontend built" -ForegroundColor Green
Write-Host ""

# Step 3: Install CDK dependencies
Write-Host "Step 3: Installing CDK dependencies..." -ForegroundColor Yellow
Push-Location "infrastructure"
npm install
Pop-Location
Write-Host "✅ CDK dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 4: Bootstrap CDK
Write-Host "Step 4: Bootstrapping AWS CDK..." -ForegroundColor Yellow
Push-Location "infrastructure"
npm run cdk bootstrap 2>$null
Pop-Location
Write-Host "✅ CDK bootstrapped" -ForegroundColor Green
Write-Host ""

# Step 5: Deploy infrastructure
Write-Host "Step 5: Deploying infrastructure to AWS..." -ForegroundColor Yellow
Write-Host "⚠️  You will be prompted to confirm the deployment" -ForegroundColor Yellow
Write-Host ""

Push-Location "infrastructure"
npm run cdk:deploy
Pop-Location

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Outputs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view deployment outputs, run:" -ForegroundColor Yellow
Write-Host "  cd infrastructure; npm run cdk -- list-stacks" -ForegroundColor Cyan
Write-Host ""
Write-Host "Save these values for later use:" -ForegroundColor Yellow
Write-Host "- API Gateway URL (Backend)" -ForegroundColor Cyan
Write-Host "- CloudFront URL (Frontend)" -ForegroundColor Cyan
Write-Host "- S3 Bucket Name" -ForegroundColor Cyan
Write-Host "- CloudFront Distribution ID" -ForegroundColor Cyan
Write-Host ""

# Step 6: Deploy Frontend to S3
$response = Read-Host "Deploy frontend to S3 now? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "Step 6: Deploying frontend to S3..." -ForegroundColor Yellow
    
    # Get bucket name from CDK outputs
    $stackInfo = aws cloudformation describe-stacks `
        --stack-name ExpenseTrackerStack `
        --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' `
        --output text 2>$null
    
    if (-not $stackInfo) {
        Write-Host "❌ Could not find S3 bucket name. Please check CDK deployment output." -ForegroundColor Red
        exit 1
    }
    
    $bucketName = $stackInfo.Trim()
    Write-Host "Syncing frontend to S3 bucket: $bucketName" -ForegroundColor Cyan
    aws s3 sync "apps\frontend\dist" "s3://$bucketName" --delete
    
    # Get CloudFront Distribution ID
    $distId = aws cloudformation describe-stacks `
        --stack-name ExpenseTrackerStack `
        --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' `
        --output text 2>$null
    
    if ($distId) {
        Write-Host "Invalidating CloudFront cache..." -ForegroundColor Cyan
        aws cloudfront create-invalidation --distribution-id $distId --paths "/*"
        Write-Host "✅ CloudFront cache invalidated" -ForegroundColor Green
    }
    
    Write-Host "✅ Frontend deployed" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ All Done!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your expense tracker is now deployed to AWS!" -ForegroundColor Green

#!/bin/bash
set -e

echo "========================================"
echo "Personal Expense Tracker - AWS Deployment"
echo "========================================"
echo ""

# Check prerequisites
echo "Checking prerequisites..."
command -v aws &> /dev/null || { echo "❌ AWS CLI not installed"; exit 1; }
command -v node &> /dev/null || { echo "❌ Node.js not installed"; exit 1; }
echo "✅ Prerequisites checked"
echo ""

# Load environment
if [ ! -f .env.local ]; then
  echo "❌ .env.local file not found. Create it with:"
  echo "   - MONGODB_URI"
  echo "   - JWT_SECRET"
  echo "   - CDK_DEFAULT_ACCOUNT"
  echo "   - CDK_DEFAULT_REGION"
  exit 1
fi

source .env.local

echo "Environment Variables Loaded:"
echo "- AWS Account: $CDK_DEFAULT_ACCOUNT"
echo "- AWS Region: $CDK_DEFAULT_REGION"
echo ""

# Step 1: Build Backend
echo "Step 1: Building Backend..."
cd apps/backend
npm run build
cd ../..
echo "✅ Backend built"
echo ""

# Step 2: Build Frontend
echo "Step 2: Building Frontend..."
cd apps/frontend
npm run build
cd ../..
echo "✅ Frontend built"
echo ""

# Step 3: Install CDK dependencies
echo "Step 3: Installing CDK dependencies..."
cd infrastructure
npm install
cd ..
echo "✅ CDK dependencies installed"
echo ""

# Step 4: Bootstrap CDK (if needed)
echo "Step 4: Bootstrapping AWS CDK..."
cd infrastructure
npm run cdk bootstrap 2>/dev/null || true
cd ..
echo "✅ CDK bootstrapped"
echo ""

# Step 5: Deploy infrastructure
echo "Step 5: Deploying infrastructure to AWS..."
echo "⚠️  You may be prompted to confirm the deployment"
echo ""

cd infrastructure
npm run cdk:deploy

# Capture outputs
OUTPUTS=$(npm run cdk -- list --no-color 2>/dev/null || true)

cd ..

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "========================================"
echo "Deployment Outputs"
echo "========================================"
echo ""
echo "To view deployment outputs, run:"
echo "  cd infrastructure && npm run cdk -- list-stacks"
echo ""
echo "Save these values for later use:"
echo "- API Gateway URL (Backend)"
echo "- CloudFront URL (Frontend)"
echo "- S3 Bucket Name"
echo "- CloudFront Distribution ID"
echo ""

# Step 6: Deploy Frontend to S3
read -p "Deploy frontend to S3 now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Step 6: Deploying frontend to S3..."
  
  # Get bucket name from CDK outputs
  BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name ExpenseTrackerStack \
    --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
    --output text 2>/dev/null || echo "")
  
  if [ -z "$BUCKET_NAME" ]; then
    echo "❌ Could not find S3 bucket name. Please check CDK deployment output."
    exit 1
  fi
  
  echo "Syncing frontend to S3 bucket: $BUCKET_NAME"
  aws s3 sync apps/frontend/dist/ s3://$BUCKET_NAME --delete
  
  # Get CloudFront Distribution ID
  DIST_ID=$(aws cloudformation describe-stacks \
    --stack-name ExpenseTrackerStack \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text 2>/dev/null || echo "")
  
  if [ -n "$DIST_ID" ]; then
    echo "Invalidating CloudFront cache..."
    aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
    echo "✅ CloudFront cache invalidated"
  fi
  
  echo "✅ Frontend deployed"
fi

echo ""
echo "========================================"
echo "✅ All Done!"
echo "========================================"
echo ""
echo "Your expense tracker is now deployed to AWS!"

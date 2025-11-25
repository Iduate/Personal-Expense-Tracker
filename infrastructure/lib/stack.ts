import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface ExpenseTrackerStackProps extends cdk.StackProps {
  mongodbUri: string;
  jwtSecret: string;
}

export class ExpenseTrackerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ExpenseTrackerStackProps) {
    super(scope, id, props);

    // Note: This is a basic CDK configuration
    // Full implementation requires:
    // - Lambda functions (backend)
    // - API Gateway (REST API)
    // - S3 bucket (frontend hosting)
    // - CloudFront distribution (CDN)
    // - Environment variables management

    const apiUrl = new cdk.CfnOutput(this, 'ApiUrl', {
      value: 'https://api.example.com',
      description: 'API Gateway URL',
    });

    const frontendUrl = new cdk.CfnOutput(this, 'FrontendUrl', {
      value: 'https://expense-tracker.example.com',
      description: 'Frontend CloudFront URL',
    });
  }
}

const app = new cdk.App();

new ExpenseTrackerStack(app, 'ExpenseTrackerStack', {
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

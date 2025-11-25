import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";

import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";

// Load environment variables from .env.local file
const envPath = path.join(__dirname, "../../.env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log("✓ Loaded .env.local file for CDK deployment");
} else {
  console.warn("⚠️ .env.local file not found - using environment variables");
}

export interface ExpenseTrackerStackProps extends cdk.StackProps {
  mongodbUri: string;
  jwtSecret: string;
}

export class ExpenseTrackerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ExpenseTrackerStackProps) {
    super(scope, id, props);

    // Backend Lambda with proper bundling - esbuild will bundle all dependencies
    const backendLambda = new NodejsFunction(this, "BackendLambda", {
      entry: path.join(__dirname, "../../apps/backend/src/lambda.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(60),
      memorySize: 512,
      environment: {
        MONGODB_URI: props.mongodbUri,
        JWT_SECRET: props.jwtSecret,
        NODE_ENV: "production",
        DEPLOY_TIME: new Date().toISOString(),
      },
      bundling: {
        // Don't minify to help with debugging
        minify: false,
        // Don't exclude any modules - let esbuild bundle everything
        externalModules: [],
        // Target the exact Node version
        target: "node20",
        // Include source maps for debugging
        sourceMap: false,
        keepNames: true,
      },
    });

    // API Gateway → Lambda
    const api = new apigateway.RestApi(this, "ExpenseTrackerApi", {
      restApiName: "Expense Tracker API",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type", "Authorization"],
      },
    });

    api.root.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(backendLambda),
      anyMethod: true,
    });

    // S3 Bucket for Frontend
    const frontendBucket = new s3.Bucket(this, "FrontendBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudFront for SPA hosting
    const distribution = new cloudfront.Distribution(
      this,
      "FrontendDistribution",
      {
        defaultBehavior: {
          origin: new origins.S3Origin(frontendBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: "index.html",
      }
    );

    // Outputs
    new cdk.CfnOutput(this, "ApiGatewayUrl", {
      value: api.url,
    });

    new cdk.CfnOutput(this, "CloudFrontUrl", {
      value: `https://${distribution.domainName}`,
    });

    new cdk.CfnOutput(this, "FrontendBucketName", {
      value: frontendBucket.bucketName,
    });
  }
}

const app = new cdk.App();

new ExpenseTrackerStack(app, "ExpenseTrackerStack", {
  mongodbUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || "us-east-1",
  },
});

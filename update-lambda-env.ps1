# Update Lambda Environment Variables
# Usage: .\update-lambda-env.ps1 -MongoDBUri "mongodb+srv://..." -JwtSecret "your-secret"

param(
    [Parameter(Mandatory=$true)]
    [string]$MongoDBUri,
    
    [Parameter(Mandatory=$true)]
    [string]$JwtSecret,
    
    [string]$LambdaFunctionName = "ExpenseTrackerStack-BackendLambdaD93C7B96-9a30jsNreAaf",
    [string]$AwsRegion = "us-east-1"
)

Write-Host "`n🔄 Updating Lambda environment variables..." -ForegroundColor Cyan
Write-Host "MongoDB URI: $($MongoDBUri.Substring(0, [Math]::Min(50, $MongoDBUri.Length)))..." -ForegroundColor Gray
Write-Host "JWT Secret: ***" -ForegroundColor Gray
Write-Host "`n"

try {
    aws lambda update-function-configuration `
        --function-name $LambdaFunctionName `
        --region $AwsRegion `
        --environment "Variables={MONGODB_URI=$MongoDBUri,JWT_SECRET=$JwtSecret,NODE_ENV=production}" `
        --output json | Out-Null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Lambda environment variables updated successfully!" -ForegroundColor Green
        Write-Host "`n⏳ Waiting for Lambda update to complete (10 seconds)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        Write-Host "✓ Done! Your backend should now be working." -ForegroundColor Green
        Write-Host "`n🌐 Frontend URL: https://d1a3j9vnt3lui7.cloudfront.net" -ForegroundColor Cyan
        Write-Host "🔌 API URL: https://fpmdy194nh.execute-api.us-east-1.amazonaws.com/prod/api`n" -ForegroundColor Cyan
    }
    else {
        Write-Host "✗ Error updating Lambda environment variables" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
    exit 1
}

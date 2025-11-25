@echo off
REM Update Lambda Environment Variables
REM Usage: update-lambda-env.bat <MONGODB_URI> <JWT_SECRET>

setlocal enabledelayedexpansion

if "%1"=="" (
    echo Usage: update-lambda-env.bat "MONGODB_URI" "JWT_SECRET"
    echo.
    echo Example:
    echo update-lambda-env.bat "mongodb+srv://user:pass@cluster.mongodb.net/expense-tracker" "your-jwt-secret"
    exit /b 1
)

if "%2"=="" (
    echo Error: JWT_SECRET is required
    echo Usage: update-lambda-env.bat "MONGODB_URI" "JWT_SECRET"
    exit /b 1
)

set MONGODB_URI=%1
set JWT_SECRET=%2
set LAMBDA_FUNCTION_NAME=ExpenseTrackerStack-BackendLambdaD93C7B96-9a30jsNreAaf
set AWS_REGION=us-east-1

echo.
echo Updating Lambda environment variables...
echo MONGODB_URI: %MONGODB_URI:~0,50%...
echo JWT_SECRET: ***
echo.

aws lambda update-function-configuration ^
    --function-name %LAMBDA_FUNCTION_NAME% ^
    --region %AWS_REGION% ^
    --environment "Variables={MONGODB_URI=%MONGODB_URI%,JWT_SECRET=%JWT_SECRET%,NODE_ENV=production}"

if %errorlevel% equ 0 (
    echo.
    echo ✓ Lambda environment variables updated successfully!
    echo.
    echo Waiting for Lambda update to complete...
    timeout /t 10 /nobreak
    echo.
    echo ✓ Done! Your backend should now be working.
) else (
    echo.
    echo ✗ Error updating Lambda environment variables
    exit /b 1
)

endlocal

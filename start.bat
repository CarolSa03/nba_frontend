@echo off

if not exist "node_modules\" (
    npm install
)

if not exist ".env" (
    echo VITE_API_BASE_URL=http://localhost:10000/api/ > .env
)

npm run dev

echo.
echo Frontend running on http://localhost:5173
pause
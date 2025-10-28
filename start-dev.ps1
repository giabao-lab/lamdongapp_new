# Start both frontend and backend concurrently
Write-Host "Starting Lam Dong App Development Environment..." -ForegroundColor Green

# Start backend in background
Write-Host "Starting Backend Server (port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\HELLO\Desktop\lamdongapp\backend'; npm start"

# Wait 3 seconds for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting Frontend Server (port 3000)..." -ForegroundColor Blue
cd "C:\Users\HELLO\Desktop\lamdongapp"
npm run dev
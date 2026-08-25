@echo off
cd /d "%~dp0"
echo Starting the Calculus app...
echo Keep this window open while you use the app.
start "" http://127.0.0.1:5173/
npm run dev -- --host 127.0.0.1 --port 5173
echo.
echo The app server stopped. Press any key to close this window.
pause >nul

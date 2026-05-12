@echo off
echo [CHITEK] Building CSS...
call npx @tailwindcss/cli -i assets/css/input.css -o assets/css/tailwind.css --minify
echo.
echo Starting server...
npx serve . --listen 3000
pause

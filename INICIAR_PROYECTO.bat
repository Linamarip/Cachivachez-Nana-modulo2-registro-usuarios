@echo off
title Iniciar Cachivaches NANA
echo ===================================================
echo   INICIANDO APLICACION CACHIVACHES NANA
echo   Proyecto Formativo SENA - Tecnologia ADSO
echo ===================================================
echo.
echo [1/2] Iniciando Servidor Backend Node.js / MySQL (Puerto 8080)...
start "Backend Cachivaches NANA [Puerto 8080]" cmd /k "cd /d \"%~dp0servidor_nana\" && node server.js"

timeout /t 2 /nobreak >nul

echo [2/2] Iniciando Frontend Vue 3 / Vite (Puerto 5173)...
start "Frontend Cachivaches NANA [Puerto 5173]" cmd /k "cd /d \"%~dp0nanainicio\" && npm run dev"

echo.
echo ===================================================
echo Aplicacion iniciada con exito:
echo - Frontend Web: http://localhost:5173/
echo - Backend API:  http://localhost:8080/
echo - Base de datos: MySQL cachivachez_nana_db
echo ===================================================
pause

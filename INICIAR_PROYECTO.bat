@echo off
title Cachivaches NANA - Iniciador del Sistema
echo ========================================================
echo       BIENVENIDO A CACHIVACHES NANA (SISTEMA INTEGRAL)
echo ========================================================
echo.
echo [1/2] Iniciando Servidor Backend Node.js / MySQL (Puerto 8080)...
start "Servidor Backend NANA (8080)" cmd /k "cd /d %~dp0servidor_nana && node server.js"

echo [2/2] Iniciando Servidor Frontend Vue 3 Vite (Puerto 5173)...
start "Servidor Frontend NANA (5173)" cmd /k "cd /d %~dp0nanainicio && npm run dev"

echo.
echo ========================================================
echo Ambos servidores han sido iniciados correctamente!
echo Abre tu navegador en: http://localhost:5173/
echo ========================================================
timeout /t 5

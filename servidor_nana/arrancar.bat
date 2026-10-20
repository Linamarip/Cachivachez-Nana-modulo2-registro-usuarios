@echo off
echo =======================================
echo Iniciando Servidor Backend Cachivachez NANA...
echo Puerto: http://localhost:8080/
echo =======================================

cd /d "%~dp0"

:: Ejecutar servidor Node.js que maneja todos los endpoints y conexión con MySQL
node server.js
pause
